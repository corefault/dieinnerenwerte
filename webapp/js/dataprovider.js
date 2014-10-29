var dataprovider = (function() {
   var _url = "/backend/getdata.php",
       _delay = 2000,
       _running = false;
       
   return {
       /**
        * possible status values
        */
       status: {
           AO: "Alarm Aus",
           AS: "Alarm stummgeschaltet",
           LB: "Schwache Batterie",
           LM: "Pulsverlust m.Störung",
           LP: "Pulsverlust",
           MO: "Störung erkannt",
           PH: "Alarm bei Überschreiten der oberen Grenze der Pulsfrequenz",
           PL: "Alarm bei Unterschreiten der unteren Grenze der Pulsfrequenz",
           PS: "Pulssuche",
           SH: "Alarm bei Überschreitung der oberen Grenze der Sättigung",
           SL: "Alarm bei Unterschreitung der unteren Grenze der Sättigung",
           SD: "Sensor Gelöst",
           SO: "Sensor Aus"
       },
       
       /**
        * generate random value in range
        * @param {type} mi minimum
        * @param {type} ma maximum
        * @returns {Number} random number between the values
        */
        randomizer: function(mi, ma) {
            return Math.floor(Math.random()*(ma-mi+1)+mi);
        },
        /**
         * start monitoring.
         */
        startMonitoring: function () {
            if (location.hash == "#debug") {
                _url = "getdata";
                _delay = 1000;
                document.title = "Die inneren Werte (Simulationmode)";
            }
            // we are mocking the ajax calls
            $.mockjax({
               url: "getdata",
               response: function(data) {
                  var mocktext = ["AO","AS","LB","LM","LP","MO","PH","PL","PS","SH","SL","SD","SO"];
                  var index = dataprovider.randomizer(0, mocktext.length);
                  var st    = mocktext[index];
                  
                  var critical = dataprovider.randomizer(0, 100);
                  if (critical > 85) {
                    this.responseText = {
                       oxygen: "---",
                       pulse:  "---",
                       pa:     dataprovider.randomizer(1,254),
                       status: "SO"
                    };
                  } else {
                      
                    if (critical < 50) {
                        st = "";
                    }
                    this.responseText = {
                       oxygen: dataprovider.randomizer(75, 100),
                       pulse:  dataprovider.randomizer(65, 160),
                       pa:     dataprovider.randomizer(1,254),
                       status: st
                    };
                }
              }
           });
           controller.trace("Started monitoring...");
           _running = true;
           this.update();
        },
        /**
         * stop monitoring
         */
        stopMonitoring: function() {
           _running = false;
           controller.trace("Stopped monitoring...");
        },
        /**
         * update data in views.
         */
        update: function() {
           setTimeout(function() {
               $.ajax({
                   url:_url,
                   success: function(data) {
                       controller.update(data);
                   },
                   error: function(x,s,hdr){
                      _running = false;
                      $(".status").html("Fehler beim Lesen. Abbruch. (" + hdr +")");
                   }
               });
              if (_running !== false) {
                 dataprovider.update();
              }
           }, _delay);
        }
      };
}) ();

