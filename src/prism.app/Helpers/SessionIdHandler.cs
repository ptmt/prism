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
    public class SessionIdHandler : DelegatingHandler
    {
        static public string SessionIdToken = "prismid";

        async protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string sessionId;

            // Try to get the session ID from the request; otherwise create a new ID.
            var cookie = request.Headers.GetCookies(SessionIdToken).FirstOrDefault();
            if (cookie == null)
            {
                sessionId = Guid.NewGuid().ToString();
            }
            else
            {
                sessionId = cookie[SessionIdToken].Value;
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
            request.Properties[SessionIdToken] = sessionId;            
            HttpResponseMessage response = await base.SendAsync(request, cancellationToken);

            var cookieHeader = new CookieHeaderValue(SessionIdToken, sessionId);
            cookieHeader.Domain = "phinitive.com";
            cookieHeader.Path = "/";
            cookieHeader.Expires = DateTimeOffset.Now.AddDays(30);
            response.Headers.AddCookies(new CookieHeaderValue[] {
                cookieHeader
            });

            return response;
        }
    }
}
