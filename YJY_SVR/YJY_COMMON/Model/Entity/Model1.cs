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

        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(e => e.Balance)
                .HasPrecision(18, 8);

            modelBuilder.Entity<User>()
                .Property(e => e.BalanceEth)
                .HasPrecision(28, 18);
        }
    }
}
