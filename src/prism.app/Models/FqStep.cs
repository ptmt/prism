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
        public string VenueName { get; set; }
        public float LocationLat { get; set; }
        public float LocationLng { get; set; }
    }

    public class Stats
    {
        public Checkin PreviousCheckin { get; set; }
        public double LastDistance { get; set; }


        public double TotalDistance { get; set; }
        public int TotalCheckins { get; set; }

        public int Offset { get; set; }
    }
    public class FqStep
    {
        
        public Checkin CurrentCheckin { get; set; }
        public Stats Total { get; set; }

       
    }
}
