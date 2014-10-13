var dataprovider = (function() {
   var _url = "/getdata",
       _delay = 4000,
       _running = false;;
   
   return {
     
     /**
      * start monitoring.
      */
     startMonitoring: function () {
        _running = true;
        this.update();
     },

     /**
      * stop monitoring
      */
     stopMonitoring: function() {
        _running = false;
     },
     
     /**
      * update data in views.
      */
     update: function() {
        setTimeout(function() {
           
           $.ajax({url: _url, success:function(data) {
              $('#spo h1').html(data.spo);
              $('#heart h1').html(data.pulse);
           }, error: function(d,s,x) {
              stopMonitoring();
           }
           });
           
           if (_running != false) {
              update();
           }
        }, _delay);
     }
   };
   
}) ();

