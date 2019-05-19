using aspnetCoreReactTemplate.BL;
using aspnetCoreReactTemplate.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using app = aspnetCoreReactTemplate;

namespace Tests.Unit
{
  public class Tests
  {
    private DefaultDbContext _context;
    public IConfigurationRoot Configuration { get; set; }

    public Tests()
    {
     var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
      Configuration = builder.Build();

      var optionsBuilder = new DbContextOptionsBuilder<DefaultDbContext>();
      optionsBuilder.UseMySql(Configuration.GetConnectionString("defaultConnection"));
      _context = new DefaultDbContext(optionsBuilder.Options);
    }

    [Fact]
    public void TestNewContactProperties()
    {
      var contact = new app.Models.Contact();

      Assert.True(string.IsNullOrEmpty(contact.LastName));
      Assert.True(string.IsNullOrEmpty(contact.FirstName));
      Assert.True(string.IsNullOrEmpty(contact.Email));
      Assert.True(string.IsNullOrEmpty(contact.Phone));
    }

    [Fact]
    public async Task TestBotAuthorization()
    {
      var bl = new ImportBL(_context);
      var settings = new UserSettings()
      {
        UserId = Guid.NewGuid().ToString(),
        BotPassword = "Nntel5105instagram!",
        BotUserName = "maxgorch",
        TargetUsername = "nastya.novosad.mua"
      };
      await bl.Import(settings);
    }

    [Fact]
    public async Task TestDB()
    {
      var import = new ImportList()
      {
        Count = 1,
        Date = DateTime.UtcNow,
        UserId = Guid.NewGuid().ToString(),
        TargetName = Guid.NewGuid().ToString()
      };
      _context.ImportLists.Add(import);
      await _context.SaveChangesAsync();
    }
  }
}
