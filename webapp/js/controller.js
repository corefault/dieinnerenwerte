var ui = (function () {
    var _plugins = [];

    return {
        initialize: function () {
            $('header li').on("click", function () {
                var route = $(this).attr("data-route");
                if (route === "live") {
                    ui.live();
                } else if (route === "trend") {
                    ui.trend();
                }
            });

            // initialize live view
            ui.live();
        },
        live: function () {
            dataprovider.stopMonitoring();
            ui._plugins = [];
            // get user data
            $.getJSON("/backend/userdata.json",
                    function (data) {
                        var source = $("#data-content").html();
                        var template = Handlebars.compile(source);
                        var html = template(data);
                        $('#content').html(html);

                        ui._plugins.push(new dataWatch("#oxygen", "Oxygen", "oxygen.png", 85, 101));
                        ui._plugins.push(new dataWatch("#pulse", "Pulse", "pulse.png", 60, 140));

                        // now initialize the plugins
                        for (var i = 0; i < ui._plugins.length; i++) {
                            ui._plugins[i].initialize();
                        }
                        
                        dataprovider.startMonitoring();
                    });

        },
        
        makeChartData: function (data) {
          // prepare the charts
          var labels = [];
          var series = [];
          for(var key in data){
             var val = data[key];
             labels.push(key);
             series.push(val);
           }
          
           return {labels: labels, series: [series]};
        },
        
        trend: function () {
            dataprovider.stopMonitoring();
            ui._plugins = [];
            $.getJSON("/backend/segments.php",
                    function (data) {
                        var source = $("#data-trend").html();
                        var template = Handlebars.compile(source);
                        var html = template(data);
                        $('#content').html(html);
                        
                        new Chartist.Bar('#pulse', ui.makeChartData(data.stat.sp), {fullWidth: true, centerBars:true});
                     });
        },
 
        alarm: function() {
           var snd = new Audio('media/alarm.wav');
           snd.play();
        },
        
        update: function(val) {
            if (ui._plugins.length == 2) {
                ui._plugins[0].update(val.oxygen);
                ui._plugins[1].update(val.pulse);
        
                // check for error
                if (val.oxygen === "---" || val.pulse === "---") {
                    ui.critical( true );
                } else {
                    ui.critical( false );
                }
            }
        },
        critical: function(is) {
            $('#critical').remove();
            if (is) {
                var obj = $('<div id="critical"><div class="animated fadeInDownBig">CRITICAL!</div></div>');
                $('body').append(obj);
            } 
        }
    };
})();

