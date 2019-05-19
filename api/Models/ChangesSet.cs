using aspnetCoreReactTemplate.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class ChangesSet
  {
    public IEnumerable<InstaUser> NewFollowers { get; set; }
    public IEnumerable<InstaUser> PastFollowers { get; set; }
  }
}
