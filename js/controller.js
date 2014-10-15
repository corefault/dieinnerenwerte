var controller = (function() {
    var _plugins = [];
    
    return {
        /**
        * play sound via html5
        */
        alarm: function() {
           var snd = new Audio('media/alarm.wav');
           snd.play();
        },
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
            
            // initialize handler for trace window
            $('article').hide();

            // initialize plugins
            _plugins.push(new dataWatch("Oxygen", "oxygen.png", 85, 101));
            _plugins.push(new dataWatch("Pulse", "pulse.png", 70, 140));
            _plugins.push(new dataChart());
            
            // now initialize the plugins
            for (var i = 0; i < _plugins.length; i++) {
                _plugins[i].initialize();
            }
            
            $('.notify').on("click", function() {
               $('article').slideToggle(1000); 
            });

            // start engines
            this.generalData();
            dataprovider.startMonitoring();
        },
        
        /**
         * this function will be called from dataprovider.
         * @param {type} val new values
         */
        update: function(val) {
            if (_plugins.length === 3) {
              _plugins[0].update(val.oxygen);
              _plugins[1].update(val.pulse);
              _plugins[2].update(val);
            }
        }
    };
}) ();

