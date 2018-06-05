using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Service
{
    public class MessageService
    {
        public static void AddAutoCloseMessage(Position autoClosePosition)
        {
            var db = YJYEntities.Create();
            db.Messages.Add(new Message()
            {
                UserId = autoClosePosition.UserId,
                CreateAt = DateTime.UtcNow,
                Type = MessageType.AutoClose.ToString(),
                PosId = autoClosePosition.Id,
            });
            db.SaveChanges();
        }

        public static void AddAutoCloseMessages(List<Position> autoClosePositions)
        {
            if (autoClosePositions == null || autoClosePositions.Count == 0)
                return;

            var db = YJYEntities.Create();
            foreach (var autoClosePosition in autoClosePositions)
            {
                db.Messages.Add(new Message()
                {
                    UserId = autoClosePosition.UserId,
                    CreateAt = DateTime.UtcNow,
                    Type = MessageType.AutoClose.ToString(),
                    PosId = autoClosePosition.Id,
                });
            }
            db.SaveChangesAsync();
        }
    }

    public enum MessageType
    {
        AutoClose
    }
}
