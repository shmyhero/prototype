using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Model.Context
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class YJYHistoryEntities : DbContext
    {
        public YJYHistoryEntities()
            : base("name=YJYHistoryEntities")
        {
        }

        public virtual DbSet<ApiHit> ApiHits { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
        }
    }
}
