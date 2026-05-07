export type Role = "Super Admin" | "Admin" | "Team Lead" | "Security Analyst" | "Student/Trainee" | "Viewer";
export type TaskStatus = "Pending" | "In Progress" | "Under Review" | "Completed" | "Blocked";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Severity = "Info" | "Low" | "Medium" | "High" | "Critical";

export const users = [
  { id: "1", name: "Adaeze Okafor", email: "adaeze@kingsleyhub.io", role: "Super Admin" as Role, workId: "KH-0001", department: "Operations", status: "Active", lastLogin: "2026-05-07 09:12", riskScore: 8, completed: 42, assigned: 47 },
  { id: "2", name: "Marcus Lin", email: "marcus@kingsleyhub.io", role: "Admin" as Role, workId: "KH-0002", department: "SOC", status: "Active", lastLogin: "2026-05-07 08:40", riskScore: 12, completed: 31, assigned: 35 },
  { id: "3", name: "Priya Sharma", email: "priya@kingsleyhub.io", role: "Team Lead" as Role, workId: "KH-0003", department: "Red Team Lab", status: "Active", lastLogin: "2026-05-06 22:01", riskScore: 18, completed: 28, assigned: 30 },
  { id: "4", name: "Jonas Becker", email: "jonas@kingsleyhub.io", role: "Security Analyst" as Role, workId: "KH-0004", department: "Incident Response", status: "Active", lastLogin: "2026-05-07 07:55", riskScore: 22, completed: 19, assigned: 24 },
  { id: "5", name: "Fatima Al-Rashid", email: "fatima@kingsleyhub.io", role: "Security Analyst" as Role, workId: "KH-0005", department: "Compliance", status: "Active", lastLogin: "2026-05-07 06:30", riskScore: 9, completed: 22, assigned: 23 },
  { id: "6", name: "David Mensah", email: "david@kingsleyhub.io", role: "Student/Trainee" as Role, workId: "KH-0006", department: "CEH Lab", status: "Active", lastLogin: "2026-05-06 18:22", riskScore: 5, completed: 8, assigned: 12 },
  { id: "7", name: "Sofia Romano", email: "sofia@kingsleyhub.io", role: "Student/Trainee" as Role, workId: "KH-0007", department: "CEH Lab", status: "Inactive", lastLogin: "2026-04-29 14:10", riskScore: 4, completed: 6, assigned: 10 },
  { id: "8", name: "Hiroshi Tanaka", email: "hiroshi@kingsleyhub.io", role: "Viewer" as Role, workId: "KH-0008", department: "Audit", status: "Active", lastLogin: "2026-05-05 11:44", riskScore: 2, completed: 0, assigned: 0 },
];

