using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Util
{
    public class Ticks
    {
        private const int CLEAR_HISTORY_WHEN_SIZE_1mTick = 60 * 24 * 10; //xx days' most possible count
        private const int CLEAR_HISTORY_TO_SIZE_1mTick = 60 * 24 * 7; //xx days' most possible count

        private const int CLEAR_HISTORY_WHEN_SIZE_10mTick = 6 * 24 * 15;
        private const int CLEAR_HISTORY_TO_SIZE_10mTick = 6 * 24 * 10;

        private const int CLEAR_HISTORY_WHEN_SIZE_1hTick = 24 * 60;
        private const int CLEAR_HISTORY_TO_SIZE_1hTick = 24 * 40;

        private const int CLEAR_HISTORY_WHEN_SIZE_RawTick = 40000;
        private const int CLEAR_HISTORY_TO_SIZE_RawTick = 20000;

        public static string GetTickListNamePrefix(TickSize tickSize)
        {
            switch (tickSize)
            {
                case TickSize.Raw:
                    return "tick:";
                    break;
                
                default:
                    throw new ArgumentOutOfRangeException("tickSize", tickSize, null);
            }
        }

        public static bool IsTickEqual(DateTime t1, DateTime t2, TickSize tickSize)
        {
            switch (tickSize)
            {
                
                default:
                    throw new ArgumentOutOfRangeException("tickSize", tickSize, null);
            }
        }

        public static int GetClearWhenSize(TickSize tickSize)
        {
            switch (tickSize)
            {
                case TickSize.Raw:
                    return CLEAR_HISTORY_WHEN_SIZE_RawTick;
                    break;
                
                default:
                    throw new ArgumentOutOfRangeException("tickSize", tickSize, null);
            }
        }

        public static int GetClearToSize(TickSize tickSize)
        {
            switch (tickSize)
            {
                case TickSize.Raw:
                    return CLEAR_HISTORY_TO_SIZE_RawTick;
                    break;
               
                default:
                    throw new ArgumentOutOfRangeException("tickSize", tickSize, null);
            }
        }
    }

    public enum TickSize
    {
        Raw,
    }
}
