using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Config
{
    public static class IdentityConfig
    {
        public const string CookieAuthenticationType = "Cookies";
        public const string LocalLoginProvider = "Local";

        public static OAuthBearerAuthenticationOptions Bearer { get { return new OAuthBearerAuthenticationOptions(); } }
    }
}
