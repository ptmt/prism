using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareProcessing
    {
        public List<Action<LiveStats>> InitFunctions; // todo replace with Task<>

        public List<Action<Checkin, LiveStats>> CalculationFunctions; // todo replace with Task<>

        public FoursquareProcessing()
        {
            CalculationFunctions = new List<Action<Checkin, LiveStats>>();
            InitFunctions = new List<Action<LiveStats>>();

            /// Common routines
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
                // current 
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

                stats.KeyValue["TopClient"] = topClients.OrderByDescending(c => c.Value).First().Key;              
            });

            TimelineProcessingTasks();

            CalculationFunctions.Add((checkin, stats) =>
            {
                stats.PreviousCheckin = checkin;
            });

           
        }

        private void TimelineProcessingTasks()
        {
            InitFunctions.Add(stats => {
                if (!stats.Temporary.ContainsKey("CheckinsTimeline"))
                {
                    stats.Temporary.Add("CheckinsTimeline", new Dictionary<string, int>());
                }

                if (!stats.KeyValue.ContainsKey("timeline"))
                    stats.KeyValue.Add("timeline", new List<int>());

                if (!stats.KeyValue.ContainsKey("timelineX"))
                    stats.KeyValue.Add("timelineX", new List<string>());
            });


            CalculationFunctions.Add((currentCheckin, stats) =>
            {
                var timeline = (List<int>)stats.KeyValue["timeline"];
                var timelineX = (List<string>)stats.KeyValue["timelineX"];
                var currentDay = stats.Temporary.ContainsKey("CurrentDay") ? (int)stats.Temporary["CurrentDay"] : 0;

                if (currentCheckin.CreatedAt.Day != currentDay)
                {
                    currentDay = currentCheckin.CreatedAt.Day;
                    stats.Temporary["CurrentDay"] = currentDay;
                    timeline.Add(stats.Temporary.ContainsKey("CurrentDayCount") ? (int)stats.Temporary["CurrentDayCount"] : 1);
                    timelineX.Add(GetTimelineKey(currentCheckin.CreatedAt));
                    stats.Temporary["CurrentDayCount"] = 0;
                }

                if (stats.Temporary.ContainsKey("CurrentDayCount"))
                    stats.Temporary["CurrentDayCount"] = (int)stats.Temporary["CurrentDayCount"] + 1;
                else
                    stats.Temporary.Add("CurrentDayCount", 1);

                stats.KeyValue["timeline"] = timeline;

            });
        }
        public void Finalize(LiveStats liveStats)
        {
            //var sourceTimeline = (Dictionary<string, int>)liveStats.Temporary["CheckinsTimeline"];
            //if (!liveStats.KeyValue.ContainsKey("timeline"))
            //    liveStats.KeyValue.Add("timeline", new List<int>());
            //else
            //    liveStats.KeyValue["timeline"] = new List<int>();

            //var timeline = (List<int>)liveStats.KeyValue["timeline"];
            
            //var currentDate = (DateTime)liveStats.Temporary["StartDate"];
            //while (currentDate < (DateTime)liveStats.Temporary["EndDate"])
            //{
            //    string timelineKey = GetTimelineKey(currentDate);
            //    currentDate.AddDays(1);
            //    if (sourceTimeline.ContainsKey(timelineKey))
            //        timeline.Add(sourceTimeline[timelineKey]);
            //    else
            //        timeline.Add(0);
            //}
            
            
        }

        private string GetTimelineKey(DateTime forDateTime)
        {
            return forDateTime.ToShortDateString();//.Year.ToString() + forDateTime.Month.ToString() + forDateTime.Day.ToString();
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
