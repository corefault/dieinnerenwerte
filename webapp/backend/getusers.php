<?php

/* set header to json response content */
header("Content-type: application/json");

$dir = 'users/';

$json = "{\"list\": [";
$count = 0;
if($dh = opendir($dir)){
   while(($file=readdir($dh)) !== FALSE){
      $file = $dir . '/' . $file;
      if(!is_file($file) || substr($file, 0, 1) == '.'){
         continue;
      }
      $buf = file_get_contents($file);
      if ($count > 0) {
         $json .=",";
      }
      $json .= $buf;
      $count++;
   }
   closedir($dh);
}
$json .= "]}";
echo $json;
?>