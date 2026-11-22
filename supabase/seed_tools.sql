-- Seeds / repairs the Tools directory. Safe to re-run: existing slugs are overwritten with this content.
-- Run in the Supabase SQL editor. (Replaces the badly formatted Nmap entry.)

insert into tools (slug, name, category, description, supported_os, installation, basic_usage, common_commands, official_docs_url, learning_resources, defensive_notes) values
('nmap', 'Nmap', 'Reconnaissance & OSINT',
$md$Nmap (Network Mapper) is a free, open-source scanner that discovers devices on a network and shows which ports are open, which services are running, and often which versions and operating systems they are. Think of it as a security inspector walking around a building and checking every door.$md$,
array['Linux','macOS','Windows'],
$md$**Linux (Debian/Ubuntu)**

```bash
sudo apt update && sudo apt install nmap
```

**macOS (Homebrew)**

```bash
brew install nmap
```

**Windows:** download the installer from [nmap.org/download](https://nmap.org/download.html) (it includes the Npcap packet-capture driver).

Check it worked:

```bash
nmap --version
```$md$,
$md$Imagine a server is a house. Each **port** is a door, and each door leads to a service:

```text
SERVER 192.168.1.10
 ├─ Port 22   → SSH         (open)
 ├─ Port 80   → Web server  (open)
 ├─ Port 443  → HTTPS       (open)
 └─ Port 3306 → MySQL       (closed)
```

Nmap knocks on these doors and reports which ones answer. The simplest scan:

```bash
nmap 192.168.1.10
```

Typical output:

```text
PORT     STATE  SERVICE
22/tcp   open   ssh
80/tcp   open   http
443/tcp  open   https
3306/tcp closed mysql
```

**How to read the STATE column**

| State | Meaning | Defender takeaway |
|---|---|---|
| `open` | A service is listening and accepting connections | Is it needed? Is it patched and restricted? |
| `closed` | Reachable, but nothing is listening | Usually fine |
| `filtered` | A firewall is dropping or blocking probes | Nmap cannot tell if it is open |

Nmap is used in the *reconnaissance* and *enumeration* stages of security testing to answer one question: **"what is exposed on this network?"**$md$,
$md$### Command reference

| Syntax | Purpose | Description | Example |
|---|---|---|---|
| `nmap <target>` | Default scan | Scans the 1,000 most common TCP ports | `nmap 192.168.1.10` |
| `-sn` | Host discovery | Finds live hosts only, no port scan | `nmap -sn 192.168.1.0/24` |
| `-p <ports>` | Choose ports | Scan specific ports, a range, or `-p-` for all 65,535 | `nmap -p 22,80,443 192.168.1.10` |
| `-sV` | Version detection | Identifies the service and version on each open port | `nmap -sV 192.168.1.10` |
| `-O` | OS detection | Guesses the operating system (needs root/admin) | `sudo nmap -O 192.168.1.10` |
| `-sC` | Default scripts | Runs Nmap's safe default NSE scripts | `nmap -sC 192.168.1.10` |
| `-A` | Aggressive scan | Combines `-sV`, `-sC`, `-O` and traceroute | `sudo nmap -A 192.168.1.10` |
| `-sS` | SYN scan | Fast "half-open" TCP scan (needs root/admin) | `sudo nmap -sS 192.168.1.10` |
| `-sU` | UDP scan | Scans UDP ports (slower; finds DNS, SNMP, etc.) | `sudo nmap -sU -p 53,161 192.168.1.10` |
| `-Pn` | Skip discovery | Treat the host as up even if it ignores ping | `nmap -Pn 192.168.1.10` |
| `-T<0-5>` | Timing | Speed template; `-T4` is a common balance | `nmap -T4 192.168.1.10` |
| `-oN` / `-oX` / `-oA` | Save output | Normal text, XML, or all formats | `nmap -oA scan-results 192.168.1.10` |
| `--script <name>` | NSE scripts | Run a chosen script or category | `nmap --script http-title 192.168.1.10` |

### Useful combinations

Discover live hosts on a home or lab network:

```bash
nmap -sn 192.168.1.0/24
```

Audit what a single server exposes, with versions:

```bash
nmap -sV -p- -T4 192.168.1.10 -oN full-audit.txt
```

Check a web server for known issues using NSE vulnerability scripts (only on systems you own):

```bash
nmap --script vuln -p 80,443 192.168.1.10
```$md$,
'https://nmap.org/docs.html',
'[{"title":"Nmap Network Scanning (free official book)","url":"https://nmap.org/book/"},{"title":"Nmap reference guide (man page)","url":"https://nmap.org/book/man.html"},{"title":"NSE script documentation","url":"https://nmap.org/nsedoc/"}]'::jsonb,
$md$Nmap is a legitimate security and administration tool, but **scanning is only acceptable on systems you own or have explicit written permission to test.** Unauthorised scanning can breach computer-misuse laws and acceptable-use policies.

**For defenders:** run Nmap against your own network on a schedule and compare results over time — a new open port is often the first sign of an unapproved service or a misconfiguration. Close or firewall anything that does not need to be reachable.$md$),

('wireshark', 'Wireshark', 'Network Security',
$md$Wireshark is the world's most widely used network protocol analyzer. It captures packets as they cross a network interface and lets you inspect them layer by layer, which makes it essential for troubleshooting, incident response and learning how protocols really work.$md$,
array['Linux','macOS','Windows'],
$md$**Linux (Debian/Ubuntu)**

```bash
sudo apt install wireshark
```

During install, allow non-root users to capture packets, then add yourself to the `wireshark` group and log in again.

**macOS:** `brew install --cask wireshark`

**Windows:** installer from [wireshark.org/download](https://www.wireshark.org/download.html) (includes Npcap).$md$,
$md$1. Open Wireshark and choose the network interface that carries your traffic (Wi-Fi or Ethernet).
2. Click the blue shark-fin button to start capturing.
3. Use the **display filter** bar at the top to narrow what you see.
4. Click a packet to expand its layers (Ethernet → IP → TCP → application) in the middle pane.
5. Right-click a packet → **Follow → TCP Stream** to read a whole conversation.

Wireshark can also be used from the terminal with `tshark`:

```bash
tshark -i eth0 -c 20
```$md$,
$md$### Display filters

| Filter | Purpose | Example use |
|---|---|---|
| `ip.addr == 192.168.1.10` | Traffic to or from one host | Isolate a single device |
| `tcp.port == 443` | One TCP port | See HTTPS connections |
| `dns` | DNS queries and answers | Spot odd domain lookups |
| `http` | Unencrypted web traffic | Inspect HTTP requests |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | New connection attempts (SYN) | Spot scanning activity |
| `http.request.method == "POST"` | Form submissions | Check what is sent over HTTP |
| `tcp.analysis.retransmission` | Retransmitted packets | Diagnose slow or lossy links |

### Capture filters (set before capturing)

```text
host 192.168.1.10
port 53
net 192.168.1.0/24
```$md$,
'https://www.wireshark.org/docs/',
'[{"title":"Wireshark User Guide","url":"https://www.wireshark.org/docs/wsug_html_chunked/"},{"title":"Display filter reference","url":"https://www.wireshark.org/docs/dfref/"}]'::jsonb,
$md$Only capture traffic on networks you own or are authorised to monitor — packet captures can contain other people's private data. Treat capture files (`.pcap`) as sensitive. This is also why you should use HTTPS/TLS everywhere: anything sent in cleartext can be read by anyone who can capture it.$md$),

('burp-suite', 'Burp Suite Community', 'Web Application Security',
$md$Burp Suite is an intercepting proxy for testing web applications. It sits between your browser and a website so you can see, pause and modify every request and response — the foundation of manual web security testing.$md$,
array['Linux','macOS','Windows'],
$md$Download the free **Community Edition** from [portswigger.net/burp/communitydownload](https://portswigger.net/burp/communitydownload) and run the installer for your OS. It bundles its own Java runtime.

Start it with a **Temporary project** and the default configuration.$md$,
$md$1. Open **Proxy → Intercept** and launch the built-in browser (Open browser).
2. Browse the target application you are authorised to test.
3. Each request appears in **HTTP history**. Turn **Intercept on** to pause and edit a request before it is sent.
4. Right-click a request → **Send to Repeater** to resend it with changes and compare responses.
5. Use **Decoder** to decode Base64/URL-encoded values you find.

A safe practice target: PortSwigger's free [Web Security Academy](https://portswigger.net/web-security) labs.$md$,
$md$| Tab | Purpose | What you do with it |
|---|---|---|
| Proxy | Intercept and inspect traffic | Pause, view and edit requests |
| Repeater | Manual request replay | Change a parameter and re-send to study the response |
| Decoder | Encode/decode data | Decode Base64, URL and HTML encoding |
| Comparer | Diff two items | Spot subtle differences between responses |
| Target → Site map | See app structure | Review every URL seen so far |$md$,
'https://portswigger.net/burp/documentation',
'[{"title":"Web Security Academy (free labs)","url":"https://portswigger.net/web-security"},{"title":"Burp Suite documentation","url":"https://portswigger.net/burp/documentation"}]'::jsonb,
$md$Only test applications you own or have written permission to test. Intercepting your own traffic to learn is fine; modifying requests against someone else's live site is not. Developers can use Burp to see exactly what their app sends and to confirm input validation and access control work.$md$),

('owasp-zap', 'OWASP ZAP', 'Web Application Security',
$md$ZAP (Zed Attack Proxy) is a free, open-source web application security scanner maintained by the OWASP community. It can passively watch traffic for problems and actively scan an application, and it fits neatly into CI pipelines.$md$,
array['Linux','macOS','Windows'],
$md$Download from [zaproxy.org/download](https://www.zaproxy.org/download/), or run it in Docker without installing anything:

```bash
docker pull ghcr.io/zaproxy/zaproxy:stable
```$md$,
$md$**Quick baseline scan from the command line** (passive checks, safe for a first look at your own site):

```bash
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://your-own-site.example
```

In the desktop app, use **Automated Scan**, enter a URL you are authorised to test, and review the **Alerts** tab. Each alert includes the risk level, evidence and a suggested fix.$md$,
$md$| Script / mode | Purpose | Description |
|---|---|---|
| `zap-baseline.py` | Passive baseline scan | Spiders the site and reports passive findings; low risk |
| `zap-full-scan.py` | Full active scan | Sends attack payloads; only on systems you own/test environments |
| `zap-api-scan.py` | API scan | Scans an API from an OpenAPI/SOAP/GraphQL definition |
| Desktop → Automated Scan | Guided scan | Point-and-click spider plus active scan |$md$,
'https://www.zaproxy.org/docs/',
'[{"title":"ZAP documentation","url":"https://www.zaproxy.org/docs/"},{"title":"OWASP Top 10","url":"https://owasp.org/www-project-top-ten/"}]'::jsonb,
$md$Run active scans only against systems you own, ideally a staging copy — they send real attack payloads and can create data or trigger alerts. Adding the baseline scan to your CI pipeline catches common misconfigurations before release.$md$),

('trivy', 'Trivy', 'Container/Kubernetes Security',
$md$Trivy is a fast, open-source vulnerability and misconfiguration scanner for container images, file systems, Git repositories and Kubernetes. It is a staple of DevSecOps pipelines.$md$,
array['Linux','macOS','Windows'],
$md$**macOS / Linux (Homebrew)**

```bash
brew install trivy
```

**Debian/Ubuntu** and other methods: see the [installation guide](https://trivy.dev/latest/getting-started/installation/).$md$,
$md$Scan a container image for known vulnerabilities:

```bash
trivy image nginx:latest
```

Scan the dependencies in your project folder:

```bash
trivy fs .
```

Show only serious findings:

```bash
trivy image --severity HIGH,CRITICAL nginx:latest
```$md$,
$md$| Command | Purpose | Example |
|---|---|---|
| `trivy image <name>` | Scan a container image | `trivy image python:3.12` |
| `trivy fs <path>` | Scan a local project folder | `trivy fs .` |
| `trivy repo <url>` | Scan a Git repository | `trivy repo https://github.com/org/repo` |
| `trivy config <path>` | Find IaC misconfigurations | `trivy config ./terraform` |
| `--severity` | Filter by severity | `--severity HIGH,CRITICAL` |
| `--exit-code 1` | Fail a CI build on findings | `trivy image --exit-code 1 --severity CRITICAL app:latest` |$md$,
'https://trivy.dev/latest/docs/',
'[{"title":"Trivy documentation","url":"https://trivy.dev/latest/docs/"}]'::jsonb,
$md$Trivy is purely defensive: scan your own images and code, fix or update vulnerable packages, and fail builds that ship critical issues. Re-scan regularly — new CVEs are published against old images every day.$md$),

('nikto', 'Nikto', 'Vulnerability Scanning',
$md$Nikto is an open-source web server scanner that checks for dangerous files, outdated server software and common misconfigurations. It is noisy and fast, so it is best for auditing servers you own.$md$,
array['Linux','macOS','Windows'],
$md$**Debian/Ubuntu / Kali**

```bash
sudo apt install nikto
```

**From source:** `git clone https://github.com/sullo/nikto` and run `perl nikto.pl` from the `program` folder.$md$,
$md$Scan a web server you own:

```bash
nikto -h http://192.168.1.10
```

Scan an HTTPS site and save an HTML report:

```bash
nikto -h https://your-own-site.example -ssl -o report.html -Format htm
```$md$,
$md$| Option | Purpose | Example |
|---|---|---|
| `-h <host>` | Target host or URL | `nikto -h http://192.168.1.10` |
| `-p <port>` | Port(s) to scan | `nikto -h 192.168.1.10 -p 80,8080` |
| `-ssl` | Force HTTPS | `nikto -h example.test -ssl` |
| `-o <file>` / `-Format` | Save a report | `-o report.html -Format htm` |
| `-Tuning <x>` | Limit test categories | `-Tuning 123b` |$md$,
'https://github.com/sullo/nikto/wiki',
'[{"title":"Nikto wiki","url":"https://github.com/sullo/nikto/wiki"}]'::jsonb,
$md$Nikto generates a lot of requests and will show up in logs and intrusion detection — that is expected. Use it only against servers you own or are authorised to test, and treat its findings as leads to verify, since scanners also report false positives.$md$)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, description = excluded.description,
  supported_os = excluded.supported_os, installation = excluded.installation,
  basic_usage = excluded.basic_usage, common_commands = excluded.common_commands,
  official_docs_url = excluded.official_docs_url, learning_resources = excluded.learning_resources,
  defensive_notes = excluded.defensive_notes;
