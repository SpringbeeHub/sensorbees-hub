---
title: "While connecting the RS485 sensor to LoRaWAN end nodes, anything need to
  be attention? "
---
Yes, you do have few points needs to be confirmed before you connecting your sensor to the end nodes, like Dragino (RS485-LB & RS485-LN), Seeed (S2100)...

1. You need to check the data types of your 485 sensor probe, are they 8N1 or 8E1, some of the end nodes only support 8N1, so if your sensor doesn't support, they are unable to communicating.
2. Baud rate, the most common baud rate are 9600. but some of the sensor using different baud rate. You need to make sure they are the same baud rate.
