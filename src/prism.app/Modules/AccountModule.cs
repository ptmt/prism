using Nancy;
using OAuth2;
using OAuth2.Client;
using Prism.App.Models;
using System;
using System.Collections.Generic;
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


            Get["/moo"] = x => "moo";

            Get["/login"] = _ =>
            {
                return GetFoursquareClient().GetLoginLinkUri();
            };
        }

        private IClient GetFoursquareClient()
        {
            return authorizationRoot.Clients.First();
        }
    }
}
