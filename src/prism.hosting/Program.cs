using System;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using Owin;
using System.Reflection;

namespace OwinHostingSample
{
    static class Program
    {
        static void Main(string[] args)
        {
            
            var options = new StartOptions
            {
                ServerFactory = "NowinWebServer",
                Port = 8080
            };

            Assembly assembly = Assembly.Load("NowinWebServer");

            using (WebApp.Start<Startup>(options))
            {
                Console.WriteLine("Running a http server on port 8080");
                Console.ReadKey();
            }
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseWelcomePage();
        }
    }

    
}