export const tasks = [
  { id: "T-1001", title: "Quarterly vulnerability scan — internal subnet", category: "Vulnerability Assessment", assignee: "Jonas Becker", workId: "KH-0004", priority: "High" as Priority, status: "In Progress" as TaskStatus, deadline: "2026-05-12", progress: 65 },
  { id: "T-1002", title: "Review SIEM alert tuning rules", category: "Security Monitoring", assignee: "Marcus Lin", workId: "KH-0002", priority: "Medium" as Priority, status: "Under Review" as TaskStatus, deadline: "2026-05-10", progress: 80 },
  { id: "T-1003", title: "IR runbook update — phishing playbook", category: "Incident Response", assignee: "Adaeze Okafor", workId: "KH-0001", priority: "High" as Priority, status: "In Progress" as TaskStatus, deadline: "2026-05-15", progress: 40 },
  { id: "T-1004", title: "Patch management — May rollout", category: "Patch Management", assignee: "Fatima Al-Rashid", workId: "KH-0005", priority: "Critical" as Priority, status: "Pending" as TaskStatus, deadline: "2026-05-09", progress: 10 },
  { id: "T-1005", title: "CEH Lab — Module 3 enumeration practice", category: "CEH Practice Lab", assignee: "David Mensah", workId: "KH-0006", priority: "Low" as Priority, status: "In Progress" as TaskStatus, deadline: "2026-05-20", progress: 50 },
  { id: "T-1006", title: "Install & configure Wazuh agents (lab)", category: "Tool Installation", assignee: "Priya Sharma", workId: "KH-0003", priority: "Medium" as Priority, status: "Completed" as TaskStatus, deadline: "2026-05-04", progress: 100 },
  { id: "T-1007", title: "Compliance review — ISO 27001 A.12 controls", category: "Compliance Review", assignee: "Fatima Al-Rashid", workId: "KH-0005", priority: "High" as Priority, status: "In Progress" as TaskStatus, deadline: "2026-05-18", progress: 35 },
  { id: "T-1008", title: "Quarterly executive security report", category: "Report Writing", assignee: "Adaeze Okafor", workId: "KH-0001", priority: "Medium" as Priority, status: "Pending" as TaskStatus, deadline: "2026-05-25", progress: 0 },
  { id: "T-1009", title: "Web app DAST scan — staging only", category: "Web Security", assignee: "Jonas Becker", workId: "KH-0004", priority: "High" as Priority, status: "Blocked" as TaskStatus, deadline: "2026-05-11", progress: 25 },
  { id: "T-1010", title: "Cloud IAM review — AWS Org accounts", category: "Cloud Security", assignee: "Marcus Lin", workId: "KH-0002", priority: "Critical" as Priority, status: "In Progress" as TaskStatus, deadline: "2026-05-13", progress: 55 },
  { id: "T-1011", title: "Endpoint EDR coverage gap audit", category: "Endpoint Security", assignee: "Priya Sharma", workId: "KH-0003", priority: "Medium" as Priority, status: "Completed" as TaskStatus, deadline: "2026-05-02", progress: 100 },
  { id: "T-1012", title: "Test backup verification script (lab)", category: "Script Testing", assignee: "David Mensah", workId: "KH-0006", priority: "Low" as Priority, status: "Under Review" as TaskStatus, deadline: "2026-05-16", progress: 70 },
];

export const tools = [
  { id: "TL-01", name: "Nmap", category: "Network Security", os: "Linux/Win/macOS", version: "7.95", risk: "Low", status: "Installed", approval: "Approved", purpose: "Authorized network discovery & port scanning" },
  { id: "TL-02", name: "Wireshark", category: "Network Security", os: "Linux/Win/macOS", version: "4.4.2", risk: "Low", status: "Installed", approval: "Approved", purpose: "Packet capture for authorized traffic analysis" },
  { id: "TL-03", name: "OpenVAS / GVM", category: "Vulnerability Assessment", os: "Linux", version: "23.10", risk: "Medium", status: "Installed", approval: "Approved", purpose: "Internal vulnerability scanning" },
  { id: "TL-04", name: "OWASP ZAP", category: "Web Application Security", os: "Cross-platform", version: "2.16", risk: "Medium", status: "Installed", approval: "Approved", purpose: "DAST in approved staging environments" },
  { id: "TL-05", name: "Autopsy", category: "Digital Forensics", os: "Linux/Win", version: "4.21", risk: "Low", status: "Installed", approval: "Approved", purpose: "Forensic disk image analysis" },
  { id: "TL-06", name: "Cuckoo Sandbox", category: "Malware Analysis Lab", os: "Linux", version: "2.0.7", risk: "High", status: "Lab Only", approval: "Approved", purpose: "Isolated malware behavior analysis" },
  { id: "TL-07", name: "Wazuh", category: "SIEM & Monitoring", os: "Linux", version: "4.9", risk: "Low", status: "Installed", approval: "Approved", purpose: "Host-based intrusion detection & SIEM" },
  { id: "TL-08", name: "Hashcat", category: "Password Security Auditing", os: "Cross-platform", version: "6.2.6", risk: "High", status: "Lab Only", approval: "Restricted", purpose: "Authorized password strength auditing" },
  { id: "TL-09", name: "Prowler", category: "Cloud Security", os: "Linux/macOS", version: "4.5", risk: "Low", status: "Installed", approval: "Approved", purpose: "Cloud configuration assessment" },
  { id: "TL-10", name: "Velociraptor", category: "Endpoint Security", os: "Cross-platform", version: "0.74", risk: "Low", status: "Installed", approval: "Approved", purpose: "Endpoint visibility and DFIR" },
];

