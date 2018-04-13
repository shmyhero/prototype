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

        public virtual DbSet<Transfer> Transfers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transfer>()
                .Property(e => e.Amount)
                .HasPrecision(18, 5);

            modelBuilder.Entity<Transfer>()
                .Property(e => e.BalanceAfter)
                .HasPrecision(18, 5);
        }
    }
}
