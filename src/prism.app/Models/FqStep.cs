using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{

    public class Checkin
    {
        public string VenueName { get; set; }
        public float LocationLat { get; set; }
        public float LocationLon { get; set; }
    }

    public class TotalStat
    {
        public double TotalDistance { get; set; }
        public int TotalCheckins { get; set; }
    }
    public class FqStep
    {
        public Checkin CurrentCheckin { get; set; }
        public TotalStat Total { get; set; }
    }
}
