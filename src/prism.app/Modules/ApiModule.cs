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
        const string USER_INFO_KEY = "userinfo";
        const string ACCESS_TOKEN_SESSION_KEY = "accessToken";

        private readonly AuthorizationRoot authorizationRoot;        
        private readonly FoursquareProcessing foursquareProcessing;

        public ApiModule()
            : base("/api")
        {
            this.authorizationRoot = new AuthorizationRoot();
            this.foursquareProcessing = new FoursquareProcessing();

            Before += SessionIdHandler.SessionIdCreate;
            After += SessionIdHandler.CookieInject;
            
            Get["/login"] = _ =>
            {
                IClient foursquareClient = GetFoursquareClient();                               
                string loginUrl = foursquareClient.GetLoginLinkUri();
                // TODO rewrite OAuth Client section which works with configuration
                loginUrl = loginUrl.Replace("redirect_uri=http:%2F%2Fprism.phinitive.com%2Fapi%2Fauth",
                    "redirect_uri=" + HttpUtility.UrlEncode("http://" + this.Request.Url.HostName + ":" + this.Request.Url.Port + "/api/auth"));
                return Response.AsJson(loginUrl);                
            };

            Get["/auth"] = _ =>
            {
                ISessionStore sessionStore = new InMemorySessionStore(this.Context);
                string code = this.Request.Query.code;
                sessionStore.Add(ACCESS_TOKEN_SESSION_KEY, code);
                
                //

                //if (sessionStore[USER_INFO_KEY] == null)
                //{ 
                //    var info = GetFoursquareClient().GetUserInfo(
                //         HttpUtility.ParseQueryString(this.Request.Url.Query));
                //    sessionStore.Add(USER_INFO_KEY, info);
                   
                //}
                return Response.AsJson(code);//Response.AsRedirect("/");          
            };

            Get["/nextstep"] = _ =>
            {
                try
                {
                    
                    ISessionStore sessionStore = new InMemorySessionStore(this.Context);
                    if (sessionStore["foursquareResponse"] == null)
                    {
                        InitSocialPlayer(sessionStore);
                        string jsonText = this.Request.Query.MockData != null 
                            ? File.ReadAllText(GetCheckinsFilename(this.Request.Query.MockData))
                            : (GetFoursquareClient() as OAuth2.Client.Impl.FoursquareClient).MakeRequest((string)sessionStore[ACCESS_TOKEN_SESSION_KEY]);    
                        ParseCheckinsIntoMemory(jsonText, sessionStore);
                        foursquareProcessing.InitFunctions.ForEach(c => c((FoursquareLiveStats)sessionStore["livestats"]));
                    }
                    var liveStats = (FoursquareLiveStats)sessionStore["livestats"];
                    var socialPlayer = (SocialPlayer)sessionStore["socialplayer"];
                    JArray checkins = ((FoursquareResponseData)sessionStore["foursquareResponse"]).Checkins;

                    if (liveStats.Offset < checkins.Count)
                    {
                        JObject jcheckin = (JObject)checkins[liveStats.Offset];
                        var currentCheckin = new FoursquareCheckin(jcheckin);                    
                    
                        foursquareProcessing.CalculationFunctions.ForEach(c => c(currentCheckin, liveStats, socialPlayer));
                        liveStats.Offset++;
                        return Response.AsJson(new FoursquareStep { CurrentCheckin = currentCheckin, Live = liveStats, Player = socialPlayer });
                    }
                    else
                    {
                        sessionStore.Remove("livestats");
                        sessionStore.Remove("foursquareResponse");
                        foursquareProcessing.Finalize(liveStats);
                        return Response.AsJson(new FoursquareStep { Live = liveStats, CurrentCheckin = null });
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    return Response.AsText(e.Message + e.StackTrace);
                }
            };


           
        }

        private IClient GetFoursquareClient()
        {
            return authorizationRoot.Clients.First();
        }

        public static void InitSocialPlayer(ISessionStore sessionStore)
        {            
            sessionStore["socialplayer"] = new SocialPlayer();
        }

        public static string GetCheckinsFilename(int mocki)
        {
            char s = System.IO.Path.DirectorySeparatorChar;
            return "mockdata" + s + "checkins" + mocki + ".json";
        }

        
        public static void ParseCheckinsIntoMemory(string jsonText, ISessionStore sessionStore)
        {           

            JObject foursquareResponseRaw = JObject.Parse(jsonText);

            JArray checkins = (JArray)foursquareResponseRaw["response"]["checkins"]["items"];

            int totalCheckinsCount = (int)foursquareResponseRaw["response"]["checkins"]["count"];
            sessionStore["foursquareResponse"] = new FoursquareResponseData() 
            {
                Checkins = checkins,
                Count = totalCheckinsCount
            };
            sessionStore["livestats"] = new FoursquareLiveStats
            {
                TotalCheckins = 0,
                TotalDistance = 0,
                Offset = 0,
                Count = totalCheckinsCount,
                KeyValue = new Dictionary<string, object>(),
                Temporary = new Dictionary<string, object>()
            };            

           
        }
        
    }
}
