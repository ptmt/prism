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

        const int DEFAULT_FOURSQUARE_LIMIT = 250;

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
            
            Get["/signin_foursquare"] = _ =>
            {                
                return Response.AsRedirect(FilterLoginUrl(GetFoursquareClient().GetLoginLinkUri(), "foursquare"));                
            };

            Get["/signin_instagram"] = _ =>
            {                
                return Response.AsRedirect(FilterLoginUrl(GetInstagramClient().GetLoginLinkUri(), "instagram"));
            };     

            Get["/auth_foursquare"] = _ =>
            {             
                ISessionStore sessionStore = new InMemorySessionStore(this.Context);
               
                var info = GetFoursquareClient().GetUserInfo(HttpUtility.ParseQueryString(this.Request.Url.Query));
                sessionStore.Add(SessionIdHandler.USER_INFO_KEY, info);
               
                string code = (GetFoursquareClient() as FoursquareClient).GetAccessCode(HttpUtility.ParseQueryString(this.Request.Url.Query));
                sessionStore.Add(SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY, code);               
                return Response.AsRedirect("/");                       
            };

            Get["/auth_instagram"] = _ =>
            {
                ISessionStore sessionStore = new InMemorySessionStore(this.Context);

                var info = GetInstagramClient().GetUserInfo(HttpUtility.ParseQueryString(this.Request.Url.Query));
                sessionStore.Add(SessionIdHandler.USER_INFO_KEY, info);

                string code = (GetFoursquareClient() as InstagramClient).AccessToken;// GetAccessCode(HttpUtility.ParseQueryString(this.Request.Url.Query));
                sessionStore.Add(SessionIdHandler.INSTAGRAM_ACCESS_TOKEN_SESSION_KEY, code);
                return Response.AsRedirect("/instagram/");
            };
            

            Get["/nextstep"] = _ =>
            {
                try
                {
                    
                    ISessionStore sessionStore = new InMemorySessionStore(this.Context);
                    bool isDebug = this.Request.Query.MockData != null;
                    if (sessionStore["foursquareResponse"] == null)
                    {
                        
                      
                        string jsonText = isDebug
                            ? File.ReadAllText(GetCheckinsFilename(this.Request.Query.MockData))
                            : (GetFoursquareClient() as OAuth2.Client.Impl.FoursquareClient)
                                .MakeRequest((string)sessionStore[SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY], DEFAULT_FOURSQUARE_LIMIT, 0);
                        try
                        {
                            ParseCheckinsIntoMemory(jsonText, sessionStore, 0, DEFAULT_FOURSQUARE_LIMIT);
                        }
                        catch
                        {
                            return Response.AsText(jsonText);
                        }
                        foursquareProcessing.InitFunctions.ForEach(c => c((FoursquareLiveStats)sessionStore["livestats"]));
                    }
                    if (sessionStore["socialplayer"] == null)
                    {
                        InitSocialPlayer(sessionStore, isDebug);
                    }
                    var liveStats = (FoursquareLiveStats)sessionStore["livestats"];
                    var socialPlayer = (SocialPlayer)sessionStore["socialplayer"];
                    var response = (FoursquareResponseData)sessionStore["foursquareResponse"];
                    JArray checkins = response.Checkins;

                    if (liveStats.i < checkins.Count || (liveStats.i + response.Offset < response.Count && this.Request.Query.MockData == null))
                    {
                        if (liveStats.i >= checkins.Count && liveStats.i + response.Offset < response.Count) 
                        {
                            string jsonText = (GetFoursquareClient() as OAuth2.Client.Impl.FoursquareClient)
                                .MakeRequest((string)sessionStore[SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY], DEFAULT_FOURSQUARE_LIMIT, response.Offset + DEFAULT_FOURSQUARE_LIMIT);
                            sessionStore.Remove("foursquareResponse");
                            ParseCheckinsIntoMemory(jsonText, sessionStore, response.Offset + DEFAULT_FOURSQUARE_LIMIT, DEFAULT_FOURSQUARE_LIMIT);
                        }

                        JObject jcheckin = (JObject)checkins[liveStats.i];
                        var currentCheckin = new FoursquareCheckin(jcheckin); 
                        foursquareProcessing.CalculationFunctions.ForEach(c => c(currentCheckin, liveStats, socialPlayer));
                        liveStats.i++;
                        return Response.AsJson(new FoursquareStep { 
                            CurrentCheckin = currentCheckin,
                            Live = liveStats,
                            Player = socialPlayer,
                            Response = response });
                    }
                    else
                    {
                            sessionStore.Remove("livestats");
                            sessionStore.Remove("foursquareResponse");
                            foursquareProcessing.Finalize(liveStats);
                            return Response.AsJson(new FoursquareStep { Live = liveStats, CurrentCheckin = null, Player = socialPlayer });
                     
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
            return authorizationRoot.Clients.First(c=>c.Name == "Foursquare");
        }
        private IClient GetInstagramClient()
        {
            return authorizationRoot.Clients.First(c => c.Name == "Instagram");
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
            loginUrl = loginUrl.Replace(String.Format("redirect_uri=http:%2F%2Fprism.phinitive.com%2Fapi%2Fauth_{0}", service),
                  "redirect_uri=" + HttpUtility.UrlEncode("http://" + this.Request.Url.HostName + ":" + this.Request.Url.Port + "/api/auth_" + service));
            // mono bug fix
            loginUrl = loginUrl.Replace(String.Format("redirect_uri=http://prism.phinitive.com/api/auth_{0}", service),
               "redirect_uri=" + HttpUtility.UrlEncode("http://" + this.Request.Url.HostName + ":" + this.Request.Url.Port + "/api/auth_" + service));

            return loginUrl;
        }

        public static string GetCheckinsFilename(int mocki)
        {
            char s = System.IO.Path.DirectorySeparatorChar;
            return "mockdata" + s + "checkins" + mocki + ".json";
        }

        
        public static void ParseCheckinsIntoMemory(string jsonText, ISessionStore sessionStore, int offset, int limit)
        {
            if (String.IsNullOrEmpty(jsonText))
                throw new ArgumentNullException("json is empty");


            JObject foursquareResponseRaw = JObject.Parse(jsonText);

            
            JArray checkins = (JArray)foursquareResponseRaw["response"]["checkins"]["items"];

            int totalCheckinsCount = (int)foursquareResponseRaw["response"]["checkins"]["count"];

            if (sessionStore["foursquareResponse"] == null)
                sessionStore["foursquareResponse"] = new FoursquareResponseData() 
                {
                    Checkins = checkins,
                    Count = totalCheckinsCount,
                    Offset = offset,
                    Limit = limit
                };
           

            if (sessionStore["livestats"] == null)
                sessionStore["livestats"] = new FoursquareLiveStats
                {
                    TotalCheckins = 0,
                    TotalDistance = 0,
                    i = 0,                    
                    KeyValue = new Dictionary<string, object>(),
                    Temporary = new Dictionary<string, object>()
                };            
            else
            {
                var livestats = (FoursquareLiveStats)sessionStore["livestats"];
                livestats.i = 0;
            }
            
           
        }
        
    }
}
