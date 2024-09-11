---
slug: linux-strength-training-walkthrough
title: TryHackMe - Linux Strength Training - Walkthrough
authors: bw
tags: [learning, linux-strength-training, tryhackme, walkthrough]
---

This is a walkthrough for [TryHackMe][thm] room: [Linux Strength Training][linux-room].

I will do my best to not spoil some of the answers, however that may be difficult as a lot of the answers are commands needed to progress. With that, deploy your machine and let’s get started!

# Finding your way around Linux – Overview
The first question can be answered by reading the given material in this task. The second question can be answered in the same way, but here is a hint:

`find /home/francis -**** * -user francis -**** ***`

Next, let’s ssh into the machine using the given credentials: `ssh topson@<machine_ip>`

`cd /home/topson/chatlogs`

Command: `grep -iRl 'keyword'`

![l1](/img/thm/linux-strength/l1.png)

Command: `less ****-**-**`

Then type: / then keyword then Enter

![l2](/img/thm/linux-strength/l2.png)

Press **Q** to exit the `less` command.

Command: `less ../ReadMeIfStuck.txt`

This gives us a clue! Now, let’s find the next file with the `find` command:

`find / -type f -name '<file_name>' 2>/dev/null`

![l3](/img/thm/linux-strength/l3.png)

Once we read that file, it gives us another clue!

`find / -type d -name '<directory_name>' 2>/dev/null`

**NOTE:** Try using '\' before the space. For example: `'directory\ name'`

`cd` to that directory and then read the file!

![l4](/img/thm/linux-strength/l4.png)

Alright, now let’s find this file:

`find /home/topson/<directory_name> -type f -newermt ****-**-** ! -newermt ****-**-** 2>/dev/null`

Command: `less <file_name>`

Type: `/` then `Flag` then **Enter**. Use **Pg Dn** until you see the highlighted pattern

![l5](/img/thm/linux-strength/l5.png)

# Working with Files
For the first question, utilize the information in the task.

`** * /home/francis/logs`

Next question, utilize the info given:

`*** /home/james/Desktop/******.** ****@192.168.10.5:/home/****/scripts`

Next:

`** ** -logs -newlogs`

Copy files named encryption keys:

`** "encryption keys" /home/john/logs`

Now, let’s find this file:

`find /home/topson -type f -name 'readME_hint.txt'`

![l6](/img/thm/linux-strength/l6.png)

Let’s follow those directions. First, navigate to that directory.

Command: `mv ** -MoveMe.txt ./-march\ folder/`

Then, `cd` into that folder. And run the script:

`./-runME.sh`

![l7](/img/thm/linux-strength/l7.png)

# Hashing – Introduction
Download the file given and then run (on local machine):

`john --format=RAW-MD5 --wordlist=rockyou.txt hash1.txt`

![l9](/img/thm/linux-strength/l9.png)

Now `ssh` into the machine using the given credentials.

Let’s find the file: `find /home/sarah -type f -name hashA.txt`

Now, use `scp` to copy the file over (on local machine): `scp sarah@<machine_ip>:/home/sarah/<file_path>/hashA.txt hashA.txt`

Then utilize hash identifier: `cat hashA.txt | hash-identifier`

Crack the hash utilizing **John the Ripper**.

Follow the same procedure to complete the rest of the section.

# Decoding Base64
Find the file: `find /home/sarah -type f -name encoded.txt 2>/dev/null`

Decode the file: `cat <path_to_file> | base64 -d | grep -a special`

Now, let’s look for the next file: `find /home/sarah -type f -name ***.txt 2>/dev/null`

When you cat `/home/sarah/<path_to_file>` you get a hash. Decode the hash with **John the Ripper**

# Encryption/Decryption using GPG
First answer: `gpg --******-**** AES-128 --********* history_logs.txt`

Second: `*** history_logs.txt.***`

For this, use the `find` command to look for the files, then decrypt with the learned commands in this task.

# Cracking Encrypted GPG Files
Find the encrypted file and wordlist. `scp` these to your local machine.

Then: `tac data.txt > new_data.txt`

Then run: `john --format=gpg --wordlist=new_data.txt personal.txt.gpg`

![l10](/img/thm/linux-strength/l10.png)

# Reading SQL Databases
Find the database. Then to access the DB, use: `mysql -u sarah -p` with the supplied password

Find the flag in the DB:

![l11](/img/thm/linux-strength/l11.png)

# Final Challenge
Find and read the chat logs, starting with `LpnQ`

![l12](/img/thm/linux-strength/l12.png)

Search for any chat log that contains: `sameer`

`grep -iRl 'sameer'`

Read the 2 other chat logs.

In the folder: `/home/shared/sql/conf`, look for the configuration file that is `-size 50M`. Then `less` the file.

We get a base64 hash. Decode it and you will find the directory of the backup SQL database.

![l13](/img/thm/linux-strength/l13.png)

Now navigate to that directory, and download it to the local machine, along with the wordlists that start with the given letters.

`grep -iRl '***'`

Combine the 3 files into one. From here, you should be able to use **John the Ripper** to figure out the password, however, this was not working for me so I entered them in manually.

Unzip the file: `unzip 2020-08-13.zip`

Now, search the `load_employees.dump`: `grep -ia 'james'`

![l14](/img/thm/linux-strength/l14.png)

SSH into the box with the given credentials. Then once logged in, read the root flag!

`sudo cat /root/root.txt`

![l15](/img/thm/linux-strength/l15.png)

# Review
This room was great to practice some linux command-line! There were a few questions that took a bit to figure out, and I did my best to not just give all the answers so you could actually practice yourself!

# References
[TryHackMe][thm] | [Linux Strength Training Room][linux-room]

[thm]: https://tryhackme.com
[linux-room]: https://tryhackme.com/r/room/linuxstrengthtraining