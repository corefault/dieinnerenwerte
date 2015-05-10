#! /bin/sh
echo "Starting dieinnerenwerte"
# run application you want to start
chmod o=rx /dev/ttyUSB0
stty -F /dev/ttyUSB0 ispeed 19200 ospeed 19200
chmod 0777 /var/www/backend
chmod +x /var/www/backend/*.sh
php-cgi /var/www/backend/infinite.php &
/var/www/backend/image.sh &

