var ui = (function() {

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
     },
     
     /**
      * initialize plugins.
      */
     initialize: function() {
        
        // we are mocking the ajax calls
        $.mockjaxSettings.contentType = "application/json";
        $.mockjax({
            url: ui._url,
            response: function(settings) {
               this.responseText = {
                  spo: Math.floor((Math.random() * 100) + 1),
                  pulse: Math.floor((Math.random() * 200) + 50)
               };
            }
         });
        
        this.generalData();
        dataprovider.startMonitoring();
     }
   };
}) ();

