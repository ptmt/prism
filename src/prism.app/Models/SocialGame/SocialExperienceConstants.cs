using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public static class SocialExperienceConstants
    {

        public const double LEVELFX_LOGARITHM_BASE = 2; 
        public static class Foursquare {

            public const int ONE_KILOMETER_PASSED = 1;
            public const int BASE_CHECKIN = 10;
            public const int ONE_LIKE_TO_CHECKIN = BASE_CHECKIN * 2;            
            public const int CHECKIN_WITH_PHOTO = BASE_CHECKIN * 2;
            public const int ONE_COMMENT_TO_CHECKIN = BASE_CHECKIN * 3;
            public const int NEW_PLACE_CHECKIN = BASE_CHECKIN * 5;
            public const int MAYORSHIP_CHECKIN = BASE_CHECKIN * 5;
            public const int CHECKIN_WITH_NEW_FOURSQUARE_CLIENT = BASE_CHECKIN * 5;
            public const int CHECKIN_IN_PLACE_WITH_MORE_THAN_100_CHECKINS = BASE_CHECKIN * 2;
            public const int CHECKIN_IN_PLACE_WITH_MORE_THAN_1000_CHECKINS = BASE_CHECKIN * 4;
            public const int CHECKIN_IN_PLACE_WITH_MORE_THAN_10000_CHECKINS = BASE_CHECKIN * 6;
            public const int CHECKIN_IN_PLACE_REMOTE_FROM_LAST_AT_1000KM = BASE_CHECKIN * 5;
            public const int CHECKIN_IN_PLACE_REMOTE_FROM_LAST_AT_5000KM = BASE_CHECKIN * 10;
            public const int CHECKIN_IN_PLACE_REMOTE_FROM_LAST_AT_10000KM = BASE_CHECKIN * 100;

            
            
        }
        
    }
}
