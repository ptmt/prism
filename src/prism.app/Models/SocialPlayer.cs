using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public class SocialPlayer
    {
        public int ID { get; set; }


        /// <summary>
        /// Experience is a summarization of all your Social Networks activity. 
        /// For example, each checkin at Foursquare gives you a experience points. Every single photo on the instagram, of course with likes and comments.
        /// Everty tweet and so on.
        /// </summary>
        private long exp;
        public long Exp { get { return exp; } }

        public int Level { get { return (int)Math.Round(Math.Log(Exp + 1, SocialExperienceConstants.LEVELFX_LOGARITHM_BASE)); } }       

        /// <summary>
        /// This skill is only about likes and friends you have and related activity.
        /// </summary>
        public float SocialitySkill { get; set; }
        
        
        
        /// <summary>
        /// This skill is about your curiosity.
        /// Total kilometers and total diffirent places and average kilometers per one place.
        /// </summary>
        public float ExplorerSkill { get; set; }


        public void Apply(long points)
        {
            if (points > 0)
                exp += points;
        }

        public void Apply(long points, bool predicate)
        {
            if (predicate)
                Apply(points);
        }
    }
}
