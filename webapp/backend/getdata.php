<?php

/* set header to json response content */
header("Content-type: application/json");

/** 
 * write debugging information
 * @param type $msg the message to write
 */
function tracelog($msg) {
    $fp = @fopen("./protocol.txt", "a+");
    if ($fp) {
        fwrite($fp, $msg);
        fwrite($fp, "\r\n");
        fclose($fp);
    }
}

/**
 * reading data from serial port and
 * translate data into JSON
 */
function readFromDevice() {
   $device = "/dev/ttyUSB0";

   $buffer = "";
   $fp = fopen($device, "r");
   if ($fp) {
      $buffer = fgets ($fp);
   }
   fclose($fp);

   // use regular expressions
   $pattern = "/(\w{2}\-\w{3}\-\w{2} \d{2}:\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s*(\w+|)/";
   preg_match($pattern, $buffer, $matches);
   
   $length = count($matches);
   if ($length == 6) {
      $json = "{\"oxygen\": \"{$matches[2]}\", \"pulse\": \"{$matches[3]}\", \"pa\": \"{$matches[4]}\", \"status\": \"{$matches[5]}\"}\n";
      echo $json;
   } else {
      echo "{}";
   }
}
readFromDevice();
?>
