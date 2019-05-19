using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnetCoreReactTemplate.Models
{
  public class UserSettings
  {
    [DatabaseGenerated(databaseGeneratedOption: DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }


    public string UserId { get; set; }

    public DateTime? Updated { get; set; }

    [Required]
    public string BotUserName { get; set; }

    [Required]
    public string BotPassword { get; set; }

    [Required]
    public string TargetUsername { get; set; }

    [Required]
    public bool Active { get; set; }

  }
}
