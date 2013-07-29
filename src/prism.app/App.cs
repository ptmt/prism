using Owin;

using System.Web.Http;

namespace Prism.App
{
    public class Startup
    {        
        public void Configuration(IAppBuilder app)
        {

            HttpConfiguration config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
         
            app.UseWebApi(config); 

            app.UseFileServer(options =>
            {
                options.WithRequestPath("/");
                options.WithPhysicalPath("../src/assets");               
            });

            app.UseDiagnosticsPage();

            app.CreateLogger("some");

         
            
        }
    }


}
