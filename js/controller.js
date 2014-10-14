var controller = (function() {

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
     },
     /**
      * update beats per minute.
      * @param {type} val the value
      */
     updateHeart:function(val) {
        $('#heart h1').html(val);
     },
     
     /**
      * initialize plugins.
      */
     initialize: function() {
        this.generalData();
        dataprovider.startMonitoring();
     }
   };
}) ();

