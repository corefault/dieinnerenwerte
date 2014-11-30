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
         * put trace information into article area
         * @param {type} msg the message to display {} is enclosed in strong tag
         */
        trace: function(msg) {
           var now = new Date();
           
           msg = msg.replace(/{/g,"<strong>");
           msg = msg.replace(/}/g,"</strong>");
           
           $('article div').prepend("<strong>"
                                + now.toLocaleDateString()
                                + " "
                                + now.toLocaleTimeString()
                                + "</strong> "
                                + msg
                                + "<br/>"); 
        },

        /**
         * initialize plugins.
         * @param {type} userdata the data for selected user
         */
        initialize: function(userdata) {
           
            var source   = $("#data-content").html();
            var template = Handlebars.compile(source);

            // add current date
            userdata["today"] = new Date().toLocaleDateString();
            var html    = template(userdata);
            object = $(html);
        
            // append to section
            $('body').empty();
            $('body').append(object);
            
            // initialize handler for trace window
            $('article').hide();

            // initialize plugins
            _plugins.push(new dataChart("oxygen", "#b00038", 0, 100));
            _plugins.push(new dataWatch("Oxygen", "oxygen.png", 85, 101));

            _plugins.push(new dataChart("pulse", "#50585f", 0, 180));
            _plugins.push(new dataWatch("Pulse", "pulse.png", 60, 140));
            
            // now initialize the plugins
            for (var i = 0; i < _plugins.length; i++) {
                _plugins[i].initialize();
            }
            
            $('.notify').on("click", function() {
               $('article').slideToggle(1000); 
            });

            dataprovider.startMonitoring();
        },
        
        /**
         * this function will be called from dataprovider.
         * @param {type} val new values
         */
        update: function(val) {
            var now = new Date();
            $('#lastquery').html (now.toLocaleTimeString());
            _plugins[0].update(val.oxygen);
            _plugins[1].update(val.oxygen);
            _plugins[2].update(val.pulse);
            _plugins[3].update(val.pulse);
        
            // check for error
            if (val.oxygen === "---" || val.pulse === "---") {
                controller.critical( true );
            } else {
                controller.critical( false );
            }
            
            // check status
            var text = "";
            if (val.status != "") {
               text = dataprovider.status[val.status];  
               controller.trace("Status detected: {" + text + "}");
            } 
            $('.status').html(text);
        },
        /**
         * sensor alarm or really bad values.
         * @param {type} is true if it is critical
         */
        critical: function(is) {
            $('#critical').remove();
            if (is) {
                var obj = $('<div id="critical"><div>CRITICAL!</div></div>');
                $('body').append(obj);
                controller.trace("CRITICAL ALARM!");
            } 
        }
    };
}) ();

