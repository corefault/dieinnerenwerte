document.write('<script src="js/user.js"></script>');
document.write('<script src="js/controller.js"></script>');
document.write('<script src="js/dataprovider.js"></script>');

/**
 * entry point after DOM ready
 */
$(document).ready(function() {
   controller.initialize();
});


