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
//      stream_set_blocking($fp,0);
      $buffer = fgets ($fp);
   }
   fclose($fp);
   if (strlen($buffer) > 0) {
      $date = substr($buffer,0,18);
      $spo2 = substr($buffer,21,3);
      $pulse = substr($buffer,29,3);
      $pa = substr($buffer,37,3);
      $status = "";
      if (strlen($buffer) >= 44) {
          $status = substr($buffer,44,2); 
      }
      
      $json = "{\"oxygen\": \"$spo2\", \"pulse\": \"$pulse\", \"pa\": \"$pa\", \"status\": \"$status\"}\n";
      echo $json;
   } else {
      echo "{}";
   }
}

readFromDevice();

?>
