using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Helpers
{
    public static class FoursquareClientExtensions
    {       
        public static void MakeRequest(this OAuth2.Client.Impl.FoursquareClient client)
        {
            RestClient restClient = new RestSharp.RestClient();
            restClient.AddDefaultHeader("", ""); // Add auth header
            
            var request = new RestRequest("/v2/users/self/checkins", Method.GET);
            //request.AddParameter("limit", "value"); // adds to POST or URL querystring based on Method


            var asyncHandle = restClient.ExecuteAsync(request, response =>
            {
                Console.WriteLine(response.Content);
            });
        }
       

    }
}
