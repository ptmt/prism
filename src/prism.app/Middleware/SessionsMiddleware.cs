using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{
  
    using AppFunc = Func<IDictionary<string, object>, Task>;

    /// <summary>
    /// Enables directory browsing
    /// </summary>
    public class SessionsMiddleware
    {
        
        private readonly string _matchUrl;
        private readonly AppFunc _next;


        public SessionsMiddleware(AppFunc next)
        {
            if (next == null)
            {
                throw new ArgumentNullException("next");
            }
           
            _next = next;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="environment"></param>
        /// <returns></returns>
        public Task Invoke(IDictionary<string, object> environment)
        {
            if (environment == null)
            {
                throw new ArgumentNullException("environment");
            }
           
            string sessionIdToken = SessionIdHandler.SessionIdToken;
           // string sessionId;

            Dictionary<string, string[]> headers =  (Dictionary<string, string[]>)environment["owin.RequestHeaders"];

            //// Try to get the session ID from the request; otherwise create a new ID.
            //var cookie = request.Headers.GetCookies(sessionIdToken).FirstOrDefault();
            //if (cookie == null)
            //{
            //    sessionId = Guid.NewGuid().ToString();
            //}
            //else
            //{
            //    sessionId = cookie[sessionIdToken].Value;
            //    try
            //    {
            //        Guid guid = Guid.Parse(sessionId);
            //    }
            //    catch (FormatException)
            //    {
            //        // Bad session ID. Create a new one.
            //        sessionId = Guid.NewGuid().ToString();
            //    }
            //}            
            //request.Properties[sessionIdToken] = sessionId;            
            //HttpResponseMessage response = await base.SendAsync(request, cancellationToken);

            //var cookieHeader = new CookieHeaderValue(SessionIdToken, sessionId);
            //cookieHeader.Domain = "phinitive.com";
            //cookieHeader.Path = "/";
            //cookieHeader.Expires = DateTimeOffset.Now.AddDays(30);
            //response.Headers.AddCookies(new CookieHeaderValue[] {
            //    cookieHeader
            //});

            //return response;

            return _next(environment);
        }

       
    }
}
