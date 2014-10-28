document.write('<script src="js/libs/smoothiecharts/smoothiecharts.js" type="text/javascript"></script>');
/*document.write('<script src="js/svg.js"></script>');*/
document.write('<script src="js/data-watch.js"></script>');
document.write('<script src="js/data-chart.js"></script>');
document.write('<script src="js/controller.js"></script>');
document.write('<script src="js/dataprovider.js"></script>');

/**
 * entry point after DOM ready
 */
$(document).ready(function() {
   
   // first get list of users
   users.initialize();
   
   // the data-content could fill user information
   // todo make users class
   // todo call controller.init after user choice
   // todo mock for users
   // todo reqest for users
   // todo make backend more robust to not throw an error in any case.
   
   controller.initialize();
});


