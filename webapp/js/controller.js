var ui = (function () {
    var _plugins = [];

    return {
        initialize: function () {
           
           Chart.defaults.global.responsive = true;
           Chart.defaults.global.maintainAspectRatio = true;
           Chart.defaults.global.tooltipFontSize = 12;
           
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
          // colours taken from 
          // http://www.colourlovers.com/palette/379413/you_are_beautiful 
          // http://www.colourlovers.com/palette/848743/(%E2%97%95_%E2%80%9D_%E2%97%95)
          var colors = ['#351330','#424254','#64908A','#E8CAA4','#CC2A41','#490A3D','#BD1550','#E97F02','#F8CA00','#8A9B0F'],
              index = 0,
              pie = [];
          
          for(var key in data){
             var val = data[key];
             pie.push ({label: key, value: val, color: colors[index]});
             index++;
             if (index >= colors.length) {
                index = 0;
             }
           }
          
           return pie;
        },
        
        trendParts: function(filename, value) {
            // get trend information
            var query = "q=trend&val=" + value;
            if (typeof filename !== "undefined") {
                query += "&file=" + filename;
            }
            
            $.getJSON("/backend/segments.php",
                      query,
                      function(data) {
                          var json = {labels: [], datasets: [{label: "minimum", fillColor: '#8A9B0F', data: []},{label: "maximum", fillColor: '#490A3D', data: []}]};
                          for (var i = 0; i < data.length; i++) {
                              json.labels.push(data[i].from.substr(11));
                              json.datasets[0].data.push(data[i].minValue);
                              json.datasets[1].data.push(data[i].maxValue);
                          }
                          var ctx   = $("#trend").get(0).getContext("2d");
                          new Chart(ctx).Bar(json, {maintainAspectRatio:false});
                      }
                     );            
        },
        
        trend: function (filename) {
            var data = "q=stat";
            
            if (typeof filename !== "undefined") {
                data += "&file=" + filename;
            }
            dataprovider.stopMonitoring();
            ui._plugins = [];
            $.getJSON("/backend/segments.php",
                      data,  
                    function (data) {
                        var source = $("#data-trend").html();
                        var template = Handlebars.compile(source);
                        var html = template(data);
                        $('#content').html(html);
                        
                        // oxygen
                        var ctx   = $("#oxygen").get(0).getContext("2d");
                        var chart = new Chart(ctx).Pie(ui.makeChartData(data.stat.sp));
                        
                        ctx = $("#pulse").get(0).getContext("2d");
                        chart = new Chart(ctx).Pie(ui.makeChartData(data.stat.pulse));
                        
                        ctx = $("#alarm").get(0).getContext("2d");
                        chart = new Chart(ctx).Pie(ui.makeChartData(data.stat.alert));
                        
                        ui.trendParts(filename, 450);
                        
                        // select current file
                        $('#files').val(data.current);
                        $('#files').off("change");
                        $('#files').on("change", function () {
                           ui.trend($(this).val()); 
                        });
                    });
                     
        },
 
        alarm: function() {
           var snd = new Audio('media/alarm.wav');
           snd.play();
        },
        
        update: function(val) {
            var now = new Date().getTime();
            var bgImage = new Image();
            bgImage.src = "/backend/still.jpg?_=" + now;
            bgImage.onload = function(e) {
                $('#still').css("background-image", "url("+bgImage.src+")");
            };
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

