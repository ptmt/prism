/* @flow */
var ExperienceConstants = require('./constants');

class SocialPlayer
{
  id: number;
  /// <summary>
  /// Experience is a summarization of all your Social Networks activity.
  /// For example, each checkin at Foursquare gives you a experience points.
  /// Every single photo on the instagram, of course with likes and comments.
  /// Every tweet and so on.
  /// </summary>
  exp: number;
  skills: any;
  achievements: any;
  userinfo: any;
  diagnose: any;
  level: number;

  constructor() {
    this.skills = [];
    this.exp = 0;
    this.level = 0;
  }

  addSkill(skill: any, points: number) {
    this.skills[skill] = points;
  }

  apply(skill: any, points: number, conditions?: bool) {

    if (points > 0 && conditions) {
      this.exp += points;
      this.level = Math.floor(Math.log(this.exp + 1, ExperienceConstants.LEVELFX_LOGARITHM_BASE) - 1);
      this.addSkill(skill, points);
    }
  }

}

//module.exports.PlayerSkill : PlayerSkill;
module.exports.Player = SocialPlayer;
