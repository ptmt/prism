/* @flow */
var moment = require('moment');
var async = require('async');
var Promise = require('bluebird');
var Player = require('./player').Player;

                   
                                                                                  
              
              
                      
               
 

                       
                           
             
              
 

                                                     

module.exports.Timeline = (function(){
                            
                           
                        
                                     
  function Timeline(authKeys     , providers)      {"use strict";
    this.providers = providers;
    this.iterations = {};
    this.authKeys = authKeys;
  };

  Timeline.prototype.initAll=function()          {"use strict";
    var stats = {};
    return Promise.reduce(this.providers, function(stat, p)  {
      console.log('search accessTokens', p.name, this.authKeys);
      var token = this.authKeys[p.name.toLowerCase()];
      return p.init(stat, token);
    }.bind(this), stats).then(function(s)  {
      return Promise.resolve(stats);
    });
  };;

  /*
    Fetch and calculate all iterations
  */
  Timeline.prototype.fetch=function()     {"use strict";
    return this.initAll()
      .then(function(stats)  {
        var player = new Player();
        // Build the iterations map, where key is a time label
        // because different providers have different timestamps
        this.providers.forEach(function(provider)  {
          var iteration = provider.calculateNextIteration(stats, player);
          while (iteration) {
            this.iterations[iteration.key] = iteration;
            iteration = provider.calculateNextIteration(stats, player);
          }
          // Cleanup for each providers
          provider.cleanup(this.iterations);
        }.bind(this));
        // Build the timestamps array
        // for the playback controls and for easy iterations
        this.timestamps = Object.keys(this.iterations).sort();

        return Promise.resolve({
          iterations: this.iterations,
          timestamps: this.timestamps,
          providers: this.providers.map(function(p) {return p.name;})
        })
      }.bind(this));
  };
return Timeline;})()
