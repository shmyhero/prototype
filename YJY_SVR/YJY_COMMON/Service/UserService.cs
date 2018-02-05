using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
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
            if(string.IsNullOrWhiteSpace(phone))
                throw new ArgumentNullException();

            //creating new user if phone doesn't exist in a new transaction
            using (var scope = new TransactionScope(TransactionScopeOption.RequiresNew, new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var userIsolated = dbIsolated.Users.FirstOrDefault(o => o.Phone == phone);
                    if (userIsolated == null)
                    {
                        userIsolated = new User
                        {
                            CreatedAt = DateTime.UtcNow,
                            Phone = phone,
                            AuthToken = NewToken(),

                            Balance = 100000,
                        };
                        dbIsolated.Users.Add(userIsolated);

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }
        }
    }
}