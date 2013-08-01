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
            var info = GetFoursquareClient().GetUserInfo(
                 HttpUtility.ParseQueryString(this.Request.RequestUri.Query));

            var resp = new HttpResponseMessage();

            var cookie = new CookieHeaderValue("session-id", "12345");
            cookie.Expires = DateTimeOffset.Now.AddDays(1);
            cookie.Domain = Request.RequestUri.Host;
            cookie.Path = "/";

            resp.Headers.AddCookies(new CookieHeaderValue[] { cookie });
            resp.Headers.Add("location:", "/");
            return resp;

            //TODO: save key in cookie
            // save userinfo into session
            // redirect
           // return info;
        }

        [HttpGet]
        public FqStep NextStep()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            if (sessionStore["checkins"] == null)
            {
                ParseMockCheckinsIntoMemory();
            }            
            var totalStats = (Stats)sessionStore["stats"];
            JArray checkins = (JArray)sessionStore["checkins"];
            if (totalStats.Offset < checkins.Count)
            {
                JObject jcheckin = (JObject)checkins[totalStats.Offset];
                var currentChecking = new Checkin
                {
                    LocationLat = (float)jcheckin["venue"]["location"]["lat"],
                    LocationLng = (float)jcheckin["venue"]["location"]["lng"],
                    VenueName = (string)jcheckin["venue"]["name"],
                    ID = (string)jcheckin["id"]

                };

                foursquareProcessing.CalculationFunctions.ForEach(c => c(currentChecking, totalStats));
                totalStats.Offset++;
                return new FqStep { CurrentCheckin = currentChecking, Total = totalStats };
            }
            else
            {
                sessionStore.Remove("stats");
                sessionStore.Remove("checkins");
                return null;
            }
        }

        private void ParseMockCheckinsIntoMemory()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            string jsonText = File.ReadAllText(@"..\src\mockdata\checkins.json");

            JObject foursquareCheckins = JObject.Parse(jsonText);

            JArray checkins = (JArray)foursquareCheckins["response"]["checkins"]["items"];
            
            sessionStore["checkins"] = checkins;            
            sessionStore["stats"] = new Stats { TotalCheckins = 0, TotalDistance = 0, Offset = 0 };
        }
        
        private IClient GetFoursquareClient() {
            return authorizationRoot.Clients.First();
        }

        

       
    }
}