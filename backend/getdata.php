<?php
/**
 * reading data from serial port and
 * translate data into JSON
 */
$device = "/dev/cu.usbserial";
$buffer = "";
$fp = fopen($device, "r");
if ($fp) {
    $buffer = fgets ($fp);
}
fclose($fp);

// now we have a line -> translat
// 28-Nov-05 16:07:39   100      91      24    MO               
// 28-Nov-05 15:58:59   100      96       8 
$date = substr($buffer,0,18);
$spo2 = substr($buffer,21,3);
$pulse = substr($buffer,29,3);
$pa = substr($buffer,38,3);
$status = "";
if (count($buffer) > 44) {
    $status = substr($buffer,44,2);
}

echo "{\"oxygen\": \"$spo2\", \"pulse\": \"$pulse\", \"pa\": \"$pa\", \"status\": \"$status\"}\n";
?>