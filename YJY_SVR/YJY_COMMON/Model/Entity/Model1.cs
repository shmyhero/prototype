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

        public virtual DbSet<THTWithdrawal> THTWithdrawals { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.Amount)
                .HasPrecision(28, 18);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.Value)
                .HasPrecision(28, 0);

            modelBuilder.Entity<THTWithdrawal>()
                .Property(e => e.CallbackValue)
                .HasPrecision(28, 0);
        }
    }
}
