using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Prism.App
{
    public class SessionIdHandler
    {
        static public string SessionIdToken = "connect.sid";

        static public Response CookieInject(
            NancyContext context)
        {
            string sessionId;           
            string cookie = String.Empty;

            if (context.Request.Cookies.TryGetValue(SessionIdToken, out cookie))
            {
                sessionId = Guid.NewGuid().ToString();
            }
            else
            {
                sessionId = cookie;
                try
                {
                    Guid guid = Guid.Parse(sessionId);
                }
                catch (FormatException)
                {
                    // Bad session ID. Create a new one.
                    sessionId = Guid.NewGuid().ToString();
                }
            }            
            //context.request.Properties[SessionIdToken] = sessionId;            
            //HttpResponseMessage response = await base.SendAsync(request, cancellationToken);
            //var env = (IDictionary<string, object>)Context.Items[NancyOwinHost.RequestEnvironmentKey];

            context.Response.Cookies.Add(new Nancy.Cookies.NancyCookie(SessionIdToken, sessionId)
            {
                Domain = "phinitive.com",
                Path = "/",
                Expires = new DateTime?(DateTime.Now.AddDays(30))
            });

            return context.Response; ;
        }


    }
}
