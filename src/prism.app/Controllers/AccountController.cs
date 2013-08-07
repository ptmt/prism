using OAuth2;
using OAuth2.Client;
using OAuth2.Models;
using Prism.App;
using Prism.App.Models;
using Prism.App.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;



namespace WebApplication1.Controllers
{
    public class AccountController : ApiController
    {
        private readonly AuthorizationRoot authorizationRoot;
        //private readonly ISessionStore sessionStore;
        private readonly FoursquareProcessing foursquareProcessing;

        public AccountController()
        {          
            this.authorizationRoot = new AuthorizationRoot();
            this.foursquareProcessing = new FoursquareProcessing();
           // this.sessionStore = new InMemorySessionStore(this.Request);
        }

        [HttpGet]
        public List<string> GetClients()
        {
            return authorizationRoot.Clients.Select(c=>c.Name).ToList();
        }

        [HttpGet]
        public string Login()
        {
            return GetFoursquareClient().GetLoginLinkUri();
        }

        [HttpGet]
        public HttpResponseMessage Auth()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            if (sessionStore["userinfo"] == null) { 
                var info = GetFoursquareClient().GetUserInfo(
                     HttpUtility.ParseQueryString(this.Request.RequestUri.Query));
                sessionStore.Add("username", info);
            }
            var resp = new HttpResponseMessage();
            resp.Headers.Add("location:", "/");
            return resp;          
        }

        [HttpGet]
        public FqStep NextStep()
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
                    IsMayor = (bool?)jcheckin["IsMayor"]
                };

                currentCheckin.LikesSummary = currentCheckin.LikesCount > 0 ? (string)jcheckin["likes"]["summary"] : String.Empty;
                
                foursquareProcessing.CalculationFunctions.ForEach(c => c(currentCheckin, liveStats));
                
                liveStats.Offset++;
                return new FqStep { CurrentCheckin = currentCheckin, Live = liveStats };
            }
            else
            {
                sessionStore.Remove("livestats");
                sessionStore.Remove("checkins");
                foursquareProcessing.Finalize(liveStats);
                return new FqStep { Live = liveStats, CurrentCheckin = null };
            }
        }

        private void ParseMockCheckinsIntoMemory()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            string jsonText = File.ReadAllText(@"..\src\mockdata\checkins.json");

            JObject foursquareCheckins = JObject.Parse(jsonText);

            JArray checkins = (JArray)foursquareCheckins["response"]["checkins"]["items"];
            
            sessionStore["checkins"] = checkins;
            sessionStore["livestats"] = new LiveStats { 
                TotalCheckins = 0,
                TotalDistance = 0,
                Offset = 0,
                KeyValue = new Dictionary<string,object>(),
                Temporary = new Dictionary<string,object>()
            };

            foursquareProcessing.InitFunctions.ForEach(c => c((LiveStats)sessionStore["livestats"]));
        }
        
        private IClient GetFoursquareClient() {
            return authorizationRoot.Clients.First();
        }

        

       
    }
}