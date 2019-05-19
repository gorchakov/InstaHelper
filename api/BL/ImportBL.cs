using api.BL;
using api.Models;
using aspnetCoreReactTemplate.Models;
using InstaSharper.API;
using InstaSharper.API.Builder;
using InstaSharper.Classes;
using InstaSharper.Logger;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace aspnetCoreReactTemplate.BL
{
  public class ImportBL
  {
    private IInstaApi _instaApi;
    private readonly DefaultDbContext _context;

    public ImportBL(DefaultDbContext context)
    {
      _context = context;
    }

    public async Task Import(UserSettings settings)
    {
      try
      {
        await AuthorizeBot(settings);
        var result = await _instaApi.GetUserFollowersAsync(settings.TargetUsername, PaginationParameters.Empty);
        var followers = result.Value;
        var count = followers.Count;

        var import = new ImportList()
        {
          Date = DateTime.UtcNow,
          Count = followers.Count,
          UserId = settings.UserId,
          TargetName = settings.TargetUsername
        };
        _context.ImportLists.Add(import);
        await _context.SaveChangesAsync();

        foreach (var item in followers)
        {
          var follower = new InstaUser()
          {
            ImportId = import.Id,
            IsPrivate = item.IsPrivate,
            IsVerified = item.IsVerified,
            FullName = item.FullName,
            Pk = item.Pk,
            UserName = item.UserName,
            ProfilePicture = item.ProfilePicture,
            ProfilePictureId = item.ProfilePictureId
          };
          _context.InstaUsers.Add(follower);
        }
        await _context.SaveChangesAsync();
      }
      catch (Exception ex)
      {
        throw ex;
      }       
    }

    public ChangesSet GetChanges(int importId, string userId)
    {
      try
      {
        var result = new ChangesSet();
        var import = _context.ImportLists.Where(x => x.UserId == userId && x.Id == importId).FirstOrDefault();
        if (import == null)
        {
          throw new NullReferenceException("Import not found");
        }

        var previousImports = _context.ImportLists.Where(x => x.UserId == userId && x.TargetName == import.TargetName && x.Id < importId).ToArray();
        var previousImport = _context.ImportLists.Where(x => x.UserId == userId && x.TargetName == import.TargetName && x.Id < importId).OrderByDescending(x => x.Id).FirstOrDefault();
        if (previousImport == null)
        {
          return result;
        }

        var initialImportFollowers = _context.InstaUsers.Where(x => x.ImportId == importId).ToList();
        var previousImportFollowers = _context.InstaUsers.Where(x => x.ImportId == previousImport.Id).ToList();

        result.NewFollowers = initialImportFollowers.Except(previousImportFollowers, new InstaUserComparer());
        result.PastFollowers = previousImportFollowers.Except(initialImportFollowers, new InstaUserComparer());
        return result;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    private async Task<bool> AuthorizeBot(UserSettings settings)
    {
      try
      {        
        var userSession = new UserSessionData
        {
          UserName = settings.BotUserName,
          Password = settings.BotPassword
        };

        var delay = RequestDelay.FromSeconds(2, 2);
        // create new InstaApi instance using Builder
        _instaApi = InstaApiBuilder.CreateBuilder()
            .SetUser(userSession)
            .UseLogger(new DebugLogger(LogLevel.Exceptions)) // use logger for requests and debug messages
            .SetRequestDelay(delay)
            .Build();

        const string stateFile = "state.bin";
        try
        {
          if (File.Exists(stateFile))
          {
            Debug.WriteLine("Loading state from file");
            using (var fs = File.OpenRead(stateFile))
            {
              _instaApi.LoadStateDataFromStream(fs);
            }
          }
        }
        catch (Exception e)
        {
          Debug.WriteLine(e);
        }

        if (!_instaApi.IsUserAuthenticated)
        {
          // login
          Debug.WriteLine($"Logging in as {userSession.UserName}");
          delay.Disable();
          var logInResult = await _instaApi.LoginAsync();
          delay.Enable();
          if (!logInResult.Succeeded)
          {
            Debug.WriteLine($"Unable to login: {logInResult.Info.Message}");
            return false;
          }
        }

        var state = _instaApi.GetStateDataAsStream();
        using (var fileStream = File.Create(stateFile))
        {
          state.Seek(0, SeekOrigin.Begin);
          state.CopyTo(fileStream);
        }
        return false;
      }
      catch (Exception ex)
      {
        Debug.WriteLine(ex);
      }
      finally
      {
        // perform that if user needs to logged out
        // var logoutResult = Task.Run(() => _instaApi.LogoutAsync()).GetAwaiter().GetResult();
        // if (logoutResult.Succeeded) Debug.WriteLine("Logout succeed");
      }
      return false;
    }
  }
}
