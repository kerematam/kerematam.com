---
title: A Bluetooth IoT Gateway (BLE-CC41A)
description: A small Python gateway that lets BLE-CC41A Bluetooth modules send HTTP requests to a cloud server.
pubDatetime: 2017-04-10T00:09:00+03:00
timezone: Europe/Istanbul
movedFrom: http://blog.kerematam.com/2017/04/a-bluetooth-iot-gateway-ble-cc41a.html
tags:
  - iot
  - bluetooth
  - python
---

An IoT gateway is the bridge for your **things** (within this project's scope; it is embedded Bluetooth nodes) to make them able to talk to your cloud server. Most of embedded WiFi modules comes with support of application layer capabilities (such as HTTP requests). But non Bluetooth modules that I have seen had such capabilities in application layer - at least the ones I saw. Most of Bluetooth modules that I tested, access to internet through mobile phone applications. But you might not have "a mobile phone" in your system design all the time. So this was one of my project that I started with such motivation, but sadly I had to leave it in half way. This piece of code manages Bluetooth modules and give them HTTP request capability. Even though this project have long way to go; it does what it has to in modest level.

**Github:** <https://github.com/kerematam/IoT-Gateway-BLE-CC41a>

## What does this Gateway do?

1. This Gateway automatically searches for BLE-CC41A module on each serial port.
2. Configures the serially connected BLE-CC41A module as master.
3. Searches for available slave modules around.
4. Establishes connection between master and slaves.
5. Sends requests of slaves to cloud server.

## Requirements

1. A linux machine able to run Python 2.7. I have developed and tested this gateway on Ubuntu 14.04 machine.
2. Gateway hardware should have at least one ethernet (to cloud server) and one serial USB port (for BLE-CC41A module).
3. A cloud server: I have used my own cloudserver.
   1. You can go with thingspeak.com and update the code accordingly.
   2. Wait for me to upload my cloudserver code to handle http requests
   3. Write your own servercode.
4. Couple of BLE-CC41A modules. It is clone of HM10.

## Configuration

You must modify `server_url` and `api_key` variables in `main.py`

![Diagram of the setup. Three BLE slave modules connect over Bluetooth to a BLE master module. The master connects by serial to the IoT gateway, which reaches a cloud server over the internet.](@/assets/posts/a-bluetooth-iot-gateway-ble-cc41a/iot-gateway-bluetooth.png)
