---
title: Creating Script to Run on Boot for OpenWRT (Chaos Calmer)
description: How to make a script run on boot on OpenWRT Chaos Calmer, with a procd init script.
pubDatetime: 2016-12-03T01:46:00+03:00
timezone: Europe/Istanbul
movedFrom: http://blog.kerematam.com/2016/12/creating-script-to-run-on-boot-for.html
tags:
  - openwrt
  - linux
archivedComments:
  - author: Qqwy
    date: 2021-07-14T12:54:35+03:00
    note: Left on the earlier version of this post, written in 2015 for OpenWRT Barrier Breaker.
    text: |
      Hi there! Thank you for your post. It helped me get started with writing my own init script.

      I do want to point out, to whomever it may concern, that because init scripts turn out to be ordered alphabetically, using a START number higher than 99 (or lower than 10) will not have the effect you expect. In the case of your example, your code will already run after any script with START 10.

      Have a wonderful day :-)
---

Chaos Calmer has brand new process management daemon to handle init scripts to run on boot, named **procd**. You can do further reading links below if my tutorial won't work for you. Sadly documentation about procd in OpenWRT wiki site has not been finished at the moment while I was writing this dramatic blog post... ;\_;

Anyway ssh to your OpenWRT device and follow steps below. All highlighted parts are personal, so put your personal own file names and commands according to your configuration:

1. Create script file under `/etc/init.d/`. I named my script `start-my-script.sh`:

   ```sh
   # [!code word:start-my-script.sh]
   root@OpenWrt:/# vim /etc/init.d/start-my-script.sh
   ```

2. Copy and paste lines below to your file:

   ```sh
   # [!code word:/target/to/your/command -some -options -here]
   #!/bin/sh /etc/rc.common

   # it is run order of your script, make it high to not mess up other init scripts
   START=100

   USE_PROCD=1

   start_service() {
     procd_open_instance
     procd_set_param command /target/to/your/command -some -options -here
   }
   ```

3. Give execute permission to your script:

   ```sh
   # [!code word:start-my-script.sh]
   root@OpenWrt:/# chmod +x /etc/init.d/start-my-script.sh
   ```

4. Enable init script with the command below. It will create symlink in `/etc/rc.d` directory so it makes your script run on boot:

   ```sh
   root@OpenWrt:/# /etc/init.d/start-my-script.sh enable
   ```

And done! Reboot your device and check if it works. Check links below for further reading:

- <https://openwrt.org/doc/techref/init.detail.cc>
- <https://openwrt.org/inbox/procd-init-scripts>
- <https://openwrt.org/doc/techref/procd>
