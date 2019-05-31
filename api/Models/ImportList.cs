using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnetCoreReactTemplate.Models
{
  public class ImportList
  {
    [DatabaseGenerated(databaseGeneratedOption: DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string UserId { get; set; }

    public string TargetName { get; set; }

    [Required]
    public DateTime? Date { get; set; }

    [Required]
    public int Count { get; set; }

  }
}
