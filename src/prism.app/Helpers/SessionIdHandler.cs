using Nancy;
using Prism.App.Data;
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
        static public string USER_INFO_KEY = "userinfo";
        static public string FOURSQUARE_ACCESS_TOKEN_SESSION_KEY = "fsqAccessToken";
        static public string INSTAGRAM_ACCESS_TOKEN_SESSION_KEY = "instaAccessToken";

        static public string SessionIdToken = "prismid";

        static public Response SessionIdCreate(
            NancyContext context)
        {
            string sessionId;           
            string cookie = String.Empty;
            context.Request.Cookies.TryGetValue(SessionIdToken, out cookie);
            if (String.IsNullOrEmpty(cookie))
            {
                sessionId = Guid.NewGuid().ToString();
            }
            else
            {
                sessionId = cookie;
                try
                {
                    Guid.Parse(sessionId);
                }
                catch (FormatException)
                {
                    // Bad session ID. Create a new one.
                    sessionId = Guid.NewGuid().ToString();
                }
            }                       

            context.Parameters.SessionId = sessionId;
            
            return null; 
        }

        static public void CookieInject(NancyContext context)
        {
            if (context.Parameters.SessionId && !context.Request.Cookies.ContainsKey(SessionIdToken))
            {

                var cookieItem = new Nancy.Cookies.NancyCookie(SessionIdToken, context.Parameters.SessionId)
                {
                    Domain = context.Request.Url.HostName,
                    Path = "/",
                    Expires = new DateTime?(DateTime.Now.AddDays(30))
                };

                context.Response.AddCookie(cookieItem);
            }
            ISessionStore sessionStore = new InMemorySessionStore(context);
            if (sessionStore[FOURSQUARE_ACCESS_TOKEN_SESSION_KEY] != null) 
                CookieAddAuth(context);
            
        }

        static public void CookieAddAuth( NancyContext context)
        {
            var cookieItem = new Nancy.Cookies.NancyCookie("isauth", "true");           
            context.Response.AddCookie(cookieItem);            
        }


    }
}
