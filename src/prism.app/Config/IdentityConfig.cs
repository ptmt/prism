using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Prism.App.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Config
{
    public static class IdentityConfig
    {
        public const string CookieAuthenticationType = "Cookies";
        public const string LocalLoginProvider = "Local";

        public static IUserSecretStore Secrets { get; set; }
        public static IUserLoginStore Logins { get; set; }
        public static IUserStore Users { get; set; }
        
        public static ISecureDataHandler<ClaimsIdentity> ExternalIdentityHandler { get; set; }

        public static OAuthBearerAuthenticationOptions Bearer { get { return new OAuthBearerAuthenticationOptions(); } }
    }
}
