# pulsewatch

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

