using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnetCoreReactTemplate.Models
{
    public class Contact
    {
        [DatabaseGenerated(databaseGeneratedOption: DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        [MinLength(3)]
        public string LastName { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string Phone { get; set; }

        [DataType(DataType.EmailAddress)]
        [StringLength(30, MinimumLength = 0)]
        public string Email { get; set; }
    }
}
