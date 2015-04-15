<?php

/* set header to json response content */
header("Content-type: application/json");

// we try to get the last line from file
$line = exec("tail -n 1 ./today.data");
list($date, $sp, $beat, $alert) = explode(",", $line);
echo "{\"oxygen\": \"$sp\", \"pulse\": \"$beat\", \"pa\": \"0\", \"status\": \"$alert\"}";
?>
