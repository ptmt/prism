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

        public AccountController()
        {          
            this.authorizationRoot = new AuthorizationRoot();
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
        public string TestAuth()
        {
         //   var resp = new HttpResponseMessage();

            string sessionId = Request.Properties[SessionIdHandler.SessionIdToken] as string;
         //   resp.StatusCode = HttpStatusCode.Moved;
         //   resp.Headers.Add("Location", "/");
         //   return resp;
            return sessionId;       
        }

        [HttpGet]
        public string Test()
        {
            ISessionStore sessionStore = new InMemorySessionStore(this.Request);
            int i = (int)sessionStore["i"];
                        
            string jsonText = File.ReadAllText(@"..\src\mockdata\checkins.json");

            JObject foursquareCheckins = JObject.Parse(jsonText);

            JArray checkins = (JArray)foursquareCheckins["response"]["checkins"]["items"];

            i++;
            sessionStore["i"] = i;
            return (string)checkins[i]["id"];
        }

        //[HttpGet]
        //public FqStep NextPoint()
        //{
        //    HttpContext.Current.Session["a"];
        //   // get json from memory cache + current checkin int
        //        // if empty then parse .json from mockdata or from server and place to store
        //   // get new checkin object
        //   // run functions processing

        //    // calculationFunc.ForEach (c=> c (checkin, total))
        //    // return new FgStep { CurrentCheckin = checkin, Total = total } 
        //}

        
        private IClient GetFoursquareClient() {
            return authorizationRoot.Clients.First();
        }

        

       
    }
}