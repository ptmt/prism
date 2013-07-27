using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Prism.App.Data;
using Prism.App.Config;
using Prism.App.Models;

using DotNetOpenAuth.OAuth2;




namespace WebApplication1.Controllers
{
    public class UserController : ApiController
    {
        [Authorize]
        [HttpGet]
        [HttpHeader("x-frame-options", "SAMEORIGIN")] // mitigates clickjacking
        public async Task<ActionResult> Authorize()
        {
            var authServer = new AuthorizationServer(new AuthorizationServerHost());
            var authRequest = await authServer.ReadAuthorizationRequestAsync(this.Request);
            this.ViewData["scope"] = authRequest.Scope;
            this.ViewData["request"] = this.Request.Url;
            return View();
        }

        [Authorize]
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<ActionResult> Respond(string request, bool approval)
        {
            var authServer = new AuthorizationServer(new AuthorizationServerHost());
            var authRequest = await authServer.ReadAuthorizationRequestAsync(new Uri(request));
            IProtocolMessage responseMessage;
            if (approval)
            {
                var grantedResponse = authServer.PrepareApproveAuthorizationRequest(
                    authRequest, this.User.Identity.Name, authRequest.Scope);
                responseMessage = grantedResponse;
            }
            else
            {
                var rejectionResponse = authServer.PrepareRejectAuthorizationRequest(authRequest);
                rejectionResponse.Error = Protocol.EndUserAuthorizationRequestErrorCodes.AccessDenied;
                responseMessage = rejectionResponse;
            }

            var response = await authServer.Channel.PrepareResponseAsync(responseMessage);
            return response.AsActionResult();
        }

        public async Task<ActionResult> Login(string returnUrl)
        {
            var rp = new OpenIdRelyingParty(null);
            Realm officialWebSiteHome = Realm.AutoDetect;
            Uri returnTo = new Uri(this.Request.Url, this.Url.Action("Authenticate"));
            var request = await rp.CreateRequestAsync(WellKnownProviders.Google, officialWebSiteHome, returnTo);
            if (returnUrl != null)
            {
                request.SetUntrustedCallbackArgument("returnUrl", returnUrl);
            }

            var redirectingResponse = await request.GetRedirectingResponseAsync();
            return redirectingResponse.AsActionResult();
        }

        public async Task<ActionResult> Authenticate()
        {
            var rp = new OpenIdRelyingParty(null);
            var response = await rp.GetResponseAsync(this.Request);
            if (response != null)
            {
                if (response.Status == AuthenticationStatus.Authenticated)
                {
                    FormsAuthentication.SetAuthCookie(response.ClaimedIdentifier, false);
                    return this.Redirect(FormsAuthentication.GetRedirectUrl(response.ClaimedIdentifier, false));
                }
            }

            return this.RedirectToAction("Index", "Home");
        }
    }
}