export const scripts = [
  { id: "S-01", name: "log_anomaly_check.py", lang: "Python", category: "Log Analysis", author: "Marcus Lin", version: "1.4", status: "Approved", env: "Production", updated: "2026-04-28" },
  { id: "S-02", name: "ssh_hardening_audit.sh", lang: "Bash", category: "System Hardening", author: "Priya Sharma", version: "2.0", status: "Approved", env: "Production", updated: "2026-05-01" },
  { id: "S-03", name: "backup_verify.ps1", lang: "PowerShell", category: "Backup Verification", author: "Fatima Al-Rashid", version: "1.1", status: "Pending Review", env: "Staging", updated: "2026-05-05" },
  { id: "S-04", name: "asset_inventory.py", lang: "Python", category: "Network Inventory", author: "Jonas Becker", version: "0.9", status: "Draft", env: "Lab", updated: "2026-05-06" },
  { id: "S-05", name: "compliance_iso_check.py", lang: "Python", category: "Compliance Checks", author: "Fatima Al-Rashid", version: "1.2", status: "Approved", env: "Production", updated: "2026-04-20" },
  { id: "S-06", name: "soc_daily_report.py", lang: "Python", category: "Reporting", author: "Adaeze Okafor", version: "3.0", status: "Approved", env: "Production", updated: "2026-05-03" },
  { id: "S-07", name: "lab_enum_practice.sh", lang: "Bash", category: "Lab Practice", author: "David Mensah", version: "0.3", status: "Pending Review", env: "Lab", updated: "2026-05-06" },
  { id: "S-08", name: "siem_alert_correlator.py", lang: "Python", category: "Security Monitoring", author: "Marcus Lin", version: "2.1", status: "Approved", env: "Production", updated: "2026-04-30" },
];

export const cehTopics = [
  { id: "C-01", title: "Information Security Fundamentals", progress: 100, lessons: 12, completed: 12 },
  { id: "C-02", title: "Footprinting & Reconnaissance Concepts", progress: 80, lessons: 10, completed: 8 },
  { id: "C-03", title: "Scanning & Enumeration Concepts", progress: 60, lessons: 14, completed: 8 },
  { id: "C-04", title: "Vulnerability Analysis", progress: 45, lessons: 10, completed: 4 },
  { id: "C-05", title: "Web Application Security", progress: 25, lessons: 16, completed: 4 },
  { id: "C-06", title: "Cryptography", progress: 10, lessons: 8, completed: 1 },
];

