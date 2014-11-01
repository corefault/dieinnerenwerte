/*document.write('<script src="js/svg.js"></script>');*/

document.write('<script src="js/libs/smoothiecharts/smoothiecharts.js" type="text/javascript"></script>');
document.write('<script src="js/users.js" type="text/javascript"></script>');
document.write('<script src="js/data-watch.js"></script>');
document.write('<script src="js/data-chart.js"></script>');
document.write('<script src="js/controller.js"></script>');
document.write('<script src="js/dataprovider.js"></script>');

/**
 * entry point after DOM ready
 */
$(document).ready(function() {
    // install some Handlebars extensions
    Handlebars.registerHelper("ageInYears", function(bday) {
        var  age = new Date(bday);
        var  today = new Date();

        var diff = today.getTime() - age.getTime();
        var day = 1000 * 60 * 60 * 24;

        var days   = diff / day;
        var months = days / 31;
        var years  = months / 12;

        years = years.toFixed(0);
        return new Handlebars.SafeString(years + " years old"); 
    });
    // prepare mock (if used)
    $.mockjaxSettings.contentType = 'text/json';
   
    // first get list of users
    users.initialize();
});


