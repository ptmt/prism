using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Models
{
    public enum PlayerSkill
    {
         Sociality // This skills is only about likes and friends you have and related activity.
       , Curiosity // Total kilometers and total diffirent places and average kilometers per one place
    }
    public class SocialPlayer
    {
        public int ID { get; set; }


        /// <summary>
        /// Experience is a summarization of all your Social Networks activity. 
        /// For example, each checkin at Foursquare gives you a experience points. 
        /// Every single photo on the instagram, of course with likes and comments.
        /// Every tweet and so on.
        /// </summary>
        private long exp;
        public long Exp { get { return exp; } }

        public int Level { get { return (int)Math.Round(Math.Log(Exp + 1, SocialExperienceConstants.LEVELFX_LOGARITHM_BASE)); } }

        public Dictionary<PlayerSkill, long> Skills { get; set; }
        public List<string> Achievements { get; set; }

        public SocialPlayer()
        {
            Skills = new Dictionary<PlayerSkill, long>();
            Achievements = new List<string>();
        }
        public void Apply(PlayerSkill skillKey, long points)
        {
            if (points > 0) { 
                exp += points;
                applySkill(skillKey, points);
            }
        }

        public void Apply(PlayerSkill skillKey, long points, bool conditions)
        {
            if (conditions)
                Apply(skillKey, points);
        }

        private void applySkill(PlayerSkill skillKey, long value) {            
                if (Skills.ContainsKey(skillKey))
                    Skills[skillKey] += value;
                else
                    Skills.Add(skillKey, value);            
        }
    }
}
