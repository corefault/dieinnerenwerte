<?php

/**
 * this class parse the protocol and generate data segments
 * information will provided in json format
 * 
 * todo
 * - alarm boundaries check
 * - get chartdata for all
 */
class Segmentation {

    var $lines = array(),
        $filename = "",
            $ranges_sp = array(),
            $ranges_pulse = array(),
            $range_alarm = array(),
            $begin = 0,
            $finished = 0;

    /**
     * constructor reads complete file into array
     */
    function Segmentation() {
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
     * get lastest file 
     */
    function lastfile() {
        $list = $this->files();
        return $list[count($list)-1];
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
        return $list;
    }

    /**
     * helper function for ranges
     * @param $array reference to array
     * @param $key the key to check
     */
    function putInto(&$array, $key) {
        if (@array_key_exists($key, $array)) {
            $array[$key] ++;
        } else {
            $array[$key] = 1;
        }
    }

    /**
     * get datapoints forgiven range
     * @param $from beginning index
     * @param $to ending index
     */
    function data($from, $to) {
        $json = [];
        for ($i = $from; $i < $to; $i++) {
            list($date, $sp, $beat, $alert) = explode(",", $this->lines[$i]);
            $json["labels"][] = $i;
            $json["sp"][] = (int) $sp;
            $json["pulse"][] = (int) $beat;
        }
        echo json_encode($json, JSON_PRETTY_PRINT);
    }

    /**
     * check segments and generate trending information
     * @param $range the range to check
     */
    function trend($range) {
        $index = 0;
        $count = 0;
        $json = array();
        while ($index < count($this->lines)) {
            $avg = 0;
            $min = 1000;
            $max = 0;

            $end = $index + $range;
            if ($end > count($this->lines)) {
                $end = count($this->lines);
            }
            $points = $end - $index;
            for ($i = $index; $i < $end; $i++) {

                list($date, $sp, $beat, $alert) = explode(",", $this->lines[$i]);
                $min = ($beat < $min) ? $beat : $min;
                $max = ($beat > $max) ? $beat : $max;
                $avg+=$beat;
            }
            $count++;
            $avg = $avg / $points;
            $json[] = array("from" => date("d.m.Y H:i:s", $this->lines[$index]),
                "to" => date("d.m.Y H:i:s", $this->lines[$i - 1]),
                "minValue" => (int) $min,
                "maxValue" => (int) $max,
                "averageValue" => (int) $avg,
                "beginIndex" => $index,
                "endIndex" => $end);

            $index += $range;
        }

        echo json_encode($json, JSON_PRETTY_PRINT);
    }

    /**
     * parsing the lines and make ranges.
     */
    function parseSegments() {
        for ($i = 0; $i < count($this->lines); $i++) {

            list($date, $sp, $beat, $alert) = explode(",", $this->lines[$i]);

            $this->putInto($this->ranges_pulse, (int) ($beat / 10) * 10);
            $this->putInto($this->ranges_sp, (int) ($sp / 10) * 10);
            $alert = str_replace("\n", "", $alert);
            if (strlen($alert) > 0) {
                $this->putInto($this->ranges_alarm, $alert);
            }
        }
        // get the dates
        list($this->begin, $sp, $beat, $alert) = explode(",", $this->lines[0]);
        list($this->finished, $sp, $beat, $alert) = explode(",", $this->lines[count($this->lines) - 1]);
    }

    /**
     * output statistic
     */
    function statistic() {
        $json = array();
        $json["beginDate"] = date("d.m.Y H:i:s", $this->begin);
        $json["endDate"] = date("d.m.Y H:i:s", $this->finished);
        $seconds = $this->finished - $this->begin;
        $hours = (int) ($seconds / 3600);
        $minutes = (int) (($seconds % 3600) / 60);
        $json["duration"] = "$hours:$minutes";
        $json["amount"] = count($this->lines);
        $json["stat"] = array("sp" => $this->ranges_sp,
            "alert" => $this->ranges_alarm,
            "pulse" => $this->ranges_pulse);

        $json["files"] = $this->files();
        $json["current"] = $this->filename;
        echo json_encode($json, JSON_PRETTY_PRINT);
    }

}

$s = new Segmentation();
if (isset ($_REQUEST["file"])) {
    $file = $_REQUEST["file"];
} else {
    $file = $s->lastfile();
}
$s->initialize($file);
if ($_REQUEST["q"] == "stat") {
    $s->parseSegments();
    $s->statistic();
} else if ($_REQUEST["q"] == "trend") {
    $s->trend($_REQUEST["val"]);
} else {
    echo "{}";
}
unset($s);
?>
