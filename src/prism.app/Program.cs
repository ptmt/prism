using System;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using Owin;
using System.Reflection;
using NowinWebServer;
using System.Configuration;

namespace Prism.App
{
    static class Program
    {
        static void Main(string[] args)
        {            
            int port = args.Length > 0 ? Int32.Parse(args[0]) : 8888;
            var options = new StartOptions
            {
                ServerFactory = "NowinWebServer.OwinServerFactory",               
                Port = new Nullable<int>(port)
            };
           
            //options.Urls.Add("localhost");
            //options.Urls.Add("prism.phinitive.com");
            //options.Urls.Add("127.0.0.1");
            //options.Settings.Add("env", env);

            //var col = System.Configuration.ConfigurationManager.GetSection("OAuth") as ConfigurationElementCollection;
            //foreach (ConfigurationElement c in col)
            //{
            //    Console.WriteLine(c["clientType"]);
            //}

            using (WebApp.Start<Startup>(options))
            {
                Console.WriteLine("Running a http server on port " + port.ToString());
                while (true) { }
            }
        }
    }
}
