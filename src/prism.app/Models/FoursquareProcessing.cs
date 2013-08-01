using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class FoursquareProcessing
    {
        public List<Action<Checkin, TotalStats>> CalculationFunctions;

        public FoursquareProcessing()
        {
            CalculationFunctions = new List<Action<Checkin, TotalStats>>();

            CalculationFunctions.Add((checkin, total) =>
            {
                total.TotalCheckins++;
                total.TotalDistance += 10;
            });
        }
    }
}
