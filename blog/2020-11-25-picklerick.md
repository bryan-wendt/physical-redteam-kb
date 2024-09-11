---
slug: picklerick-walkthrough
title: TryHackMe - Pickle Rick - Walkthrough
authors: bw
tags: [learning, picklerick, tryhackme, walkthrough]
---

Since this is my first [TryHackMe (THM)][thm] write-up, I figured it would be good to start with a fun one! This is the [Pickle Rick][picklerick] room.

# Enumeration
Since we don’t have any info at all other than “help Rick make his potion” we need to start enumerating.

First thing is to run an nmap scan:

`nmap -T4 -A -p- 10.10.56.17`

![pr6](/img/thm/picklerick/pr6.png)

Nothing much for us to grab from the nmap scan, other than the website. Let’s go take a look!

![pr1](/img/thm/picklerick/pr1.webp)

As you can see. There isn’t much here. We could just start trying standard pages, but lets take a more nuanced approach.

I’ll checkout Wappalyzer to find out information about the website. If you aren’t aware of this tool, it is a browser extension that provides information about the website code and infrastructure. You can download Wappalyzer [here][wappalyzer].

![pr2](/img/thm/picklerick/pr2.png)

As you can tell, we are running Apache, jQuery, PHP. Pretty standard. Since we know it is php, lets run a gobuster scan against the website, on anything with a “.php” extension.

```bash
gobuster dir -u http://10.10.56.17 -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -x php
```

While that is running, lets view the source code.

![pr3](/img/thm/picklerick/pr3.png)

*Something good to know if we find a login page!*
We also can see if there is a robots.txt file: `http://10.10.56.17/robots.txt`

Interesting find: `robots.txt contains: Wubbalubbadubdub`

Looking at the gobuster scan we can see it already found a `login.php`, `portal.php`, and `/assets`

![pr4](/img/thm/picklerick/pr4.png)

`portal.php` redirects back to `login.php`

We can stop our gobuster scan, since this seems like our next area to look into.

# Exploitation
We already know a username: `R1ckRul3s` and we also have the info we found in `robots.txt`: `Wubbalubbadubdub`

Let’s try to login with those……IT WORKS!

Straight away we see a command panel, along with a few other headings. Let’s explore the site. After exploring, everything is locked down other than the command panel! Let’s start inputting some commands.

Doing a `ls` shows us the files in our current directory

![pr7](/img/thm/picklerick/pr7.png)

I think we found our first ingredient. Let’s `cat Sup3rS3cretPickl3Ingred.txt`. Oh no, we get denied! Another way to view file info is with `less`. Let’s try that!

![pr8](/img/thm/picklerick/pr8.png)

We found our first ingredient. Now lets look at that clue! `less clue.txt`

We are told to look around the file system. Let’s keep exploring!

After some looking around, we stumble upon `cd ../../../home/rick; ls` If we `less` the file in there, we find our second ingredient!


We can keep exploring! Let’s go! I have a feeling, that the last ingredient, is going to need root privileges. Let’s check out what we can do with `sudo` by running `sudo -l`

![eyes_wide](/img/thm/picklerick/eyes_wide.gif)

We can run sudo anything and everything! Run `sudo ls ../../../root` where we find our third flag!

![pr10](/img/thm/picklerick/pr10.png)

# Review
This was a fun themed-room that was relatively easy, but was definitely a good exercise in enumeration. I enjoyed this room and hope that you come back for more walkthroughs in the future!

# References
[TryHackMe][thm] | [Pickle Rick Room][picklerick] | [Wappalyzer][wappalyzer]

[thm]: https://tryhackme.com
[picklerick]: https://tryhackme.com/r/room/picklerick
[wappalyzer]: https://www.wappalyzer.com/apps/