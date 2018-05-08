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

        public virtual DbSet<UserTradeFollow> UserTradeFollows { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserTradeFollow>()
                .Property(e => e.InvestFixed)
                .HasPrecision(18, 8);

            modelBuilder.Entity<UserTradeFollow>()
                .Property(e => e.InvestRatio)
                .HasPrecision(18, 8);
        }
    }
}
