using Nancy;
using Nancy.Helpers;
using Newtonsoft.Json.Linq;
using OAuth2;
using OAuth2.Client;
using OAuth2.Client.Impl;
using OAuth2.Models;
using Prism.App.Data;
using Prism.App.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Modules
{
    public class ApiModule : NancyModule
    {

       

        private readonly AuthorizationRoot authorizationRoot;        
        private readonly FoursquareProcessing foursquareProcessing;

        public ApiModule()
            : base("/api")
        {           
            this.authorizationRoot = new AuthorizationRoot();
            this.foursquareProcessing = new FoursquareProcessing();

            Before += SessionIdHandler.SessionIdCreate;
            After += SessionIdHandler.CookieInject;
            OnError.AddItemToEndOfPipeline((z, a) =>
            {
                Console.Write("Unhandled error on request: " + z.Request.Url + " : " + a.Message, a);
                return Response.AsText(a.Message + "\n" + a.StackTrace);
            });

            Get["/signin/{service}"] = _ =>
            {
                string loginurl = FilterLoginUrl(GetClientByName(_.service).GetLoginLinkUri(), _.service);
                return Response.AsRedirect(loginurl);                
            };

            Get["/auth/{service}"] = _ =>
            {             
                ISessionStore sessionStore = new InMemorySessionStore(this.Context);

                var info = GetClientByName(_.service).GetUserInfo(HttpUtility.ParseQueryString(this.Request.Url.Query));
                sessionStore.Add(SessionIdHandler.USER_INFO_KEY, info);
                string code = String.Empty;
                string redirectUrl = "/";
                switch ((string)_.service)
                {
                    case "foursquare":
                        code = (GetFoursquareClient() as FoursquareClient).GetAccessCode(HttpUtility.ParseQueryString(this.Request.Url.Query));
                        sessionStore.Add(SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY, code);
                        break;
                    case "instagram" :
                        code = (GetFoursquareClient() as InstagramClient).AccessToken;// GetAccessCode(HttpUtility.ParseQueryString(this.Request.Url.Query));
                        sessionStore.Add(SessionIdHandler.INSTAGRAM_ACCESS_TOKEN_SESSION_KEY, code);
                        redirectUrl = "/instagram/";
                        break;
                    default:
                        break;
                }
                 
                return Response.AsRedirect(redirectUrl);                       
            };         
          
            Get["/foursquare/nextstep"] = _ =>
            {
                return FoursquareModuleHelper.NextStep(
                    this.Context,
                    GetFoursquareClient() as FoursquareClient,
                    foursquareProcessing,
                    this.Request.Query,
                    Response);
            };


           
        }

        private IClient GetClientByName(string name)
        {
            return authorizationRoot.Clients.First(c => c.Name.ToLower() == name.ToLower());
        }
        private IClient GetFoursquareClient()
        {
            return GetClientByName("Foursquare");
        }
        private IClient GetInstagramClient()
        {
            return GetClientByName("Instagram");             
        }

        public static void InitSocialPlayer(ISessionStore sessionStore, bool isDebug)
        {   
            var player = new SocialPlayer();
            //player.ID = 17907214; // Congratulations, now you know my Foursquare Id.
            if (isDebug)
                player.UserInfo = new UserInfo()
                {
                    Id = "17907214" 
                };
            else
                player.UserInfo = (UserInfo)sessionStore[SessionIdHandler.USER_INFO_KEY];
            sessionStore["socialplayer"] = player;
        }

        public string FilterLoginUrl(string loginUrl, string service)
        {
            loginUrl = loginUrl.Replace(String.Format("redirect_uri=http:%2F%2Fprism.phinitive.com%2Fapi%2Fauth%2F{0}", service),
                  "redirect_uri=" + HttpUtility.UrlEncode("http://" + this.Request.Url.HostName + ":" + this.Request.Url.Port + "/api/auth/" + service));
            // mono bug fix
            loginUrl = loginUrl.Replace(String.Format("redirect_uri=http://prism.phinitive.com/api/auth/{0}", service),
               "redirect_uri=" + HttpUtility.UrlEncode("http://" + this.Request.Url.HostName + ":" + this.Request.Url.Port + "/api/auth/" + service));

            return loginUrl;
        }

        
    }
}
