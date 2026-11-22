export type GlossaryLevel = "Beginner" | "Intermediate" | "Advanced";
export interface GlossaryTerm {
  term: string;
  category: string;
  level: GlossaryLevel;
  definition: string;
  example: string;
}

// [term, category, level, definition, example]
type Row = [string, string, GlossaryLevel, string, string];
const B = "Beginner", I = "Intermediate", A = "Advanced";

const rows: Row[] = [
  // Fundamentals
  ["CIA Triad", "Fundamentals", B, "The three core goals of security: Confidentiality, Integrity and Availability.", "Encrypting a database protects confidentiality; regular backups protect availability."],
  ["Vulnerability", "Fundamentals", B, "A weakness in software, hardware or process that could be exploited.", "A web server running an outdated version with a known flaw."],
  ["Threat", "Fundamentals", B, "Anything that could cause harm by exploiting a vulnerability.", "A ransomware group scanning the internet for unpatched servers."],
  ["Risk", "Fundamentals", B, "The chance that a threat exploits a vulnerability, combined with the impact if it does.", "An internet-facing server with a critical flaw and customer data is high risk."],
  ["Exploit", "Fundamentals", I, "A piece of code or technique that takes advantage of a vulnerability.", "A script that abuses a buffer overflow to run attacker-chosen code."],
  ["CVE", "Fundamentals", B, "A public ID (Common Vulnerabilities and Exposures) for a specific known vulnerability.", "CVE-2021-44228 is the identifier for Log4Shell."],
  ["CVSS", "Fundamentals", I, "The Common Vulnerability Scoring System: a 0–10 score for how severe a vulnerability is.", "A score of 9.8 is Critical and should be patched urgently."],
  ["Zero-day", "Fundamentals", I, "A vulnerability exploited before the vendor has released a fix.", "Attackers use an unknown browser flaw before any patch exists."],
  ["Patch Management", "Fundamentals", B, "The process of finding, testing and applying software updates that fix vulnerabilities.", "Rolling out monthly operating-system security updates to every laptop."],
  ["Least Privilege", "Fundamentals", B, "Giving users and systems only the minimum access they need.", "An intern's account can read documents but cannot change firewall rules."],
  ["Defense in Depth", "Fundamentals", I, "Using several layers of controls so one failure does not mean total compromise.", "Firewall + MFA + endpoint protection + backups together."],
  ["Attack Surface", "Fundamentals", I, "The total set of points where an attacker could try to get in.", "Every open port, web form, API and employee email address."],
  // Networking
  ["IP Address", "Networking", B, "A number that identifies a device on a network.", "192.168.1.10 is a typical private address on a home network."],
  ["DNS", "Networking", B, "The Domain Name System, which translates names like example.com into IP addresses.", "Your browser asks DNS for the address of a site before connecting."],
  ["Port", "Networking", B, "A numbered 'door' on a device where a specific service listens.", "Port 443 is used by HTTPS; port 22 by SSH."],
  ["Firewall", "Networking", B, "A gatekeeper that allows or blocks network traffic based on rules.", "Blocking all inbound traffic except web ports 80 and 443."],
  ["VPN", "Networking", B, "A Virtual Private Network that encrypts traffic between you and another network.", "Employees connect to the office network securely from home."],
  ["Proxy", "Networking", I, "A server that sits between a client and the internet and forwards requests.", "A company web proxy that filters and logs outgoing browsing."],
  ["IDS / IPS", "Networking", I, "Intrusion Detection (alerts) and Prevention (blocks) Systems that watch traffic for attacks.", "An IPS drops packets that match a known exploit pattern."],
  ["Network Segmentation", "Networking", I, "Splitting a network into isolated zones to limit an attacker's movement.", "Putting guest Wi-Fi on a separate VLAN from internal servers."],
  ["DDoS", "Networking", I, "A Distributed Denial-of-Service attack that floods a service so real users cannot reach it.", "Thousands of hijacked devices overwhelm a website with requests."],
  ["Man-in-the-Middle (MitM)", "Networking", I, "An attacker secretly relays or alters communication between two parties.", "Someone on public Wi-Fi intercepting unencrypted traffic."],
  ["ARP Spoofing", "Networking", A, "Sending forged ARP replies so traffic is redirected through the attacker's machine on a local network.", "An attacker pretends to be the router to capture a victim's traffic."],
  // Web security
  ["SQL Injection", "Web Security", I, "Inserting malicious input into a database query so it is run as SQL code.", "Entering ' OR '1'='1 into a login box on a vulnerable site. Fix: parameterised queries."],
  ["XSS", "Web Security", I, "Cross-Site Scripting: injecting script that runs in other users' browsers.", "A comment containing a script that steals visitors' session cookies."],
  ["CSRF", "Web Security", I, "Cross-Site Request Forgery: tricking a logged-in user's browser into sending an unwanted request.", "A hidden form on another site that transfers money from your bank session."],
  ["SSRF", "Web Security", A, "Server-Side Request Forgery: making a server send requests to internal or unintended targets.", "Abusing an image-fetch feature to reach a cloud metadata service."],
  ["IDOR", "Web Security", I, "Insecure Direct Object Reference: accessing other users' data by changing an ID in a request.", "Changing /invoice/1001 to /invoice/1002 and seeing someone else's invoice."],
  ["WAF", "Web Security", I, "A Web Application Firewall that filters malicious HTTP traffic before it reaches an app.", "Blocking requests that contain known SQL-injection patterns."],
  ["OWASP Top 10", "Web Security", B, "A regularly updated list of the ten most critical web application security risks.", "Broken Access Control is ranked first in the 2021 list."],
  ["Authentication vs Authorization", "Web Security", B, "Authentication proves who you are; authorization decides what you may do.", "Logging in is authentication; being blocked from the admin page is authorization."],
  ["Session Hijacking", "Web Security", I, "Stealing or guessing a session token to impersonate a logged-in user.", "Using a stolen cookie to take over someone's account."],
  // Cryptography
  ["Encryption", "Cryptography", B, "Scrambling data with a key so only authorised parties can read it.", "HTTPS encrypts the data between your browser and a website."],
  ["Hash", "Cryptography", B, "A one-way function that turns data into a fixed-size fingerprint.", "SHA-256 of a file lets you check it was not modified."],
  ["Salt", "Cryptography", I, "A random value added to a password before hashing so identical passwords differ.", "Two users with the same password get different stored hashes."],
  ["Symmetric Encryption", "Cryptography", I, "Encryption where the same key encrypts and decrypts.", "AES encrypting a disk with one secret key."],
  ["Asymmetric Encryption", "Cryptography", I, "Encryption using a public key to encrypt and a private key to decrypt.", "RSA lets anyone encrypt for you using your public key."],
  ["Digital Signature", "Cryptography", I, "A value created with a private key that proves who signed data and that it was not altered.", "A software update signed by the vendor so your OS can verify it."],
  ["TLS", "Cryptography", B, "Transport Layer Security, the protocol that secures HTTPS connections.", "The padlock in your browser's address bar."],
  ["PKI / Certificate", "Cryptography", I, "Public Key Infrastructure: certificates issued by trusted authorities that bind a key to an identity.", "A certificate proves a site really belongs to example.com."],
  ["MFA", "Cryptography", B, "Multi-Factor Authentication: requiring two or more proofs of identity.", "A password plus a code from an authenticator app."],
  // Threats & malware
  ["Phishing", "Threats & Malware", B, "Tricking someone into giving up information or access by pretending to be trustworthy.", "An email posing as your bank asking you to 'verify' your login."],
  ["Social Engineering", "Threats & Malware", B, "Manipulating people, rather than machines, to gain access or information.", "A caller pretending to be IT support asking for your password."],
  ["Malware", "Threats & Malware", B, "Software designed to harm, spy on or take control of a system.", "Viruses, trojans, spyware and ransomware are all malware."],
  ["Ransomware", "Threats & Malware", B, "Malware that encrypts files and demands payment to restore them.", "A hospital's records are locked until a ransom is paid. Offline backups are the best defence."],
  ["Botnet", "Threats & Malware", I, "A network of infected devices controlled remotely by an attacker.", "Thousands of compromised cameras used to launch a DDoS attack."],
  ["Credential Stuffing", "Threats & Malware", I, "Trying username/password pairs leaked from one breach on other sites.", "Reusing the same password on two sites lets attackers log in to both."],
  ["Brute Force", "Threats & Malware", B, "Trying many password or key guesses until one works.", "Guessing PINs one by one. Rate limiting and lockouts slow it down."],
  ["Privilege Escalation", "Threats & Malware", I, "Gaining higher access than originally granted.", "A normal user exploiting a flaw to become administrator."],
  ["Lateral Movement", "Threats & Malware", A, "Moving from one compromised system to others inside a network.", "Using a stolen admin credential to reach the file server."],
  ["Command & Control (C2)", "Threats & Malware", A, "Infrastructure attackers use to send instructions to compromised machines.", "Malware that checks in with a remote server every few minutes."],
  ["Supply Chain Attack", "Threats & Malware", A, "Compromising a trusted vendor or dependency to reach its customers.", "A poisoned software update delivered to thousands of companies."],
  ["APT", "Threats & Malware", A, "Advanced Persistent Threat: a skilled, well-resourced group that stays hidden in a network for a long time.", "A state-linked group quietly collecting data for months."],
  // Defense & operations
  ["SIEM", "Defense & Operations", I, "Security Information and Event Management: collects and analyses logs from across an organisation.", "Alerting when one account fails login 50 times from a new country."],
  ["SOC", "Defense & Operations", B, "A Security Operations Center: the team that monitors and responds to threats.", "Analysts triaging alerts around the clock."],
  ["EDR", "Defense & Operations", I, "Endpoint Detection and Response: tools that monitor laptops and servers for suspicious behaviour.", "Isolating a laptop automatically when it starts encrypting files."],
  ["Incident Response", "Defense & Operations", I, "The structured process of detecting, containing, removing and recovering from an attack.", "Disconnect the infected host, preserve evidence, remove malware, restore."],
  ["Threat Hunting", "Defense & Operations", A, "Proactively searching for attackers who evaded automated detection.", "Searching logs for unusual PowerShell activity at 3 a.m."],
  ["Indicator of Compromise (IOC)", "Defense & Operations", I, "A clue, such as a file hash or IP, that suggests a system has been breached.", "A known malicious domain appearing in DNS logs."],
  ["MITRE ATT&CK", "Defense & Operations", I, "A public knowledge base of real-world attacker tactics and techniques.", "Mapping a detection rule to technique T1059 (command-line interpreter)."],
  ["Zero Trust", "Defense & Operations", I, "A model that trusts no user or device by default and verifies every request.", "Requiring MFA and a healthy device even on the office network."],
  ["Penetration Test", "Defense & Operations", B, "An authorised, simulated attack used to find weaknesses before real attackers do.", "A hired team tests a company's web app and reports findings."],
  ["Red Team / Blue Team", "Defense & Operations", I, "Red team simulates attackers; blue team defends and detects.", "Blue team catches the red team's phishing email in the SIEM."],
  ["Honeypot", "Defense & Operations", I, "A decoy system designed to attract and study attackers.", "A fake server that alerts when anyone logs in to it."],
  ["Sandbox", "Defense & Operations", I, "An isolated environment for safely running untrusted code.", "Opening a suspicious attachment inside a disposable virtual machine."],
  // Cloud & DevSecOps
  ["IAM", "Cloud & DevSecOps", I, "Identity and Access Management: controlling who can do what in a system or cloud account.", "A role that can read one storage bucket but not delete it."],
  ["Shared Responsibility Model", "Cloud & DevSecOps", I, "The split between what the cloud provider secures and what the customer must secure.", "The provider secures the data centre; you secure your configuration and data."],
  ["SAST / DAST", "Cloud & DevSecOps", I, "Static (reads code) and Dynamic (tests running app) security testing.", "SAST flags a hard-coded password; DAST finds an XSS flaw in a running site."],
  ["Secrets Management", "Cloud & DevSecOps", I, "Storing and controlling access to passwords, API keys and tokens safely.", "Using a vault instead of committing keys to Git."],
  ["Container Security", "Cloud & DevSecOps", I, "Protecting container images and the platforms that run them.", "Scanning images for known vulnerabilities before deploying."],
  ["Infrastructure as Code (IaC)", "Cloud & DevSecOps", A, "Defining infrastructure in version-controlled files, which can be scanned for misconfigurations.", "A Terraform file that accidentally makes a storage bucket public."],
];

export const GLOSSARY: GlossaryTerm[] = rows
  .map(([term, category, level, definition, example]) => ({ term, category, level, definition, example }))
  .sort((a, b) => a.term.localeCompare(b.term));

export const GLOSSARY_CATEGORIES = Array.from(new Set(GLOSSARY.map((t) => t.category))).sort();
