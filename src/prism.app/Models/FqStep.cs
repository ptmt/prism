using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{

    public class Checkin
    {
        public string ID { get; set; }
        public DateTime CreatedAt { get; set; }

        public string ClientName { get; set; }
        public string VenueName { get; set; }
        public float LocationLat { get; set; }
        public float LocationLng { get; set; }

        public int MyVenueCheckins { get; set; }
        public int TotalVenueCheckins { get; set; }
        public int LikesCount { get; set; }
        public string LikesSummary { get; set; }

        public float T1Rate { get; set; }
    }

    public class LiveStats
    {
        public Checkin PreviousCheckin { get; set; }
        public double LastDistance { get; set; }


        public double TotalDistance { get; set; }
        public int TotalCheckins { get; set; }

        public int Offset { get; set; }

        public Checkin MostPopularCheckin { get; set; }
        public Checkin MostLikedCheckin { get; set; }
        public Checkin MyTopCheckin { get; set; }

        public Dictionary<string, object> KeyValue { get; set; }

        [JsonIgnore]
        public Dictionary<string, object> Temporary { get; set; }
       
    }
    public class FqStep
    {
        
        public Checkin CurrentCheckin { get; set; }
        public LiveStats Live { get; set; }

       
    }
}
