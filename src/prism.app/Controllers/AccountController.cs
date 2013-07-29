using OAuth2;
using OAuth2.Client;
using OAuth2.Models;
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
            //var config = new OAuth2.Configuration.ConfigurationManager();
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
            return info;
        }
        
        private IClient GetFoursquareClient() {
            return authorizationRoot.Clients.First();
        }

       
    }
}