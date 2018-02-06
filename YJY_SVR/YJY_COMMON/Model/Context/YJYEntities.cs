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

        public virtual DbSet<Position> Positions { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Position>()
                .Property(e => e.SettlePrice)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.Invest)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.Leverage)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.PL)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.ClosePrice)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.StopPx)
                .HasPrecision(18, 8);

            modelBuilder.Entity<Position>()
                .Property(e => e.TakePx)
                .HasPrecision(18, 8);

            modelBuilder.Entity<User>()
                .Property(e => e.Balance)
                .HasPrecision(18, 8);
        }
    }
}
