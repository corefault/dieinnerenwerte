/*document.write('<script src="js/svg.js"></script>');*/

document.write('<script src="js/data-watch.js"></script>');
document.write('<script src="js/controller.js"></script>');
document.write('<script src="js/dataprovider.js"></script>');

/**
 * entry point after DOM ready
 */
$(document).ready(function () {
    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        console.log("Error " + settings.url + ", " + thrownError);
    });

    // install some Handlebars extensions
    Handlebars.registerHelper("ageInYears", function (bday) {
        var age = new Date(bday);
        var today = new Date();

        var diff = today.getTime() - age.getTime();
        var day = 1000 * 60 * 60 * 24;

        var days = diff / day;
        var months = days / 31;
        var years = months / 12;

        years = years.toFixed(0);
        return new Handlebars.SafeString(years + " Jahre alt");
    });
    // prepare mock (if used)
    $.mockjaxSettings.contentType = 'text/json';

    ui.initialize();
});


