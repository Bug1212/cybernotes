export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  explain: string;
}
export interface QuizCategory {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  questions: QuizQuestion[];
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    slug: "networking",
    title: "Networking",
    blurb: "OSI layers, TCP/IP, DNS and how traffic really moves.",
    icon: "🌐",
    questions: [
      { q: "At which OSI layer do routers primarily operate?", options: ["Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport", "Layer 7 – Application"], answer: 1, explain: "Routers forward packets using IP addresses, which live at Layer 3. Switches mostly work at Layer 2 using MAC addresses." },
      { q: "Which protocol translates a domain name such as example.com into an IP address?", options: ["DHCP", "ARP", "DNS", "ICMP"], answer: 2, explain: "DNS (Domain Name System) maps names to IP addresses. DHCP hands out addresses, ARP maps IPs to MACs, ICMP carries diagnostics like ping." },
      { q: "What is the correct order of the TCP three-way handshake?", options: ["SYN, SYN-ACK, ACK", "ACK, SYN, SYN-ACK", "SYN, ACK, FIN", "SYN-ACK, SYN, ACK"], answer: 0, explain: "The client sends SYN, the server replies SYN-ACK, and the client confirms with ACK. Port scanners such as Nmap's SYN scan abuse the first two steps." },
      { q: "Which default port does HTTPS use?", options: ["21", "80", "443", "3389"], answer: 2, explain: "HTTPS uses TCP 443. Port 80 is plain HTTP, 21 is FTP and 3389 is Remote Desktop." },
      { q: "What does ARP do on a local network?", options: ["Encrypts traffic", "Maps IP addresses to MAC addresses", "Assigns IP addresses", "Blocks malicious packets"], answer: 1, explain: "ARP finds the MAC address that belongs to an IP on the local segment. Because it has no authentication, it can be abused in ARP spoofing attacks." },
      { q: "Which practice splits a network into isolated zones to limit how far an attacker can move?", options: ["Port mirroring", "Network segmentation", "Load balancing", "Packet fragmentation"], answer: 1, explain: "Segmentation (for example with VLANs and firewalls) stops one compromised machine from reaching everything else — it limits lateral movement." },
    ],
  },
  {
    slug: "linux",
    title: "Linux",
    blurb: "Commands, permissions and files every defender should know.",
    icon: "🐧",
    questions: [
      { q: "Which command lists files together with their permissions and owners?", options: ["ls -l", "cat -p", "pwd -a", "stat -d"], answer: 0, explain: "`ls -l` prints the long format: permissions, owner, group, size and date." },
      { q: "What does `chmod 640 notes.txt` set?", options: ["Owner read/write, group read, others no access", "Everyone read/write", "Owner read only, group write", "Owner execute only"], answer: 0, explain: "6 = read+write (owner), 4 = read (group), 0 = no access (others). Tight permissions like this protect sensitive files." },
      { q: "Which command keeps printing new lines as they are added to a log file?", options: ["head -f", "tail -f", "cat -n", "less -x"], answer: 1, explain: "`tail -f /var/log/auth.log` follows a log live — handy for watching login attempts." },
      { q: "Where are hashed user passwords stored on modern Linux systems?", options: ["/etc/passwd", "/etc/shadow", "/var/log/auth.log", "/etc/hosts"], answer: 1, explain: "/etc/shadow holds password hashes and is readable only by root. /etc/passwd is world-readable and no longer contains the hashes." },
      { q: "What does `sudo` do?", options: ["Deletes a user", "Runs a command with elevated privileges", "Updates the kernel", "Shows running processes"], answer: 1, explain: "`sudo` runs a single command as another user (usually root) after authorisation. It is safer than staying logged in as root and it logs each use." },
      { q: "Which command searches for a text pattern inside files?", options: ["find", "grep", "chown", "awk -d"], answer: 1, explain: "`grep 'Failed password' /var/log/auth.log` finds matching lines. `find` searches for files by name or attribute, not content." },
    ],
  },
  {
    slug: "ethical-hacking",
    title: "Ethical Hacking",
    blurb: "Authorisation, methodology and the mindset behind legal testing.",
    icon: "🎩",
    questions: [
      { q: "What must you have BEFORE testing a system that is not yours?", options: ["A faster laptop", "Written authorisation and an agreed scope", "A VPN", "A vulnerability scanner licence"], answer: 1, explain: "Written permission defining scope is what separates ethical hacking from a crime. Without it, even 'just looking' can be illegal." },
      { q: "Which of these is PASSIVE reconnaissance?", options: ["Running a port scan against the target", "Reading the target's public job postings and WHOIS records", "Sending crafted packets to open ports", "Trying default passwords"], answer: 1, explain: "Passive recon gathers public information without touching the target's systems. Scanning and login attempts are active and can be detected." },
      { q: "What does the CIA triad stand for?", options: ["Control, Isolation, Authentication", "Confidentiality, Integrity, Availability", "Cryptography, Identity, Access", "Compliance, Inspection, Audit"], answer: 1, explain: "Confidentiality (only the right people see data), Integrity (data is not tampered with) and Availability (systems work when needed) are the three core security goals." },
      { q: "What is social engineering?", options: ["Building secure social networks", "Manipulating people into revealing information or taking actions", "Encrypting chat messages", "Scanning social media accounts for malware"], answer: 1, explain: "It attacks the human, not the machine — phishing emails and fake phone calls are common examples. Awareness training is the main defence." },
      { q: "What do 'rules of engagement' define in a penetration test?", options: ["The tester's salary", "Scope, allowed techniques, timing and contacts", "The report's font", "Which tools are free"], answer: 1, explain: "Rules of engagement set what may be tested, how, when, and who to call if something breaks, protecting both client and tester." },
      { q: "What is the main purpose of a penetration test report?", options: ["To prove the tester is skilled", "To document findings, risk and how to fix them", "To list every tool used", "To replace the security policy"], answer: 1, explain: "The report is the deliverable: clear findings, their business impact and prioritised remediation steps." },
    ],
  },
  {
    slug: "owasp",
    title: "OWASP Top 10",
    blurb: "The most common web application security risks.",
    icon: "🕸",
    questions: [
      { q: "Which risk is #1 in the OWASP Top 10 (2021)?", options: ["Injection", "Broken Access Control", "Cryptographic Failures", "Security Misconfiguration"], answer: 1, explain: "Broken Access Control moved to first place in 2021 — users acting outside their intended permissions, such as viewing other people's records." },
      { q: "SQL injection belongs to which 2021 category?", options: ["A01 Broken Access Control", "A03 Injection", "A05 Security Misconfiguration", "A09 Logging Failures"], answer: 1, explain: "A03:2021 Injection covers SQL, OS command and similar attacks where untrusted input is treated as code." },
      { q: "What is the primary defence against SQL injection?", options: ["Hiding error messages only", "Parameterised queries (prepared statements)", "Longer passwords", "Blocking the word SELECT"], answer: 1, explain: "Parameterised queries keep data separate from the SQL command so input can never change the query's structure. Filters alone are easy to bypass." },
      { q: "What does cross-site scripting (XSS) let an attacker do?", options: ["Crash the database", "Run malicious script in a victim's browser in the site's context", "Read server source code directly", "Guess the admin password offline"], answer: 1, explain: "Injected script runs as if it came from the trusted site, so it can steal session data or act as the user. Output encoding and a Content Security Policy help prevent it." },
      { q: "Which control best defends against CSRF?", options: ["Anti-CSRF tokens and SameSite cookies", "Longer URLs", "Disabling JavaScript", "Using HTTP instead of HTTPS"], answer: 0, explain: "CSRF tricks a logged-in browser into sending an unwanted request. A secret per-request token or SameSite cookies ensure the request really came from your site." },
      { q: "Which is an example of Security Misconfiguration?", options: ["Default admin credentials left enabled", "Using parameterised queries", "Enforcing MFA", "Applying updates promptly"], answer: 0, explain: "Default accounts, open cloud storage, verbose error pages and unneeded services are classic misconfigurations. Hardening and regular scanning find them." },
    ],
  },
  {
    slug: "cryptography",
    title: "Cryptography",
    blurb: "Encryption, hashing, keys and certificates.",
    icon: "🔐",
    questions: [
      { q: "Which of these is a symmetric encryption algorithm?", options: ["RSA", "AES", "ECDSA", "Diffie-Hellman"], answer: 1, explain: "AES uses the same key to encrypt and decrypt. RSA and ECDSA are asymmetric; Diffie-Hellman is a key-exchange method." },
      { q: "What is the main property of a cryptographic hash function?", options: ["It can be reversed with the key", "It produces a fixed-size, one-way fingerprint of data", "It compresses files", "It generates random keys"], answer: 1, explain: "Hashes are one-way: the same input always gives the same output, but you cannot recover the input. They are used for integrity checks and password storage." },
      { q: "Which is the right way to store user passwords?", options: ["Plain text", "MD5", "A slow salted hash such as bcrypt or Argon2", "Base64 encoding"], answer: 2, explain: "Password hashes must be slow and salted so stolen databases are costly to crack. MD5 is fast and broken; Base64 is not encryption at all." },
      { q: "To send Alice a confidential message using public-key cryptography, which key do you use to encrypt it?", options: ["Your private key", "Alice's private key", "Alice's public key", "Your public key"], answer: 2, explain: "Anyone may encrypt with Alice's public key, but only her private key can decrypt. Signing works the opposite way." },
      { q: "What does TLS provide for a website connection?", options: ["Only compression", "Encryption in transit, server authentication and integrity", "Protection from SQL injection", "Anonymity"], answer: 1, explain: "TLS (the 'S' in HTTPS) encrypts traffic, proves the server's identity with a certificate and detects tampering. It does not fix flaws in the application itself." },
      { q: "What is a salt in password hashing?", options: ["A secret key stored in the browser", "A random value added before hashing so equal passwords get different hashes", "A way to speed up hashing", "An encryption algorithm"], answer: 1, explain: "A unique salt per user defeats precomputed rainbow tables and hides which users share a password." },
    ],
  },
  {
    slug: "penetration-testing",
    title: "Penetration Testing",
    blurb: "Tools, phases and reading scan results.",
    icon: "🧰",
    questions: [
      { q: "Which Nmap option detects service versions on open ports?", options: ["-sn", "-sV", "-Pn", "-oN"], answer: 1, explain: "`-sV` probes open ports to identify the service and version. `-sn` is host discovery only, `-Pn` skips discovery and `-oN` saves output." },
      { q: "Which tool is a well-known intercepting proxy for testing web apps?", options: ["Wireshark", "Burp Suite", "Hashcat", "Trivy"], answer: 1, explain: "Burp Suite sits between browser and server so you can inspect and modify requests. Wireshark captures packets at the network level instead." },
      { q: "Which phase normally comes LAST in a penetration test?", options: ["Reconnaissance", "Scanning and enumeration", "Exploitation", "Reporting"], answer: 3, explain: "After planning, recon, scanning and exploitation, the engagement ends with a written report and remediation advice." },
      { q: "A 'false positive' in vulnerability scanning means…", options: ["A real vulnerability was missed", "The scanner reported a vulnerability that is not actually present", "The scan was too slow", "The target was offline"], answer: 1, explain: "Scanner output is a lead, not proof. Findings must be verified before they are reported or fixed." },
      { q: "What does `nmap -sn 192.168.1.0/24` do?", options: ["Scans all 65,535 ports", "Discovers live hosts without port scanning", "Detects the operating system", "Runs vulnerability scripts"], answer: 1, explain: "`-sn` performs a ping sweep to list live hosts on the subnet — a common first step before deeper scanning." },
      { q: "A vulnerability with a CVSS base score of 9.5 is rated…", options: ["Low", "Medium", "High", "Critical"], answer: 3, explain: "CVSS v3 ranges: 0.1–3.9 Low, 4.0–6.9 Medium, 7.0–8.9 High, 9.0–10.0 Critical." },
    ],
  },
];

export const getQuizCategory = (slug: string) => QUIZ_CATEGORIES.find((c) => c.slug === slug);
