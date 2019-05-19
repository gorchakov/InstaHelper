using aspnetCoreReactTemplate.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.BL
{
  public class InstaUserComparer : IEqualityComparer<InstaUser>
  {
    public int GetHashCode(InstaUser co)
    {
      if (co == null)
      {
        return 0;
      }
      return co.Pk.GetHashCode();
    }

    public bool Equals(InstaUser x1, InstaUser x2)
    {
      if (object.ReferenceEquals(x1, x2))
      {
        return true;
      }
      if (object.ReferenceEquals(x1, null) ||
          object.ReferenceEquals(x2, null))
      {
        return false;
      }
      return x1.Pk == x2.Pk;
    }
  }
}
