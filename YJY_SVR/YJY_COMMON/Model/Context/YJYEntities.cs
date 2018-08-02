using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Model.Context
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class YJYEntities : DbContext
    {
        public YJYEntities()
            : base("name=YJYEntities")
        {
        }

        public virtual DbSet<AdminUser> AdminUsers { get; set; }
        public virtual DbSet<Balance> Balances { get; set; }
        public virtual DbSet<BalanceType> BalanceTypes { get; set; }
        public virtual DbSet<ETHDeposit> ETHDeposits { get; set; }
        public virtual DbSet<Headline> Headlines { get; set; }
        public virtual DbSet<InvestSetting> InvestSettings { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<PhoneSignupHistory> PhoneSignupHistories { get; set; }
        public virtual DbSet<Position> Positions { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<StatusLike> StatusLikes { get; set; }
        public virtual DbSet<THTDeposit> THTDeposits { get; set; }
        public virtual DbSet<THTWithdrawal> THTWithdrawals { get; set; }
        public virtual DbSet<TimeStampNonce> TimeStampNonces { get; set; }
        public virtual DbSet<Transfer> Transfers { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserFollow> UserFollows { get; set; }
        public virtual DbSet<UserTradeFollow> UserTradeFollows { get; set; }
        public virtual DbSet<VerifyCode> VerifyCodes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Balance>()
                .Property(e => e.Amount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<BalanceType>()
                .Property(e => e.InitAmount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<ETHDeposit>()
                .Property(e => e.PaidAmount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<InvestSetting>()
                .Property(e => e.Amount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<Position>()
                .Property(e => e.SettlePrice)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.Invest)
                .HasPrecision(28, 18);

            modelBuilder.Entity<Position>()
                .Property(e => e.Leverage)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.PL)
                .HasPrecision(28, 18);

            modelBuilder.Entity<Position>()
                .Property(e => e.ClosePrice)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.StopPx)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.TakePx)
                .HasPrecision(18, 8);

            modelBuilder.Entity<THTDeposit>()
                .Property(e => e.PaidAmount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.Amount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.Value)
                .HasPrecision(28, 0);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.CallbackValue)
                .HasPrecision(28, 0);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.CancelRefundValue)
                .HasPrecision(28, 18);

            modelBuilder.Entity<Transfer>()
                .Property(e => e.Amount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<Transfer>()
                .Property(e => e.BalanceAfter)
                .HasPrecision(28, 18);

            //modelBuilder.Entity<User>()
            //    .Property(e => e.Balance)
            //    .HasPrecision(18, 8);

            //modelBuilder.Entity<User>()
            //    .Property(e => e.BalanceEth)
            //    .HasPrecision(28, 18);

            modelBuilder.Entity<UserTradeFollow>()
                .Property(e => e.InvestFixed)
                .HasPrecision(18, 8);

            modelBuilder.Entity<UserTradeFollow>()
                .Property(e => e.InvestRatio)
                .HasPrecision(18, 8);
        }
    }
}
