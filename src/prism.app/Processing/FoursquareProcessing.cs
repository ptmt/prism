using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareProcessing
    {
        public List<Action<Checkin, LiveStats>> CalculationFunctions; // todo replace with Task<>

        public FoursquareProcessing()
        {
            CalculationFunctions = new List<Action<Checkin, LiveStats>>();

            CalculationFunctions.Add((currentCheckin, stats) =>
            {                
                stats.TotalCheckins++;
                stats.LastDistance = CaclulateDistanceBeetweenTwoPoints(stats.PreviousCheckin, currentCheckin);
                stats.TotalDistance+= stats.LastDistance;
            });


            /// MOST LIKED & MOST POPULAR
            CalculationFunctions.Add((currentCheckin, stats) =>
            {
                if (stats.MostLikedCheckin == null) stats.MostLikedCheckin = currentCheckin;
                if (stats.MostPopularCheckin == null) stats.MostPopularCheckin = currentCheckin;
                if (stats.MostLikedCheckin.LikesCount < currentCheckin.LikesCount) stats.MostLikedCheckin = currentCheckin;
                if (stats.MostPopularCheckin.TotalVenueCheckins < currentCheckin.TotalVenueCheckins) stats.MostPopularCheckin = currentCheckin;
            });

            /// MY TOP PLACE 
            CalculationFunctions.Add((currentCheckin, stats) =>
            {
                // for example:
                // 30 my checkins 10000 total 1000 my checkins total = 0.03 * 10000 = 300
                // 50 my checkins 100 total checkins 1000 my checkins total = 0.05 * 100 = 5
                // 1 my checking 10000 total 10 my checkins total
                // rate = my_checkins * total_in_venue
                // TODO: calibrate it
                currentCheckin.T1Rate = currentCheckin.MyVenueCheckins * currentCheckin.TotalVenueCheckins;
                if (stats.MyTopCheckin == null) stats.MyTopCheckin = currentCheckin;
                if (stats.MyTopCheckin.T1Rate < currentCheckin.T1Rate) stats.MyTopCheckin = currentCheckin;
            });
            /// MY TOP CLIENT
            CalculationFunctions.Add((currentCheckin, stats) =>
            {
                if (!stats.KeyValue.ContainsKey("TopClient"))
                {
                    stats.KeyValue.Add("TopClients", new Dictionary<string, int>());
                    stats.KeyValue.Add("TopClient", String.Empty);
                }
                var topClients = (Dictionary<string, int>)stats.KeyValue["TopClients"];
                if (topClients.ContainsKey(currentCheckin.ClientName))
                    topClients[currentCheckin.ClientName]++;
                else
                    topClients.Add(currentCheckin.ClientName, 1);

                stats.KeyValue["TopClient"] = topClients.Select(c => c.Key).Aggregate((acc, x) => acc + ", " + x);
              //  stats.KeyValue["TopClient"] = topClients.Max(c => c.Value);
            });

            /// Checkins timeline
            CalculationFunctions.Add((currentCheckin, stats) =>
            {
                if (!stats.Temporary.ContainsKey("CheckinsTimeline"))
                {
                    stats.Temporary.Add("CheckinsTimeline", new Dictionary<string, int>());                    
                }
                var checkinsTimeline = (Dictionary<string, int>)stats.Temporary["CheckinsTimeline"];
                string timeKey = currentCheckin.CreatedAt.Year.ToString() + currentCheckin.CreatedAt.Month.ToString() + currentCheckin.CreatedAt.Day.ToString();
                if (checkinsTimeline.ContainsKey(timeKey))
                    checkinsTimeline[timeKey]++;
                else
                    checkinsTimeline.Add(timeKey, 1);               
            });

            CalculationFunctions.Add((checkin, stats) =>
            {
                stats.PreviousCheckin = checkin;
            });

           
        }

        public void Finalize(Checkin checkin, LiveStats liveStats)
        {
            var checkinsTimeline = (Dictionary<string, int>)liveStats.Temporary["CheckinsTimeline"];
            if (liveStats.KeyValue.ContainsKey("timeline"))
                liveStats.KeyValue["timeline"] = checkinsTimeline.Select(c => c.Value);
            else
                liveStats.KeyValue.Add("timeline", checkinsTimeline.Select(c => c.Value));
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
