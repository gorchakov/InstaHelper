using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnetCoreReactTemplate.Models
{
  public class InstaUser
  {
    [DatabaseGenerated(databaseGeneratedOption: DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid Id { get; set; }
    [Required]
    public int ImportId { get; set; }
    public bool IsVerified { get; set; }
    public bool IsPrivate { get; set; }
    [Required]
    public long Pk { get; set; }
    public string ProfilePicture { get; set; }
    public string ProfilePictureId { get; set; }
    [Required]
    public string UserName { get; set; }
    public string FullName { get; set; }    
  }
}
