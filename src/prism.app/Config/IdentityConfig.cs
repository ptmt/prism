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

        public static async Task<ClaimsIdentity> GetExternalIdentity(HttpContextBase context)
        {
            ClaimsIdentity identity = await context.GetExternalIdentity();

            if (identity == null)
            {
                return null;
            }

            // Change authentication type back to issuer
            Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

            if (providerKeyClaim != null && !String.IsNullOrEmpty(providerKeyClaim.Issuer))
            {
                identity = new ClaimsIdentity(identity.Claims, providerKeyClaim.Issuer, identity.NameClaimType, identity.RoleClaimType);
            }

            DeleteExternalCookie(context.Response);

            return identity;
        }
    }
}
