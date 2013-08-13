using Nancy.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareResponseData
    {
        public int Count {get;set;}
        public int Offset { get; set; }
        public int Limit { get; set; }

        [JsonIgnore]
        [ScriptIgnore]
        public JArray Checkins { get; set; }
    }
}
