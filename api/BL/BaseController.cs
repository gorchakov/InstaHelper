using Microsoft.AspNetCore.Mvc;

namespace api.BL
{
  public class BaseController : Controller
  {
    public string CurrentUserId
    {
      get
      {
        return GetCurrentUserId();
      }
    }

    private string GetCurrentUserId()
    {
      return User.FindFirst(SpecialClaimTypes.Id).Value;
    }
  }
}
