using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareLiveStats
    {
        public FoursquareCheckin PreviousCheckin { get; set; }
        public double LastDistance { get; set; }


        public double TotalDistance { get; set; }
        public int TotalCheckins { get; set; }

        public int Offset { get; set; }

        public FoursquareCheckin MostPopularCheckin { get; set; }
        public FoursquareCheckin MostLikedCheckin { get; set; }
        public FoursquareCheckin MyTopCheckin { get; set; }

        public Dictionary<string, object> KeyValue { get; set; }

        [JsonIgnore]
        public Dictionary<string, object> Temporary { get; set; }

    }
}
