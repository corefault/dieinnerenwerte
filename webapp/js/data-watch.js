function dataWatch(name, icon, lower, upper) {
    var opts = {title: name, icon: icon, min: lower, max: upper},
        object = false,
        error = opts.title + " alarm reported. The value {%1} is out of range {%2} and {%3}.",
        counter = 0;
    
    this.initialize = function () {
        var source   = $("#data-watch").html();
        var template = Handlebars.compile(source);
        
        var html    = template(opts);
        object = $(html);
        
        // append to section
        $('section').append(object);
    },
            
    this.update = function (val) {
        
        controller.critical( (val === 0) );
        
        $('h1', object).html(val);
        if (val <= opts.min || val >= opts.max) {
            object.addClass("alarm");
 
            controller.alarm();
            
            var warn = error;
            warn = warn.replace("%1", val);
            warn = warn.replace("%2", opts.min);
            warn = warn.replace("%3", opts.max);
            controller.trace(warn);
            
            // notification handling
            counter++;
            $('.notify span', object).html(counter);
            $('.notify', object).show();
        } else {
            object.removeClass("alarm");
        }
    }
    
}