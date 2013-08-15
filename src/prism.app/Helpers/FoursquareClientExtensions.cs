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
                return ("Not authorized access");            
            RestClient restClient = new RestSharp.RestClient(CheckinsEndpoint.BaseUri);
            restClient.Authenticator = new OAuth2UriQueryParameterAuthenticator(accessCode);            
            var request = new RestRequest(CheckinsEndpoint.Resource, Method.GET);            
            //IWebProxy webProxy = WebRequest.DefaultWebProxy;
            //webProxy.Credentials = CredentialCache.DefaultNetworkCredentials;
            //restClient.Proxy = webProxy;

            request.AddParameter("limit", limit);
            request.AddParameter("offset", offset);
            request.AddParameter("sort", "oldestfirst");
            request.AddParameter("v", DateTime.Now.ToString("yyyyMMdd"));
            var response = restClient.Execute(request);
            return response.Content;
        }

        public static string GetAccessCode(this OAuth2.Client.Impl.FoursquareClient client,NameValueCollection parameters)
        {      
            client.QueryAccessToken(parameters);
            return client.AccessToken;
        }

      
       

    }
}
