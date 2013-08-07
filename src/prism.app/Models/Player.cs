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

        public int Level { get; set; }

        /// <summary>
        /// Experience is a summarization of all your Social Networks activity. 
        /// For example, each checkin at Foursquare gives you a experience points. Every single photo on a instagram, of course with likes and comments.
        /// everty tweet and so on.
        /// </summary>
        public long Exp { get; set; }

        /// <summary>
        /// This skill is only about likes and friends you have and related activity.
        /// </summary>
        public float SocialitySkill { get; set; }
        
        
        
        /// <summary>
        /// This skill is about your curiosity.
        /// Total kilometers and total diffirent places and average kilometers per one place.
        /// </summary>
        public float ExplorerSkill { get; set; }
    }
}
