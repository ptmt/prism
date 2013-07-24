using System;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using Owin;
using System.Reflection;
using NowinWebServer;

namespace OwinHostingSample
{
    static class Program
    {
        static void Main(string[] args)
        {
            
            var options = new StartOptions
            {
                ServerFactory = "NowinWebServer.OwinServerFactory",
                Port = 8080
            };
                        

            using (WebApp.Start<Prism.App.Configuration.Startup>(options))
            {
                Console.WriteLine("Running a http server on port 8080");
                Console.ReadKey();
            }
        }
    }
}
