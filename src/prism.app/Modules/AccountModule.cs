using Nancy;
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

           // Before += SessionIdHandler.CookieInject;
            
            Get["/login"] = _ =>
            {
                return Response.AsJson(GetFoursquareClient().GetLoginLinkUri());                
            };

            Get["/auth"] = _ =>
            {
                ISessionStore sessionStore = new InMemorySessionStore(this.Request);
                
                if (sessionStore["userinfo"] == null) { 
                    var info = GetFoursquareClient().GetUserInfo(
                         HttpUtility.ParseQueryString(this.Request.Url.Query));
                    sessionStore.Add("userinfo", info);
                }
                return Response.AsRedirect("/");          
            };

            Get["/nextstep"] = _ =>
            {
                ISessionStore sessionStore = new InMemorySessionStore(this.Request);
                if (sessionStore["checkins"] == null)
                {
                    ParseMockCheckinsIntoMemory();
                }
                var liveStats = (LiveStats)sessionStore["livestats"];
                JArray checkins = (JArray)sessionStore["checkins"];

                if (liveStats.Offset < checkins.Count)
                {
                    JObject jcheckin = (JObject)checkins[liveStats.Offset];
                    var currentCheckin = new Checkin
                    {
                        LocationLat = (float)jcheckin["venue"]["location"]["lat"],
                        LocationLng = (float)jcheckin["venue"]["location"]["lng"],
                        ClientName = (string)jcheckin["source"]["name"],
                        VenueName = (string)jcheckin["venue"]["name"],
                        ID = (string)jcheckin["id"],
                        CreatedAt = ((int)jcheckin["createdAt"]).FromUnix(),
                        LikesCount = (int)jcheckin["likes"]["count"],
                        MyVenueCheckins = (int)jcheckin["venue"]["beenHere"]["count"],
                        TotalVenueCheckins = (int)jcheckin["venue"]["stats"]["checkinsCount"],
                        IsMayor = (bool?)jcheckin["isMayor"]
                    };

                    currentCheckin.LikesSummary = currentCheckin.LikesCount > 0 ? (string)jcheckin["likes"]["summary"] : String.Empty;
                    foursquareProcessing.CalculationFunctions.ForEach(c => c(currentCheckin, liveStats));
                    liveStats.Offset++;
                    return Response.AsJson(new FqStep { CurrentCheckin = currentCheckin, Live = liveStats });
                }
                else
                {
                    sessionStore.Remove("livestats");
                    sessionStore.Remove("checkins");
                    foursquareProcessing.Finalize(liveStats);
                    return Response.AsJson(new FqStep { Live = liveStats, CurrentCheckin = null });
                }
            };


           
        }

        private IClient GetFoursquareClient()
        {
            return authorizationRoot.Clients.First();
        }

         private void ParseMockCheckinsIntoMemory()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            string jsonText = File.ReadAllText(@"..\src\mockdata\checkins.json");

            JObject foursquareCheckins = JObject.Parse(jsonText);

            JArray checkins = (JArray)foursquareCheckins["response"]["checkins"]["items"];

            sessionStore["checkins"] = checkins;
            sessionStore["livestats"] = new LiveStats
            {
                TotalCheckins = 0,
                TotalDistance = 0,
                Offset = 0,
                KeyValue = new Dictionary<string, object>(),
                Temporary = new Dictionary<string, object>()
            };

            foursquareProcessing.InitFunctions.ForEach(c => c((LiveStats)sessionStore["livestats"]));
        }
        
    }
}
