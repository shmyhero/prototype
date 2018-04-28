using System;
using System.Collections.Generic;
using System.Linq;
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
                    var deposit = dbIsolated.THTDeposits.FirstOrDefault(o => o.Index == depositId);
                    if (deposit != null && deposit.PaidAt == null) //not paid yet
                    {
                        var user = dbIsolated.Users.FirstOrDefault(o => o.THTAddress == deposit.From);
                        if (user != null)
                        {
                            var amount = (decimal) deposit.Value/100;

                            if (amount > 0)
                            {
                                user.Balance = user.Balance + amount;

                                deposit.PaidAt = DateTime.UtcNow;
                                deposit.PaidToUserId = user.Id;

                                var transfer = new Transfer()
                                {
                                    Time = DateTime.UtcNow,
                                    Amount = amount,
                                    BalanceAfter = user.Balance,
                                    Type = "THTDeposit",
                                    UserId = user.Id,
                                    TransactionId = deposit.Index,
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
                            Value = (int?) (amount*100),
                        };
                        dbIsolated.THTWithdrawals.Add(withdrawal);

                        dbIsolated.SaveChanges(); //save to get withdrawal auto id

                        var transfer = new Transfer()
                        {
                            Time = DateTime.UtcNow,
                            Amount = amount,
                            BalanceAfter = user.Balance,
                            Type = "THTWithdrawal",
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
    }
}