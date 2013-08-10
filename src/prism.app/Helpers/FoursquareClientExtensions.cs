using OAuth2.Client;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public static void MakeRequest(this OAuth2.Client.Impl.FoursquareClient client)
        {
            if (client.AccessToken == null)
                throw new ArgumentNullException("Not authorized access");

            RestClient restClient = new RestSharp.RestClient(CheckinsEndpoint.BaseUri);
            
            restClient.Authenticator = new OAuth2UriQueryParameterAuthenticator(client.AccessToken);

            var request = new RestRequest(CheckinsEndpoint.Resource, Method.GET);
            //request.AddParameter("limit", "value"); // adds to POST or URL querystring based on Method


            var asyncHandle = restClient.ExecuteAsync(request, response =>
            {
                Console.WriteLine(response.Content);
            });
        }
       

    }
}
