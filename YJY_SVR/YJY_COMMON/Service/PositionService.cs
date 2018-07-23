using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using YJY_COMMON.Enums;
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

                    if (userIsolated != null)
                    {
                        var balance = dbIsolated.Balances.FirstOrDefault(o => o.Id == userIsolated.ActiveBalanceId);

                        if (balance.Amount >= invest)
                        {
                            balance.Amount = balance.Amount - invest;

                            position = new Position()
                            {
                                CreateTime = DateTime.UtcNow,
                                Invest = invest,
                                Leverage = leverage,
                                UserId = userId,
                                Side = isLong,
                                SecurityId = secId,
                                SettlePrice = settlePrice,

                                BalanceId = balance.Id,
                                BalanceTypeId = balance.TypeId,
                            };

                            dbIsolated.Positions.Add(position);

                            dbIsolated.SaveChanges(); //to get position auto id

                            //add a new transfer
                            dbIsolated.Transfers.Add(new Transfer()
                            {
                                Amount = -invest,
                                BalanceAfter = balance.Amount,
                                Time = DateTime.UtcNow,
                                Type = TransferType.Open.ToString(),
                                UserId = userIsolated.Id,
                                PositionId = position.Id, //position id should be populated

                                BalanceId = balance.Id,
                            });

                            dbIsolated.SaveChanges();
                        }
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
                    position = dbIsolated.Positions.FirstOrDefault(o => o.Id == posId && o.UserId==userId && o.SecurityId == secId);
                    var user = dbIsolated.Users.FirstOrDefault(o => o.Id == userId);

                    if (user == null || position == null)
                        throw new ObjectNotFoundException();
                    
                    //position's balance, not user's current active balance
                    var balance = dbIsolated.Balances.FirstOrDefault(o => o.Id == position.BalanceId && o.UserId==user.Id);

                    if (position.ClosedAt == null)
                    {
                        var pl = Trades.CalculatePL(position, closePrice);

                        position.ClosedAt = DateTime.UtcNow;
                        position.ClosePrice = closePrice;
                        position.PL = pl;

                        var pValue = position.Invest + pl;
                        if (pValue > 0)
                        {
                            balance.Amount = balance.Amount + pValue;
                        }

                        //add a new transfer
                        dbIsolated.Transfers.Add(new Transfer()
                        {
                            Amount = pValue,
                            BalanceAfter = balance.Amount,
                            Time = DateTime.UtcNow,
                            Type = TransferType.Close.ToString(),
                            UserId = user.Id,
                            PositionId = position.Id,

                            BalanceId = balance.Id,
                        });

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

                    //position's balance, not user's current active balance
                    var balance = dbIsolated.Balances.FirstOrDefault(o => o.Id == position.BalanceId && o.UserId==user.Id);

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
                            balance.Amount = balance.Amount + pValue;
                        }

                        //add a new transfer
                        dbIsolated.Transfers.Add(new Transfer()
                        {
                            Amount = pValue,
                            BalanceAfter = balance.Amount,
                            Time = DateTime.UtcNow,
                            Type = TransferType.Close.ToString(),
                            UserId = user.Id,
                            PositionId = position.Id,

                            BalanceId = balance.Id,
                        });

                        dbIsolated.SaveChanges();
                    }
                }
                scope.Complete();
            }

            return position;
        }

        public static void CheckAndOpenFollowPositions(int posIdToFollow)
        {
            var db = YJYEntities.Create();
            var basePosition = db.Positions.FirstOrDefault(o => o.Id == posIdToFollow);
            if (basePosition != null)
            {
                var tradeFollows =db.UserTradeFollows.Where(o => o.FollowingId == basePosition.UserId && o.StopAfterCount > 0).ToList();
                foreach (var tradeFollow in tradeFollows)
                {
                    try
                    {
                        using (var scope = new TransactionScope(TransactionScopeOption.RequiresNew,new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
                        {
                            using (var dbIsolated = YJYEntities.Create())
                            {
                                var tFollow = dbIsolated.UserTradeFollows.FirstOrDefault(o => o.UserId == tradeFollow.UserId && o.FollowingId==tradeFollow.FollowingId);

                                if (tFollow != null && tFollow.StopAfterCount > 0)
                                {
                                    var u = dbIsolated.Users.FirstOrDefault(o => o.Id == tFollow.UserId);

                                    if (u != null)
                                    {
                                        var b = dbIsolated.Balances.FirstOrDefault(o => o.Id == u.ActiveBalanceId);

                                        if (b.TypeId == basePosition.BalanceTypeId)//ONLY WHEN trade-follower's active balance type == base position's balance type
                                        {
                                            if (b.Amount < tFollow.InvestFixed) //not enough balance
                                            {
                                                tFollow.StopAfterCount = tFollow.StopAfterCount - 1; //count--

                                                tFollow.LastTriggerAt = DateTime.UtcNow;

                                                if (tFollow.StopAfterCount == 0) //stop following if count == 0
                                                    dbIsolated.UserTradeFollows.Remove(tFollow);

                                                dbIsolated.SaveChanges();
                                            }
                                            else
                                            {
                                                b.Amount = b.Amount - tFollow.InvestFixed;

                                                var p = new Position()
                                                {
                                                    CreateTime = DateTime.UtcNow,
                                                    Invest = tFollow.InvestFixed,
                                                    Leverage = basePosition.Leverage,
                                                    UserId = u.Id,
                                                    Side = basePosition.Side,
                                                    SecurityId = basePosition.SecurityId,
                                                    SettlePrice = basePosition.SettlePrice,

                                                    FollowPosId = basePosition.Id,
                                                    FollowUserId = basePosition.UserId,

                                                    BalanceId = b.Id,
                                                    BalanceTypeId = b.TypeId,
                                                };

                                                dbIsolated.Positions.Add(p);

                                                dbIsolated.SaveChanges(); //to get position auto id

                                                //add a new transfer
                                                dbIsolated.Transfers.Add(new Transfer()
                                                {
                                                    Amount = -tFollow.InvestFixed,
                                                    BalanceAfter = b.Amount,
                                                    Time = DateTime.UtcNow,
                                                    Type = TransferType.Open.ToString(),
                                                    UserId = u.Id,
                                                    PositionId = p.Id, //position id should be populated

                                                    BalanceId = b.Id,
                                                });


                                                tFollow.StopAfterCount = tFollow.StopAfterCount - 1; //count--

                                                tFollow.LastTriggerAt = DateTime.UtcNow;

                                                if (tFollow.StopAfterCount == 0) //stop following if count == 0
                                                    dbIsolated.UserTradeFollows.Remove(tFollow);


                                                dbIsolated.SaveChanges();
                                            }
                                        }
                                    }
                                }
                            }

                            scope.Complete();
                        }
                    }
                    catch (Exception e)
                    {
                        YJYGlobal.LogWarning("copy trade error:");
                        YJYGlobal.LogExceptionAsWarning(e);
                    }
                }
            }
        }

        public static List<Position> CheckAndCloseFollowPositions(int posIdToFollowClose)
        {
            List<Position> result=new List<Position>();

            var db = YJYEntities.Create();
            var basePosition = db.Positions.FirstOrDefault(o => o.Id == posIdToFollowClose);
            if (basePosition != null)
            {
                if (basePosition.ClosedAt != null && basePosition.ClosePrice != null)
                {
                    var positions = db.Positions.Where(o => o.FollowPosId == basePosition.Id && o.ClosedAt==null).ToList();
                    foreach (var position in positions)
                    {
                        try
                        {
                            using (
                                var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                                    new TransactionOptions {IsolationLevel = IsolationLevel.Serializable}))
                            {
                                using (var dbIsolated = YJYEntities.Create())
                                {
                                    var p = dbIsolated.Positions.FirstOrDefault(o => o.Id == position.Id);
                                    var u = dbIsolated.Users.FirstOrDefault(o => o.Id == position.UserId);

                                    if (u == null || p == null)
                                        throw new ObjectNotFoundException();

                                    //position's balance, not user's current active balance
                                    var b = dbIsolated.Balances.FirstOrDefault(o => o.Id == p.BalanceId && o.UserId == u.Id);

                                    if (p.ClosedAt == null)
                                    {
                                        var pl = Trades.CalculatePL(p, basePosition.ClosePrice.Value);

                                        p.ClosedAt = DateTime.UtcNow;
                                        p.ClosePrice = basePosition.ClosePrice.Value;
                                        p.PL = pl;

                                        p.CloseType = PositionCloseType.Follow.ToString();

                                        var pValue = p.Invest + pl;
                                        if (pValue > 0)
                                        {
                                            b.Amount = b.Amount + pValue;
                                        }

                                        //add a new transfer
                                        dbIsolated.Transfers.Add(new Transfer()
                                        {
                                            Amount = pValue,
                                            BalanceAfter = b.Amount,
                                            Time = DateTime.UtcNow,
                                            Type = TransferType.Close.ToString(),
                                            UserId = u.Id,
                                            PositionId = p.Id,

                                            BalanceId = b.Id,
                                        });

                                        dbIsolated.SaveChanges();

                                        result.Add(p);
                                    }
                                }

                                scope.Complete();
                            }
                        }
                        catch (Exception e)
                        {
                            YJYGlobal.LogWarning("follow close error:");
                            YJYGlobal.LogExceptionAsWarning(e);
                        }

                    }
                }
                else
                {
                    YJYGlobal.LogWarning("FOLLOW CLOSE fail: base position is not closed");
                }
            }

            return result;
        }
    }
}
