using Newtonsoft.Json.Linq;
using OAuth2.Client;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
                    Resource = "/v2/users/self/checkins"
                };
            }
        }

        public static Endpoint AuthEndpoint
        {
            get
            {
                return new Endpoint
                {
                    BaseUri = "https://foursquare.com",
                    Resource = "/oauth2/access_token"
                };
            }
        }

        public static string MakeRequest(this OAuth2.Client.Impl.FoursquareClient client, string accessCode, int limit, int offset)
        
        {
            if (String.IsNullOrEmpty(accessCode))
                throw new ArgumentNullException("Not authorized access");            
            RestClient restClient = new RestSharp.RestClient(CheckinsEndpoint.BaseUri);
            restClient.Authenticator = new OAuth2UriQueryParameterAuthenticator(accessCode);            
            var request = new RestRequest(CheckinsEndpoint.Resource, Method.GET);            
            IWebProxy webProxy = WebRequest.DefaultWebProxy;
            webProxy.Credentials = CredentialCache.DefaultNetworkCredentials;
            restClient.Proxy = webProxy;

            request.AddParameter("limit", limit);
            request.AddParameter("offset", offset);
            request.AddParameter("sort", "oldestfirst");
            var response = restClient.Execute(request);
            return response.Content;
        }

        public static string GetAccessCode(this OAuth2.Client.Impl.FoursquareClient client,NameValueCollection parameters)
        {
            ////https://foursquare.com/oauth2/access_token
            ////?client_id=YOUR_CLIENT_ID
            ////&client_secret=YOUR_CLIENT_SECRET
            ////&grant_type=authorization_code
            ////&redirect_uri=YOUR_REGISTERED_REDIRECT_URI
            ////&code=CODE

            //RestClient restClient = new RestSharp.RestClient(AuthEndpoint.BaseUri);
            //var request = new RestRequest(CheckinsEndpoint.Resource, Method.GET);
            //request.AddParameter("client_id", "QXM3ND4KWSNC0UZIGI4HUQCOFX4U3VIYT4U0FRI3PVUQFYYB");
            //request.AddParameter("client_secret", "JVGNGAM4D3V1URBT0Z4TLI04Q3JZAYNBR1JKRUMREQ2JSL3O");
            //request.AddParameter("redirect_uri", returnUrl);
            //request.AddParameter("code", code);

            //var response = restClient.Execute(request);

            //var token = (string)JObject.Parse(response.Content).SelectToken("access_token");
            //return token;
            client.QueryAccessToken(parameters);
            return client.AccessToken;
        }

      
       

    }
}
