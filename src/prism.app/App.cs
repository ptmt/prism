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

            //HttpConfiguration config = new HttpConfiguration();
            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{action}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);            
            //config.MessageHandlers.Add(new SessionIdHandler());

            app.UseLogger()
               .UseErrorPage()
               .UseNancy()
               //.UseWebApi(config)
                //.UseFileServer(options =>
                // {
                //     options.WithRequestPath("").WithPhysicalPath("public");
                // })
               .UseStaticFiles("public")
               .UseSendFileFallback()
               .UseDiagnosticsPage("/test.html");
               
            
        }
    }

}
