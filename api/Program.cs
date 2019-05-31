using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace aspnetCoreReactTemplate
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

      var host = BuildHost(config["serverBindingUrl"], args);
      using (var scope = host.Services.CreateScope())
      {
        var env = scope.ServiceProvider.GetRequiredService<IHostingEnvironment>();
      }

      host.Run();
    }

    public static IWebHost BuildHost(string serverBindingUrl, string[] args) =>
        WebHost.CreateDefaultBuilder(args)
      .UseIIS()
        .UseContentRoot(Directory.GetCurrentDirectory())
        .UseUrls(serverBindingUrl)
      .UseStartup<Startup>()
            .Build();
  }
}
