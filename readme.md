# pulseWATCH

this is a concept for the dataport of the pulsoxymeter n-560. the data should be read in realtime from the dataport which uses the rs232 protocol.

the data is then reorganized in better readable format. data can be retrieved via REST service to be displayed in a web application.

## architecture

the communication with the n-560 is done with a raspberyy pi board which reads via rs232 the data from the device. for this a lowlevel program must be written to read the port in a specific interval. 

the interval might be configurable in the future.

the data read is organized for better handling in client applications. the pi board should have a webserver installed and running. a webapplication provides the REST service to transmit the data to a web application.

## lowlevel reading

the lowlevel reading could be done using the commandline and bash scripts. maybe a little c program must be written for better handling and reorganization of data.

## web application 
the web aplication is used for visualization of the data. in a user configurable interval the data is read from the lowlevel system.

the UI provides the following data

* beats per minute
* oxygen value
* visualization of the data in a live chart

the web application supports two modes

* realtime (default)
* simulation mode with mock requests (use #debug in url)

the pulsoxymeter reports status information about the device itself like sensor loss or low battery.
this status is displayed in the upper right corner and traced in the protocol window.

## alarmsystem

the application can define ranges for an alarm to inform the user.

if a value is out of bounds an alarm is displayed in red and a sound will inform the user.

additionally each alarm is logged in a separate area.

## reading from serial port

the port runs on 19200 baus and sends a line each 2seconds in the following format

    28-Nov-05 12:18:28   ---     ---     ---    SO  
    
using the usb to serial adapter will put a device on /dev/usbserial

