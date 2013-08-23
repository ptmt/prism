using Nancy;
using Newtonsoft.Json.Linq;
using Prism.App.Data;
using Prism.App.Models;
using System;
using System.Collections.Generic;
using System.IO;

namespace Prism.App.Modules
{
    public class FoursquareModuleHelper
    {
        const int DEFAULT_FOURSQUARE_LIMIT = 250;

        public static Response NextStep(
            NancyContext context,
            OAuth2.Client.Impl.FoursquareClient client, 
            FoursquareProcessing foursquareProcessing, 
            dynamic query,
            IResponseFormatter Response)
        {
            try
            {
                ISessionStore sessionStore = new InMemorySessionStore(context);
                bool isDebug = query.MockData != null;
                if (sessionStore["foursquareResponse"] == null)
                {


                    string jsonText = isDebug
                        ? File.ReadAllText(GetCheckinsFilename(query.MockData))
                        : client.MakeRequest((string)sessionStore[SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY], DEFAULT_FOURSQUARE_LIMIT, 0);
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
                    ApiModule.InitSocialPlayer(sessionStore, isDebug);
                }
                var liveStats = (FoursquareLiveStats)sessionStore["livestats"];
                var socialPlayer = (SocialPlayer)sessionStore["socialplayer"];
                var response = (FoursquareResponseData)sessionStore["foursquareResponse"];
                JArray checkins = response.Checkins;

                if (liveStats.i < checkins.Count || (liveStats.i + response.Offset < response.Count && query.MockData == null))
                {
                    if (liveStats.i >= checkins.Count && liveStats.i + response.Offset < response.Count)
                    {
                        string jsonText = client
                            .MakeRequest((string)sessionStore[SessionIdHandler.FOURSQUARE_ACCESS_TOKEN_SESSION_KEY], DEFAULT_FOURSQUARE_LIMIT, response.Offset + DEFAULT_FOURSQUARE_LIMIT);
                        sessionStore.Remove("foursquareResponse");
                        ParseCheckinsIntoMemory(jsonText, sessionStore, response.Offset + DEFAULT_FOURSQUARE_LIMIT, DEFAULT_FOURSQUARE_LIMIT);
                    }

                    JObject jcheckin = (JObject)checkins[liveStats.i];
                    var currentCheckin = new FoursquareCheckin(jcheckin);
                    foursquareProcessing.CalculationFunctions.ForEach(c => c(currentCheckin, liveStats, socialPlayer));
                    liveStats.i++;
                    return Response.AsJson(new FoursquareStep
                    {
                        CurrentCheckin = currentCheckin,
                        Live = liveStats,
                        Player = socialPlayer,
                        Response = response
                    });
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
