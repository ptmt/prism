using OAuth2;
using OAuth2.Client;
using OAuth2.Models;
using Prism.App.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;




namespace WebApplication1.Controllers
{
    public class AccountController : ApiController
    {

        private readonly AuthorizationRoot authorizationRoot;

        private const string ProviderNameKey = "providerName";
        private string ProviderName { get; set; }

        public AccountController()
        {          
            this.authorizationRoot = new AuthorizationRoot();
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
        public UserInfo Auth()
        {         
            var info = GetFoursquareClient().GetUserInfo(
                 HttpUtility.ParseQueryString(this.Request.RequestUri.Query));
            //TODO: save key in cookie
            // save userinfo into session
            // redirect
            return info;
        }

        [HttpGet]
        public FqStep NextPoint()
        {
           // get json from memory cache + current checkin int
                // if empty then parse .json from mockdata or from server and place to store
           // get new checkin object
           // run functions processing

            // calculationFunc.ForEach (c=> c (checkin, total))
            // return new FgStep { CurrentCheckin = checkin, Total = total } 
        }
        
        private IClient GetFoursquareClient() {
            return authorizationRoot.Clients.First();
        }

       
    }
}