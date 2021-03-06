﻿using System;
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
    public class UserService
    {
        public YJYEntities db { get; set; }

        public UserService(YJYEntities db)
        {
            this.db = db;
        }

        public static string NewToken()
        {
            return Guid.NewGuid().ToString("N");
        }

        public void CreateUserByPhone(string phone)
        {
            if(String.IsNullOrWhiteSpace(phone))
                throw new ArgumentNullException();

            //creating new user if phone doesn't exist in a new transaction
            using (var scope = new TransactionScope(TransactionScopeOption.RequiresNew, new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var userIsolated = dbIsolated.Users.FirstOrDefault(o => o.Phone == phone);
                    if (userIsolated == null)
                    {
                        string token = NewToken();
                        userIsolated = new User
                        {
                            CreatedAt = DateTime.UtcNow,
                            Phone = phone,
                            AuthToken = token,

                            //Balance = YJYGlobal.NEW_USER_INIT_BALANCE,
                            //BalanceEth = YJYGlobal.NEW_USER_INIT_BALANCE_ETH,
                            InvitationCode = token.Substring(0, 4)
                        };
                        dbIsolated.Users.Add(userIsolated);

                        dbIsolated.SaveChanges();

                        var balanceType = dbIsolated.BalanceTypes.FirstOrDefault(o => o.Id == 1);
                        var balance = new Balance()
                        {
                            Amount = balanceType.InitAmount,
                            TypeId = balanceType.Id,
                            UserId = userIsolated.Id,
                        };
                        dbIsolated.Balances.Add(balance);
                        dbIsolated.SaveChanges();

                        userIsolated.ActiveBalanceId = balance.Id;
                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }
        }
    }
}