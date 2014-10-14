var controller = (function() {
    var _valsOxygen, _valsPulse;
    
    return {
        /**
         * provide common data.
         */
        generalData: function() {
            $('#name').html(user.name);
            var  age = new Date(user.bday);
            var  today = new Date();

            var diff = today.getTime() - age.getTime();
            var day = 1000 * 60 * 60 * 24;

            var days   = diff / day;
            var months = days / 31;
            var years  = months / 12;

            years = years.toFixed(0);
            $('#age').html(years + " years old");
            $('#weight').html(user.weight);

            $('#today').html(today.toLocaleDateString());
        },
     
        /**
         * update oxygen value.
         * @param {type} val the value
         */
        updateOxygen: function(val) {
           $('#spo h1').html(val);
           _valsOxygen.append(new Date().getTime(), val);
           
           if (alarms.evaluateOxygen(val)) {
               $('#spo').addClass('alarm');
               alarms.audio();
               this.trace("Oxygen alarm reported. The value {" + val + "} below the allowed limit of {" + alarms.oxygen.low + "}");
           } else {
               $('#spo').removeClass('alarm');
           }
        },
        /**
         * update beats per minute.
         * @param {type} val the value
         */
        updateHeart:function(val) {
           $('#heart h1').html(val);
           _valsPulse.append(new Date().getTime(), val);
           if (alarms.evaluatePulse(val)) {
               $('#heart').addClass('alarm');
               alarms.audio();
               this.trace("Pulse alarm reported. The value {" + val + "} was out of allowed range {" + alarms.pulse.low + "} and {" + alarms.pulse.upper + "}.");
           } else {
               $('#heart').removeClass('alarm');
           }
        },
        
        /**
         * put trace information into article area
         */
        trace: function(msg) {
           var now = new Date();
           
           msg = msg.replace(/{/g,"<strong>");
           msg = msg.replace(/}/g,"</strong>");
           
           $('article').prepend("<strong>"
                                + now.toLocaleDateString()
                                + " "
                                + now.toLocaleTimeString()
                                + "</strong> "
                                + msg
                                + "<br/>"); 
        },

        /**
         * initialize plugins.
         */
        initialize: function() {

           var chart = new SmoothieChart({grid:{fillStyle:'#fff',strokeStyle:'#fff',borderVisible:false},labels:{fillStyle:'#000',disabled:true},maxValue:180,minValue:0});
           _valsOxygen = new TimeSeries();
           _valsPulse = new TimeSeries();
           chart.addTimeSeries(_valsOxygen, {lineWidth:1,strokeStyle:'#000080'});
           chart.addTimeSeries(_valsPulse, {lineWidth:1,strokeStyle:'#800000'});
           chart.streamTo(document.getElementById("chart-spo"), dataprovider._delay);

           this.generalData();
           dataprovider.startMonitoring();
        }
    };
}) ();

