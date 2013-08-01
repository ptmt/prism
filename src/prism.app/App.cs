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

            HttpConfiguration config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.MessageHandlers.Add(new SessionIdHandler());
         
            app.UseWebApi(config);

            app.UseFileServer(options =>
            {
                options.WithRequestPath("").WithPhysicalPath("../src/public");
            });

            app.UseSendFileFallback();
            
            app.UseDiagnosticsPage("/diag.html");

            app.UseErrorPage();

         //   app.UseSessions();

            app.Use(typeof(LoggerMiddleware));                      
      
            
        }
    }

    public class LoggerMiddleware
    {
        private readonly Func<IDictionary<string, object>, Task> _next;
        

        public LoggerMiddleware(Func<IDictionary<string, object>, Task> next)
        {
            _next = next;          
        }

        public Task Invoke(IDictionary<string, object> env)
        {
            System.Diagnostics.Trace.WriteLine(string.Format("path nof found: {0}", env["owin.RequestPath"]));
            env["owin.ResponseStatus"] = 404;
            return _next(env);
        }
    }


}
