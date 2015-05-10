<?php

/** 
 * write data to file
 * @param type $msg the message to write
 */
function writeToFile($msg) {
    $file = "today.data";
    $fp = @fopen("./$file", "a+");
    if ($fp) {
        fwrite($fp, $msg);
        fclose($fp);
    }
}

/**
 * change to new today file
 */
function changeFile () {
   rename("today.data", date("Ymd") . ".txt");
   unlink("today.data");
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
      $ts = date("U");
      $json = "$ts,{$matches[2]},{$matches[3]},{$matches[5]}\n";
      writeToFile($json);
   }
}

for(;;) {
	readFromDevice();
	sleep(1);
}
