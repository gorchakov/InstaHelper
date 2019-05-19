using System.Security.Claims;
using System.Security.Principal;

namespace api.BL
{
  public static class Helpers
  {
    public static string GetUserId(this IPrincipal principal)
    {
      var claimsIdentity = (ClaimsIdentity)principal.Identity;
      var claim = claimsIdentity.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
      return claim.Value;
    }
  }
}
