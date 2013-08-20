using Prism.App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{
    public class Diagnose {
        public string Short {get;set;}
        public string Description {get;set;}
    }

    public class Diagnostician
    {
        public static Diagnose GetDiagnose(SocialPlayer player)
        {
            if (player.GetSkill(PlayerSkill.Curiosity) > player.GetSkill(PlayerSkill.Sociality))
                return new Diagnose()
                {
                    Short = "Voyager",
                    Description = "You love dicover a new places."
                };
            if (player.GetSkill(PlayerSkill.Sociality) > player.GetSkill(PlayerSkill.Curiosity))
                return new Diagnose()
                {
                    Short = "Hipster",
                    Description = "I need a more detailed descrption."
                };
            return null;
        }
    }
}
