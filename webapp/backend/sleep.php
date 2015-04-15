<?php

/**
 * this class parse the protocol and generate sleep data
 * information will provided in json format
 */
class Sleep {

    var $lines = array(),
        $filename = "",
        $ranges_sp = array(),
        $ranges_pulse = array(),
        $range_alarm = array(),
        $begin = 0,
        $finished = 0;

    /**
     * constructor 
     */
    function Sleep() {
        date_default_timezone_set('Europe/Berlin');
    }
    
    /**
     * read given file
     * @param $file the filename or empty for last one
     */
    function initialize($file) {
        $this->filename = $file;
        $this->lines = file($file);
    }

    /**
     * read directory and return list of all files
     * @return list of files
     */
    function files () {
        $dir = ".";
        $list = array();
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== FALSE) {
                $file = $dir . '/' . $file;
                if (!is_file($file) || substr($file, -4) != ".txt") {
                    continue;
                }
                $list[] = $file;
            }
            closedir($dh);
        }
        
        sort($list);
        return $list;
    }

    /**
     * parsing the lines and make sleep phases.
     */
    function phase() {
        // pulse >100 awake
        // pulse > 80 sleep
        // pulse < 80 deep sleep
       
       $json = array();
       $json["awake"] = 0;
       $json["sleep"] = 0;
       $json["deep"] = 0;
       $json["file"] = $this->filename;
       $last  = 0;
       
        for ($i = 0; $i < count($this->lines); $i++) {

            list($date, $sp, $beat, $alert) = explode(",", $this->lines[$i]);
            if ($last == 0) {
               $last = $date - 2;
            }
            
            $diff = $date - $last;
            $last = $date;
            
            if ($beat >= 100) {
               $json["awake"] += $diff;
            } else if ($beat >= 80) {
               $json["sleep"] += $diff;
            } else {
               $json["deep"] += $diff;
            }
        }
        
        // smart date
        $json["awake"] = $this->smartdate($json["awake"]);
        $json["sleep"] = $this->smartdate($json["sleep"]);
        $json["deep"] = $this->smartdate($json["deep"]);
        
        echo json_encode($json, JSON_PRETTY_PRINT);
    }
    
    /**
     * make smart date from given value
     * @param type $val seconds
     */
    function smartdate($val) {
       $m = intval($val / 60);
       $s = intval($val % 60);
       $h = intval($m / 60);
       if ($h > 0) {
          $m = intval($m % 60);
       }
       if ($h > 0) {
          return "$h h $m min $s s";
       }
       if ($m > 0) {
          return "$m min $s s";
       }
       return "$s s";
    }
}

$s = new Sleep();
if (isset ($_REQUEST["file"])) {
    $file = $_REQUEST["file"];
} else {
    $file = "./today.data";
}
$s->initialize($file);
$s->phase();
unset($s);
