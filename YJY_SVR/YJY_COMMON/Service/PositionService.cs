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
    public class PositionService
    {
        public Position CreateNewPosition(int userId, int secId, decimal invest, bool isLong, decimal leverage,
            decimal settlePrice)
        {
            if (invest <= 0 || leverage <= 0)
                throw new ArgumentOutOfRangeException();

            Position position = null;

            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    var userIsolated = dbIsolated.Users.FirstOrDefault(o => o.Id == userId);

                    if (userIsolated != null && userIsolated.Balance >= invest)
                    {
                        userIsolated.Balance = userIsolated.Balance - invest;

                        position = new Position()
                        {
                            CreateTime = DateTime.UtcNow,
                            Invest = invest,
                            Leverage = leverage,
                            UserId = userId,
                            Side = isLong,
                            SecurityId = secId,
                            SettlePrice = settlePrice
                        };

                        dbIsolated.Positions.Add(position);

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return position;
        }
    }
}
