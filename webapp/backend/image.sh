#!/bin/bash
 
for (( ; ; ))
do
   raspistill -t 0 -o /var/www/backend/still.jpg -w 640 -h 480 -q 90
   sleep 4
done