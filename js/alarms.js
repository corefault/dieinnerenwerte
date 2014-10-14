var alarms = (function() {
    return {
        /**
         * define the ranges.
         */
      oxygen: {low: 80},
      pulse: {low: 70, upper: 140},
      
      /**
       * check oxygen value against ranges.
       * @param {type} val
       * @returns {undefined} true if out of range
       */
      evaluateOxygen: function(val) {
          return (val <= this.oxygen.low);
      },
      
      /**
       * check pulse value against ranges.
       * @param {type} val
       * @returns {undefined} true if out of range
       */
      evaluatePulse: function(val) {
          return (val <= this.pulse.low || val >= this.pulse.upper);
      }
      
    };
})();