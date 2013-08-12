using OAuth2.Client;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{
    public static class FoursquareClientExtensions
    {
        public static Endpoint CheckinsEndpoint
        {
            get
            {
                return new Endpoint
                {
                    BaseUri = "https://api.foursquare.com",
                    Resource = "/v2/users/self/checkin"
                };
            }
        }

        public static string MakeRequest(this OAuth2.Client.Impl.FoursquareClient client, string accessCode)
        
        {
            if (String.IsNullOrEmpty(accessCode))
                throw new ArgumentNullException("Not authorized access");

            RestClient restClient = new RestSharp.RestClient(CheckinsEndpoint.BaseUri);
            restClient.Authenticator = new OAuth2UriQueryParameterAuthenticator(accessCode);
            var request = new RestRequest(CheckinsEndpoint.Resource, Method.GET);            
            IWebProxy webProxy = WebRequest.DefaultWebProxy;
            webProxy.Credentials = CredentialCache.DefaultNetworkCredentials;
            restClient.Proxy = webProxy;
            var response = restClient.Execute(request);
            return response.Content;
        }
       

    }
}
