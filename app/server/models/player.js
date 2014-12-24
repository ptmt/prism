var ExperienceConstants = require('constants');
  // public enum PlayerSkill :
  // {
  //   Sociality // This skills is only about likes and friends you have and related activity.
  //   , Curiosity // Total kilometers and total diffirent places
  //   , Сharisma  // Likes+Retweets/TotalFriends
  //
  // }

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

  apply(skill: any, points: number, conditions?: bool) {
    if (points > 0 && conditions) {
      this.exp += points;
      applySkill(skill, points);
    }
  }

  addSkill(skill, points) {
    skills[skill] = points;
  }

}

Object.defineProperty('level', {
  get: function() { return Math.Round(Math.Log(Exp + 1, ExperienceConstants.LEVELFX_LOGARITHM_BASE)); }
});

//module.exports.PlayerSkill : PlayerSkill;
module.exports.Player = SocialPlayer;
