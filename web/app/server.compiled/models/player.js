/* @flow */
var ExperienceConstants = require('./constants');


             
  /// <summary>
  /// Experience is a summarization of all your Social Networks activity.
  /// For example, each checkin at Foursquare gives you a experience points.
  /// Every single photo on the instagram, of course with likes and comments.
  /// Every tweet and so on.
  /// </summary>
              
              
                    
                
                
                

  function SocialPlayer() {"use strict";
    this.skills = {};
    this.achievements = [];
    this.exp = 0;
    this.level = 0;
  }

  SocialPlayer.prototype.addSkill=function(skill     , points)         {"use strict";
    if (this.skills[skill]) {
      this.skills[skill] += points;
    } else {
      this.skills[skill] = points;
    }

  };

  SocialPlayer.prototype.achieve=function(date      , achieveName)         {"use strict";
    this.achievements.push(date + ' : ' + achieveName);
  };

  SocialPlayer.prototype.apply=function(skill     , points        , conditions)        {"use strict";

    if (points > 0 && conditions) {
      this.exp += points;
      this.level = Math.floor(Math.log(this.exp + 1, ExperienceConstants.LEVELFX_LOGARITHM_BASE) - 1);
      this.addSkill(skill, points);
    }
  };



//module.exports.PlayerSkill : PlayerSkill;
module.exports.Player = SocialPlayer;
