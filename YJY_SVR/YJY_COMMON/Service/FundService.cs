using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.WindowsAzure.Storage;
using YJY_COMMON.Azure;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Service
{
    public class FundService
    {
        public YJYEntities db { get; set; }

        public FundService(YJYEntities db)
        {
            this.db = db;
        }

        public void SetTHTAddress(int userId, string address)
        {
            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var user = dbIsolated.Users.FirstOrDefault(o => o.Id == userId);
                    if (user != null && user.THTAddress != address)
                    {
                        //make sure no duplicated THT addresses in database
                        if (!string.IsNullOrWhiteSpace(address) && dbIsolated.Users.Any(o => o.THTAddress == address))
                        {
                            throw new ArgumentException("address existed");
                        }

                        user.THTAddress = address;
                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }
        }

        public void AddUserBalanceByTHTDeposit(int depositId)
        {
            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var deposit = dbIsolated.THTDeposits.FirstOrDefault(o => o.Id == depositId);
                    if (deposit != null && deposit.PaidAt == null) //not paid yet
                    {
                        var users = dbIsolated.Users.Where(o => o.THTAddress == deposit.From).ToList();

                        if (users.Count > 1)
                            YJYGlobal.LogWarning("duplicated THTAddress found " + deposit.From);

                        if (users.Count > 0)
                        {
                            var user = users.First();

                            var biRaw=BigInteger.Parse(deposit.TokenAmount);
                            var biAmount = biRaw / new BigInteger(1e18);
                            //var amount = (decimal) deposit.TokenAmount/100*YJYGlobal.BALANCE_TO_TOKEN_RATIO;
                            var amount = (decimal)biAmount * YJYGlobal.BALANCE_TO_TOKEN_RATIO;

                            if (amount > 0)
                            {
                                user.Balance = user.Balance + amount;

                                deposit.PaidAt = DateTime.UtcNow;
                                deposit.PaidAmount = amount;
                                deposit.PaidToUserId = user.Id;

                                var transfer = new Transfer()
                                {
                                    Time = DateTime.UtcNow,
                                    Amount = amount,
                                    BalanceAfter = user.Balance,
                                    Type = TransferType.THTDeposit.ToString(),
                                    UserId = user.Id,
                                    TransactionId = deposit.Id,
                                };
                                dbIsolated.Transfers.Add(transfer);

                                dbIsolated.SaveChanges();
                            }
                        }
                    }
                }
                scope.Complete();
            }
        }

        public int NewTHTWithdrawal(int userId, decimal amount)
        {
            if(amount <= 0)
                throw new ArgumentOutOfRangeException();

            //var amount = ((decimal) value)/100;

            THTWithdrawal withdrawal = null;

            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var user = dbIsolated.Users.FirstOrDefault(o => o.Id == userId);
                    if (user != null)
                    {
                        if (user.Balance < amount)
                            throw new Exception("insufficient balance");

                        if (string.IsNullOrWhiteSpace(user.THTAddress))
                            throw new Exception("empty THT address");

                        user.Balance = user.Balance - amount;

                        withdrawal = new THTWithdrawal()
                        {
                            CreateAt = DateTime.UtcNow,
                            To = user.THTAddress,
                            UserId = user.Id,
                            Amount = amount,
                            Value = (int?) (amount*100/YJYGlobal.BALANCE_TO_TOKEN_RATIO),
                        };
                        dbIsolated.THTWithdrawals.Add(withdrawal);

                        dbIsolated.SaveChanges(); //save to get withdrawal auto id

                        var transfer = new Transfer()
                        {
                            Time = DateTime.UtcNow,
                            Amount = amount,
                            BalanceAfter = user.Balance,
                            Type = TransferType.THTWithdrawal.ToString(),
                            UserId = user.Id,
                            TransactionId = withdrawal.Id, //withdrawal id should be populated
                        };
                        dbIsolated.Transfers.Add(transfer);

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return withdrawal.Id;
        }

        public static THTDeposit AddTHTDeposit(string transactionHash, string @from, string to, string tokenAmount)
        {
            if (string.IsNullOrWhiteSpace(transactionHash)) return null;

            transactionHash = transactionHash.Trim();

            THTDeposit result = null;

            using (
               var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                   new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var any = dbIsolated.THTDeposits.Any(o => o.TransHash == transactionHash);

                    if (!any)
                    {
                        result = new THTDeposit()
                        {
                            TransHash = transactionHash,
                            From = from,
                            To = to,
                            TokenAmount = tokenAmount,
                            CreateAt = DateTime.UtcNow,
                        };

                        dbIsolated.THTDeposits.Add(result);
                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return result;
        }
    }
}