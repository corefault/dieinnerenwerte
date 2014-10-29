var users = (function() {
    var _url = "/backend/getusers.php",
        _list = {};
    
    return {
        /**
         * initialize the user class.
         */
        initialize: function () {
            if (location.hash == "#debug") {
                _url = "getusers";
            }
            
            $.mockjax({
               url: "getusers",
               proxy: "backend/users/mocklist.json"
           });
           
           this.listOfUsers();
        },
        
        /**
         * display template with user selection.
         */
        listOfUsers: function() {
            $.ajax({url: _url,
                success: function(data) {
                    var source   = $("#data-user").html();
                    var template = Handlebars.compile(source);
        
                    var html    = template(data);
                    object = $(html);
                    
                    _list = data;
        
                    // append to section
                    $('body').html(object);
                    
                    // install handler for selection change
                    $('#user select').on("change", function() {
                       var index = $(this).val(); 
                       if (index !== -1) {
                           controller.initialize(_list.list[index]);
                       }
                    });
                }});
        }
    };
}) ();


