var dataprovider = (function() {
   var _url = "getdata",
       _delay = 4000,
       _running = false;
       
   return {
       /**
        * possible status values
        */
       status: {
           AO: "Alarm Aus",
           AS: "Alarm stummgeschaltet",
           LB:  "Schwache Batterie",
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
           // we are mocking the ajax calls
           $.mockjaxSettings.contentType = 'text/json';
           $.mockjax({
               url: _url,
               response: function(data) {
                  var mocktext = ["AO","AS","LB","LM","LP","MO","PH","PL","PS","SH","SL","SD","SO"];
                  var index = dataprovider.randomizer(0, mocktext.length);
                  var st    = mocktext[index];
                  
                  this.responseText = {
                     oxygen: dataprovider.randomizer(75, 100),
                     pulse:  dataprovider.randomizer(65, 160),
                     pa:     dataprovider.randomizer(1,254),
                     status: st
                  };
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
                   error: function(){
                      _running = false;
                       console.log("ouch");
                   }
               });
              if (_running !== false) {
                 dataprovider.update();
              }
           }, _delay);
        }
      };
}) ();

