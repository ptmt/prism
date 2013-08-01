using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareProcessing
    {
        public List<Action<Checkin, Stats>> CalculationFunctions; // todo replace with Task<>

        public FoursquareProcessing()
        {
            CalculationFunctions = new List<Action<Checkin, Stats>>();

            CalculationFunctions.Add((currentCheckin, stats) =>
            {                
                stats.TotalCheckins++;
                stats.LastDistance = CaclulateDistanceBeetweenTwoPoints(stats.PreviousCheckin, currentCheckin);
                stats.TotalDistance+= stats.LastDistance;
            });

            CalculationFunctions.Add((checkin, stats) =>
            {
                stats.PreviousCheckin = checkin;
            });

           
        }

        private double CaclulateDistanceBeetweenTwoPoints(Checkin previous, Checkin current)
        {
            if (previous == null) return 0;

            var R = 6371; // km
            var dLat = toRad(current.LocationLat - previous.LocationLat);
            var dLon = toRad(current.LocationLng - previous.LocationLng);
            var lat1 = toRad(current.LocationLat);
            var lat2 = toRad(previous.LocationLat);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c;
            return d;
        }

        private double toRad(double angle)
        {
            return Math.PI * angle / 180.0;
        }
    }
}