export const auditLogs = [
  { ts: "2026-05-07 09:12:04", user: "Adaeze Okafor", event: "User Login", severity: "Info" as Severity, detail: "Successful login from 41.x.x.12" },
  { ts: "2026-05-07 09:08:51", user: "Marcus Lin", event: "Task Updated", severity: "Low" as Severity, detail: "T-1002 status → Under Review" },
  { ts: "2026-05-07 08:55:10", user: "system", event: "Failed Login", severity: "Medium" as Severity, detail: "3 failed attempts for hiroshi@…" },
  { ts: "2026-05-07 08:40:22", user: "Marcus Lin", event: "User Login", severity: "Info" as Severity, detail: "Successful login" },
  { ts: "2026-05-07 08:21:00", user: "Adaeze Okafor", event: "Role Changed", severity: "High" as Severity, detail: "Sofia Romano → Student/Trainee" },
  { ts: "2026-05-07 07:55:33", user: "Jonas Becker", event: "Tool Added", severity: "Low" as Severity, detail: "Added Velociraptor v0.74" },
  { ts: "2026-05-07 07:30:00", user: "Fatima Al-Rashid", event: "Script Approved", severity: "Low" as Severity, detail: "compliance_iso_check.py v1.2" },
  { ts: "2026-05-06 22:14:09", user: "Priya Sharma", event: "Task Created", severity: "Info" as Severity, detail: "T-1011 assigned to KH-0003" },
  { ts: "2026-05-06 21:02:18", user: "system", event: "Security Alert", severity: "Critical" as Severity, detail: "Anomalous outbound traffic — quarantined" },
  { ts: "2026-05-06 19:45:00", user: "David Mensah", event: "Script Uploaded", severity: "Low" as Severity, detail: "lab_enum_practice.sh draft" },
  { ts: "2026-05-06 18:11:00", user: "Hiroshi Tanaka", event: "User Logout", severity: "Info" as Severity, detail: "Session ended" },
  { ts: "2026-05-06 17:00:01", user: "Adaeze Okafor", event: "Work ID Changed", severity: "High" as Severity, detail: "KH-0007 reassigned" },
  { ts: "2026-05-06 16:22:40", user: "Marcus Lin", event: "Tool Updated", severity: "Low" as Severity, detail: "Wazuh → 4.9" },
  { ts: "2026-05-06 14:55:11", user: "system", event: "Security Alert", severity: "High" as Severity, detail: "EDR detection on KH-WS-22" },
  { ts: "2026-05-06 09:00:00", user: "Adaeze Okafor", event: "Admin Action", severity: "Medium" as Severity, detail: "Updated audit retention policy" },
];

export const notifications = [
  { id: "N1", title: "New task assigned", body: "T-1004 — Patch management May rollout (Critical)", time: "2m ago", type: "task" },
  { id: "N2", title: "Deadline approaching", body: "T-1009 due in 4 days", time: "1h ago", type: "deadline" },
  { id: "N3", title: "Script pending review", body: "lab_enum_practice.sh by David Mensah", time: "3h ago", type: "review" },
  { id: "N4", title: "Tool pending approval", body: "Burp Suite Community — requested by Priya", time: "5h ago", type: "tool" },
  { id: "N5", title: "Task completed", body: "T-1011 EDR coverage gap audit", time: "Yesterday", type: "task" },
  { id: "N6", title: "Security alert", body: "Anomalous outbound traffic — quarantined", time: "Yesterday", type: "alert" },
  { id: "N7", title: "Account update", body: "Sofia Romano marked inactive", time: "2d ago", type: "user" },
  { id: "N8", title: "Admin announcement", body: "Maintenance window Sat 23:00 UTC", time: "3d ago", type: "system" },
];

export const reports = [
  { id: "R-01", name: "May Task Completion Report", type: "Task Completion", generated: "2026-05-06", owner: "Adaeze Okafor" },
  { id: "R-02", name: "Q2 User Performance", type: "User Performance", generated: "2026-05-05", owner: "Marcus Lin" },
  { id: "R-03", name: "Tool Inventory Snapshot", type: "Tool Inventory", generated: "2026-05-04", owner: "Priya Sharma" },
  { id: "R-04", name: "Script Approval Pipeline", type: "Script Approval", generated: "2026-05-03", owner: "Fatima Al-Rashid" },
  { id: "R-05", name: "CEH Lab Progress — May", type: "CEH Progress", generated: "2026-05-02", owner: "David Mensah" },
];

export const taskTrend = [
  { day: "Mon", completed: 6, created: 8 },
  { day: "Tue", completed: 9, created: 7 },
  { day: "Wed", completed: 7, created: 10 },
  { day: "Thu", completed: 12, created: 9 },
  { day: "Fri", completed: 10, created: 11 },
  { day: "Sat", completed: 4, created: 3 },
  { day: "Sun", completed: 3, created: 2 },
];

export const productivity = [
  { name: "Adaeze", score: 92 },
  { name: "Marcus", score: 88 },
  { name: "Priya", score: 85 },
  { name: "Jonas", score: 79 },
  { name: "Fatima", score: 90 },
  { name: "David", score: 67 },
];
