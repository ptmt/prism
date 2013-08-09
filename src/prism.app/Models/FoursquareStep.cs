using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
   
    
    public class FoursquareStep
    {        
        public FoursquareCheckin CurrentCheckin { get; set; }
        public FoursquareLiveStats Live { get; set; }
        public SocialPlayer Player { get; set; }

       
    }
}
