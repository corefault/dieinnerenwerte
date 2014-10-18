<?php

$fp = fopen("/dev/cu.usbserial", "r");
if ($fp) {
	while (1) {
    		$buffer = fgets ($fp);
		echo $buffer;
	}
	fclose($fp);
}
