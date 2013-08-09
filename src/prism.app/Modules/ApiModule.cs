﻿using Nancy;
using Nancy.Helpers;
using Newtonsoft.Json.Linq;
using OAuth2;
using OAuth2.Client;
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
            
            Get["/login"] = _ =>
            {
                return Response.AsJson(GetFoursquareClient().GetLoginLinkUri());                
            };

            Get["/auth"] = _ =>
            {
                ISessionStore sessionStore = new InMemorySessionStore(this.Context);
                
                if (sessionStore["userinfo"] == null) { 
                    var info = GetFoursquareClient().GetUserInfo(
                         HttpUtility.ParseQueryString(this.Request.Url.Query));
                    sessionStore.Add("userinfo", info);
                }
                return Response.AsRedirect("/");          
            };

            Get["/nextstep"] = _ =>
            {
                try
                {

                    ISessionStore sessionStore = new InMemorySessionStore(this.Context);
                    if (sessionStore["foursquareResponse"] == null)
                    {
                        InitSocialPlayer(sessionStore);
                        ParseMockCheckinsIntoMemory(sessionStore);
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

        public static string GetCheckinsFilename()
        {
            char s = System.IO.Path.DirectorySeparatorChar;
            return "mockdata" + s + "checkins.json";
        }

        public static void ParseMockCheckinsIntoMemory(ISessionStore sessionStore)
        {


            string jsonText = File.ReadAllText(GetCheckinsFilename());

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
