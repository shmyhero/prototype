namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model1")
        {
        }

        public virtual DbSet<Position> Positions { get; set; }

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
        }
    }
}
