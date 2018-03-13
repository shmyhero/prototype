using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Model.Queue;
using YJY_COMMON.Util;

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

        public Position DoClosePosition(int userId, int posId, int secId, decimal closePrice)
        {
            Position position = null;

            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    position = dbIsolated.Positions.FirstOrDefault(o => o.Id == posId && o.SecurityId == secId);
                    var user = dbIsolated.Users.FirstOrDefault(o => o.Id == userId);

                    if (user == null || position == null)
                        throw new ObjectNotFoundException();

                    if (position.ClosedAt == null)
                    {
                        var pl = Trades.CalculatePL(position, closePrice);

                        position.ClosedAt = DateTime.UtcNow;
                        position.ClosePrice = closePrice;
                        position.PL = pl;

                        var pValue = position.Invest + pl;
                        if (pValue > 0)
                        {
                            user.Balance = user.Balance + pValue;
                        }

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return position;
        }

        public static Position AutoClosePosition(PosToClose posToClose)
        {
            Position position = null;

            using (
                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
            {
                using (var dbIsolated = YJYEntities.Create())
                {
                    position = dbIsolated.Positions.FirstOrDefault(o => o.Id == posToClose.Id);
                    var user = dbIsolated.Users.FirstOrDefault(o => o.Id == position.UserId);

                    if (user == null || position == null)
                        throw new ObjectNotFoundException();

                    if (position.ClosedAt == null)
                    {
                        var pl = Trades.CalculatePL(position, posToClose.closePx);

                        position.ClosedAt = DateTime.UtcNow;
                        position.PL = pl;

                        position.CloseType = posToClose.closeType.ToString();
                        position.ClosePrice = posToClose.closePx;
                        position.ClosePriceTime = posToClose.closePxTime;

                        var pValue = position.Invest + pl;
                        if (pValue > 0)
                        {
                            user.Balance = user.Balance + pValue;
                        }

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return position;
        }
    }
}
