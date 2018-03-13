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
        public static string USER_PIC_FOLDER_URL = YJYGlobal.BLOG_ENDPOINT + "user-pic/";
        public static string USER_DEFAULT_PIC_FOLDER_URL = USER_PIC_FOLDER_URL + "default/";
        public static List<string> USER_DEFAULT_PIC_FILENAMES = new List<string>()
        {
            "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
        };

        public static string GetRandomUserDefaultPicUrl()
        {
            var r = new Random();
            return USER_DEFAULT_PIC_FOLDER_URL + USER_DEFAULT_PIC_FILENAMES[r.Next(USER_DEFAULT_PIC_FILENAMES.Count)];
        }

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