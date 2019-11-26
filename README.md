# Teltonika TMT250 - NodeJS driver

## AVL data packet

* 4 Bytes - 4 zeroes
* 4 Bytes - data field length
* 1 Byte - Codec ID (constant to 8 in TMT250)
* 1 Byte - Number of Data 1
* 30 - 147 Bytes - AVL Data
* 1 Byte - Number of Data 2
* 4 Bytes - CRC (first 2 bytes are 0, second two are CRC-16 calculated for `[codec id, number of data 2]`)

Minimum AVL packet size id 45 bytes (all IO elements disabled).
Maximum AVL packet size for one record iz *783* bytes.

### AVL Data

* 8 Bytes - timestamp
* 1 Byte - Priority (0 - low, 1 - high, 2 - panic)
* 15 Bytes - GPS Element (see below)
* 6-127 Bytes - IO Element

*GPS Element*:
* 4 Bytes - longitude (encoded in decimal format with precision `10^7`, for west multiply by `-1`; determined by 1st byte set to `1`)
* 4 Bytes - latitude (encoded in decimal format with precision `10^7`, for south multiply by `-1`; determined by 1st byte set to `1`)
* 2 Bytes - altitude (meters ASL)
* 2 Bytes - angle (in degrees - azimuth)
* 1 Byte - satellites (0 if no fix)
* 2 Bytes - speed (in km/h, 0x0000 if GPS data is invalid)

*IO Element*:

* 1 Byte - Event IO ID (id of changed event - the cause of generated event)
* 1 Byte - `N` of Total IO (`N = N1 + N2 + N4 + N8`)
* 1 Byte - `N1` - number of 1 byte events
* 1 Byte - 1st IO ID
* 1 Byte - 1st IO Value
* ...
* 1 Byte - `N2` - number of 2 byte events
* 1 Byte - 1st IO ID
* 2 Bytes - 1st IO Value
* ...
* 1 Byte - `N4` - number of 4 byte events
* 1 Byte - 1st IO ID
* 2 Bytes - 1st IO Value
* ...
* 1 Byte - `N8` - number of 8 byte events
* 1 Byte - 1st IO ID
* 2 Bytes - 1st IO Value
* ...

ID's can be obtained in TMT250 Protocols V1.2 manual.