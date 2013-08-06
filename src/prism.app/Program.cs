using System;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using Owin;
using System.Reflection;
using NowinWebServer;

namespace Prism.App
{
    static class Program
    {
        static void Main(string[] args)
        {            
            string env = args.GetLength(1) > 0 ? args[0] : "dev";
            var options = new StartOptions
            {
                ServerFactory = "NowinWebServer.OwinServerFactory",               
                Port = 8888
            };

            if (env == "dev")
            {                
                options.Urls.Add("devprism.phinitive.com");                
            }
            options.Urls.Add("localhost");
            options.Urls.Add("prism.phinitive.com");

            using (WebApp.Start<Startup>(options))
            {
                Console.WriteLine("Running a http server on port 8888");
                Console.ReadKey();
            }
        }
    }
}
