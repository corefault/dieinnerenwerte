#!/bin/bash
 
for (( ; ; ))
do
   raspistill -t 0 -o /var/www/backend/still.jpg -w 800 -h 600 -q 80 -ex night
   sleep 4
done