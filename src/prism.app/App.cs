using Nancy;
using Nancy.Conventions;
using Nancy.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace Prism.App
{
    public class Startup
    {        
        public void Configuration(IAppBuilder app)
        {
            app.Use(typeof(LoggerMiddleware));         

            app.UseLogger()
               .UseErrorPage()          
               .UseNancy()            
               .UseDiagnosticsPage("/test.html");               
            
        }
    }
    public class CustomBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);           
            
            conventions.StaticContentsConventions.Add(               
                StaticContentConventionBuilder.AddDirectory("/", "public")
            );
        }
    }

   

}
