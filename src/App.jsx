import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SECURITY CONFIG — CHANGE THIS PASSWORD BEFORE DEPLOYING!
// ══════════════════════════════════════════════════════════════════════
const ADMIN_PASSWORD = "	";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_HOURS = 8;

// ── DEFAULT CONTENT DATA ──────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: "databases",  label: "Databases",           icon: "🗄️", color: "#2563EB", lightColor: "#EFF6FF" },
  { id: "automation", label: "Automation",           icon: "⚙️", color: "#7C3AED", lightColor: "#F5F3FF" },
  { id: "cloud",      label: "Cloud Infrastructure", icon: "☁️", color: "#0891B2", lightColor: "#ECFEFF" },
];

const DEFAULT_TOPICS = [
  { id: "oracle", category: "databases", title: "Oracle Database", icon: "🔴", tagline: "Enterprise RDBMS", color: "#C74634", lightColor: "#FEF2F0",
    description: "Oracle Database is the world's leading enterprise RDBMS, trusted by Fortune 500 companies for mission-critical workloads.",
    pages: [
      { id: "oracle-intro", title: "Introduction to Oracle DB", lastUpdated: "2025-01-01",
        content: "Oracle Database is an object-relational database management system (ORDBMS) produced by Oracle Corporation.\n\n**Key Concepts:**\n- Instances and Databases\n- Oracle Memory Architecture (SGA, PGA)\n- Background Processes (SMON, PMON, DBWn, LGWR, CKPT)\n- Physical & Logical Storage Structures\n\n**When to use Oracle:**\nOracle excels in high-transaction, high-availability enterprise environments." },
      { id: "oracle-sql", title: "SQL & PL/SQL Fundamentals", lastUpdated: "2025-01-01",
        content: "PL/SQL is Oracle's procedural extension to SQL.\n\n**PL/SQL Block Structure:**\n```sql\nDECLARE\n  v_name VARCHAR2(50);\nBEGIN\n  SELECT first_name INTO v_name FROM employees WHERE id = 1;\n  DBMS_OUTPUT.PUT_LINE('Name: ' || v_name);\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN\n    DBMS_OUTPUT.PUT_LINE('Not found');\nEND;\n```\n\n**Key PL/SQL Features:**\n- Cursors (Implicit & Explicit)\n- Collections (VARRAY, Nested Tables)\n- Packages and Package Bodies\n- Exception Handling\n- Bulk Operations (FORALL, BULK COLLECT)" },
      { id: "oracle-oem24ai", title: "OEM 24ai — Key Features", lastUpdated: "2026-01-01",
        content: "## OEM 24ai — Key Features\n\nOEM 24ai introduces AI-driven insights, improved automation, and enhanced security features for enterprise database management.\n\n---\n\n## AI & Automation Features\n\n**AI-Based Insights:**\n- AI-Based Anomaly Detection — detects performance issues before they impact operations\n- Automated Patching & Upgrades — smart automation reduces downtime\n- Automated Performance Tuning — AI-based recommendations for database efficiency\n\n## Management & Monitoring\n\n- Centralized monitoring and administration for your entire IT infrastructure\n- Lifecycle management for databases, middleware, and engineered systems (Exadata, ZDLRA)\n- Multi-Cloud and Hybrid Database support — manages on-premise and OCI cloud targets\n- Java Virtual Machine Diagnostics (JVMD) Engine for diagnosing performance problems in Java applications in production\n\n---\n\n## Infrastructure Components Installed\n\n- Oracle WebLogic Server 12c Release 2 (12.2.1.4.0)\n- Oracle JRF 12c Release 2\n- JDK `1.8.0_431`\n- WebLogic container, Zero Downtime (ZDT) container\n- API Gateway\n\n---\n\n## Security & Compliance\n\n**Enhanced Tools:**\n- Enhanced Security & Compliance Tools\n- Custom Certificate management during upgrades\n- Role-based access control via WebLogic domain (GCDomain) Plug-in" },
    ]},
  { id: "postgresql", category: "databases", title: "PostgreSQL", icon: "🐘", tagline: "Advanced Open Source RDBMS", color: "#336791", lightColor: "#EFF6FF",
    description: "PostgreSQL is the world's most advanced open-source relational database, known for reliability and extensibility.",
    pages: [
      { id: "pg-intro", title: "Getting Started with PostgreSQL", lastUpdated: "2025-01-01",
        content: "PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development.\n\n**Key Features:**\n- Full ACID compliance\n- Advanced JSON/JSONB support\n- Powerful indexing (B-tree, GiST, GIN, BRIN)\n- Table partitioning\n- Row-level security\n\n**Installation:**\n```bash\nsudo apt install postgresql postgresql-contrib\nsudo systemctl start postgresql\npsql -U postgres\n```" },
      { id: "pg-json", title: "JSON & JSONB Operations", lastUpdated: "2025-01-01",
        content: "PostgreSQL offers unmatched JSON support.\n\n**JSON vs JSONB:**\n- JSON: Stored as plain text\n- JSONB: Binary format, faster queries, supports indexing\n\n**Common Operators:**\n```sql\n-- Access JSON field\nSELECT data->>'name' FROM products;\n\n-- Check containment\nSELECT * FROM products WHERE data @> '{\"active\": true}';\n\n-- GIN index\nCREATE INDEX idx_gin ON products USING GIN(data);\n```" },
    ]},
  { id: "mysql", category: "databases", title: "MySQL", icon: "🐬", tagline: "World's Most Popular Open Source DB", color: "#F29111", lightColor: "#FFFBEB",
    description: "MySQL is the most widely-used open-source relational database, powering countless web applications.",
    pages: [
      { id: "mysql-intro", title: "MySQL Essentials", lastUpdated: "2025-01-01",
        content: "MySQL is an open-source RDBMS — the 'M' in the LAMP stack.\n\n**Storage Engines:**\n- InnoDB (default): ACID, foreign keys, row-level locking\n- MyISAM: Faster reads, no transactions\n- Memory: Stored in RAM, volatile\n\n**Key Commands:**\n```sql\nCREATE DATABASE myapp CHARACTER SET utf8mb4;\nSHOW ENGINE INNODB STATUS;\nSHOW VARIABLES LIKE 'slow_query_log';\n```" },
    ]},
  { id: "mongodb", category: "databases", title: "MongoDB", icon: "🍃", tagline: "Leading NoSQL Document Database", color: "#4CAF50", lightColor: "#F0FDF4",
    description: "MongoDB is the most popular NoSQL database, storing data in flexible JSON-like BSON documents.",
    pages: [
      { id: "mongo-intro", title: "MongoDB Fundamentals", lastUpdated: "2025-01-01",
        content: "MongoDB stores data in BSON format within collections.\n\n**Core Concepts:**\n- Database → Collection → Document\n- Dynamic schema\n- Horizontal scaling via sharding\n- Replica sets for high availability\n\n**Basic Operations:**\n```javascript\n// Insert\ndb.users.insertOne({ name: 'Alice', age: 30 });\n\n// Query\ndb.users.find({ age: { $gte: 25 } });\n\n// Aggregation\ndb.orders.aggregate([\n  { $match: { status: 'shipped' } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' } } }\n]);\n```" },
    ]},
  { id: "sqlserver", category: "databases", title: "SQL Server", icon: "🪟", tagline: "Microsoft's Enterprise RDBMS", color: "#CC2927", lightColor: "#FEF2F2",
    description: "Microsoft SQL Server with deep Azure integration, advanced analytics, and robust HA/DR capabilities.",
    pages: [
      { id: "mssql-intro", title: "SQL Server Overview", lastUpdated: "2025-01-01",
        content: "SQL Server is Microsoft's flagship RDBMS with deep Azure integration.\n\n**Key Editions:**\n- Enterprise: Full features\n- Standard: Core DB capabilities\n- Developer: Free for dev/test\n- Express: Free, 10GB limit\n\n**T-SQL Essentials:**\n```sql\nWITH SalesCTE AS (\n  SELECT EmployeeID, SUM(Amount) AS Total\n  FROM Sales GROUP BY EmployeeID\n)\nSELECT e.Name, c.Total\nFROM Employees e JOIN SalesCTE c ON e.ID = c.EmployeeID;\n```" },
    ]},
  { id: "ansible", category: "automation", title: "Ansible", icon: "🤖", tagline: "IT Automation & Config Management", color: "#EE0000", lightColor: "#FFF1F1",
    description: "Ansible is an open-source automation tool for configuration management and application deployment using YAML playbooks.",
    pages: [
      { id: "ansible-intro", title: "Ansible Basics", lastUpdated: "2025-01-01",
        content: "Ansible is agentless — connects via SSH to managed nodes.\n\n**Core Concepts:**\n- Inventory: List of managed hosts\n- Playbook: YAML file of tasks\n- Module: Unit of work (apt, copy, service)\n- Role: Reusable collection of tasks\n\n**Sample Playbook:**\n```yaml\n---\n- name: Configure web server\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Install Apache\n      apt:\n        name: apache2\n        state: present\n    - name: Start Apache\n      service:\n        name: apache2\n        state: started\n```" },
    ]},
  { id: "terraform", category: "automation", title: "Terraform", icon: "🏗️", tagline: "Infrastructure as Code", color: "#7B42BC", lightColor: "#F5F3FF",
    description: "Terraform lets you define cloud and on-prem infrastructure in HCL configuration files for versioned, repeatable deployments.",
    pages: [
      { id: "tf-intro", title: "Terraform Getting Started", lastUpdated: "2025-01-01",
        content: "Terraform uses HCL to define infrastructure declaratively.\n\n**Core Workflow:**\n```bash\nterraform init    # Download providers\nterraform plan    # Preview changes\nterraform apply   # Apply changes\nterraform destroy # Tear down\n```\n\n**Example — AWS EC2:**\n```hcl\nprovider \"aws\" { region = \"us-east-1\" }\n\nresource \"aws_instance\" \"web\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t3.micro\"\n  tags = { Name = \"WebServer\" }\n}\n```" },
    ]},
  { id: "cicd", category: "automation", title: "CI/CD Pipelines", icon: "🔄", tagline: "Continuous Integration & Delivery", color: "#0EA5E9", lightColor: "#F0F9FF",
    description: "Build robust CI/CD pipelines using Jenkins, GitHub Actions, and GitLab CI to automate testing and deployments.",
    pages: [
      { id: "cicd-intro", title: "CI/CD Fundamentals", lastUpdated: "2025-01-01",
        content: "CI/CD automates the software delivery pipeline.\n\n**CI/CD Stages:**\n- Source: Code commit triggers pipeline\n- Build: Compile/package application\n- Test: Unit, integration, security tests\n- Stage: Deploy to staging\n- Deploy: Release to production\n\n**GitHub Actions:**\n```yaml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n```" },
    ]},
  { id: "aws", category: "cloud", title: "Amazon Web Services", icon: "🟠", tagline: "Market-Leading Cloud Platform", color: "#FF9900", lightColor: "#FFFBEB",
    description: "AWS is the world's most comprehensive cloud platform, offering 200+ services for compute, storage, databases, networking, and AI/ML.",
    pages: [
      { id: "aws-intro", title: "AWS Core Services", lastUpdated: "2025-01-01",
        content: "AWS launched in 2006 and holds the largest cloud market share.\n\n**Essential Services:**\n- EC2: Virtual servers\n- S3: Object storage (11 nines durability)\n- RDS: Managed relational databases\n- Lambda: Serverless compute\n- VPC: Isolated virtual network\n- IAM: Identity & access management\n- EKS: Managed Kubernetes\n\n**AWS CLI:**\n```bash\naws configure\naws s3 ls\naws ec2 describe-instances\n```" },
    ]},
  { id: "azure", category: "cloud", title: "Microsoft Azure", icon: "🔵", tagline: "Enterprise Cloud from Microsoft", color: "#0078D4", lightColor: "#EFF6FF",
    description: "Azure is Microsoft's cloud platform, deeply integrated with Microsoft products and ideal for enterprise workloads.",
    pages: [
      { id: "azure-intro", title: "Azure Fundamentals", lastUpdated: "2025-01-01",
        content: "Microsoft Azure provides 200+ cloud services.\n\n**Core Services:**\n- Azure VMs: IaaS compute\n- Blob Storage: Object storage\n- Azure SQL: Managed SQL\n- Azure Functions: Serverless\n- Azure AD: Identity & access\n- AKS: Managed Kubernetes\n\n**Azure CLI:**\n```bash\naz login\naz group create --name MyRG --location eastus\naz storage account create --name mystorage --resource-group MyRG\n```" },
    ]},
  { id: "kubernetes", category: "cloud", title: "Kubernetes", icon: "⚓", tagline: "Container Orchestration Platform", color: "#326CE5", lightColor: "#EFF6FF",
    description: "Kubernetes (K8s) is the de facto standard for container orchestration, automating deployment, scaling, and management of containers.",
    pages: [
      { id: "k8s-intro", title: "Kubernetes Architecture", lastUpdated: "2025-01-01",
        content: "Kubernetes clusters have a control plane and worker nodes.\n\n**Key Objects:**\n- Pod: Smallest deployable unit\n- Deployment: Manages replica sets\n- Service: Stable network endpoint\n- ConfigMap/Secret: Configuration\n- PersistentVolume: Storage\n\n**kubectl Commands:**\n```bash\nkubectl cluster-info\nkubectl create deployment nginx --image=nginx\nkubectl expose deployment nginx --port=80 --type=LoadBalancer\nkubectl scale deployment nginx --replicas=3\nkubectl get pods -o wide\nkubectl logs -f pod-name\n```" },
    ]},
];

// ── SECURITY HELPERS ──────────────────────────────────────────────────
function getSecurityState() {
  try {
    const raw = sessionStorage.getItem("__sec__");
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null, loggedIn: false, loginTime: null };
  } catch { return { attempts: 0, lockedUntil: null, loggedIn: false, loginTime: null }; }
}
function setSecurityState(s) {
  try { sessionStorage.setItem("__sec__", JSON.stringify(s)); } catch {}
}
function isSessionValid(s) {
  if (!s.loggedIn || !s.loginTime) return false;
  const elapsed = (Date.now() - s.loginTime) / 1000 / 3600;
  return elapsed < SESSION_HOURS;
}
function isLockedOut(s) {
  if (!s.lockedUntil) return false;
  return Date.now() < s.lockedUntil;
}

// ── STORAGE HELPERS ────────────────────────────────────────────────────
async function loadData() {
  try {
    const r = await window.storage.get("itplatform-topics");
    if (r) {
      const stored = JSON.parse(r.value);

      // Deep merge: for each default topic, merge its pages with stored pages
      const merged = DEFAULT_TOPICS.map(def => {
        const storedTopic = stored.find(s => s.id === def.id);
        if (!storedTopic) return def;

        // Merge pages: start with default pages as base
        const mergedPages = [...def.pages];
        storedTopic.pages.forEach(sp => {
          const exists = mergedPages.find(p => p.id === sp.id);
          if (exists) {
            // Update existing page with stored version (in case admin edited it)
            const idx = mergedPages.findIndex(p => p.id === sp.id);
            mergedPages[idx] = sp;
          } else {
            // New page added via admin — keep it
            mergedPages.push(sp);
          }
        });

        return { ...storedTopic, pages: mergedPages };
      });

      // Also add any brand-new topics added via admin (not in defaults)
      stored.forEach(s => {
        if (!DEFAULT_TOPICS.find(d => d.id === s.id)) merged.push(s);
      });

      // Re-save merged data so storage stays in sync with defaults
      await saveData(merged);
      return merged;
    }
  } catch {}
  return DEFAULT_TOPICS;
}
async function saveData(topics) {
  try { await window.storage.set("itplatform-topics", JSON.stringify(topics)); } catch {}
}

// ── DEFAULT SCRIPTS ────────────────────────────────────────────────────
const DEFAULT_SCRIPTS = [
  { id: "oracle", label: "Oracle", icon: "🔴", color: "#C74634", scripts: [
    { id: "ora-tablesize",      title: "Check Table Size",           description: "Shows size of all tables in current schema", extension: "sql",
      code: `-- Check Table Size in Current Schema
SELECT
  segment_name   AS table_name,
  ROUND(bytes / 1024 / 1024, 2) AS size_mb
FROM user_segments
WHERE segment_type = 'TABLE'
ORDER BY bytes DESC;` },
    { id: "ora-tablespace",     title: "Check Tablespace Size",      description: "Used, free and total space per tablespace", extension: "sql",
      code: `-- Tablespace Usage
SELECT
  df.tablespace_name,
  ROUND(df.total_mb, 2)     AS total_mb,
  ROUND(df.total_mb - fs.free_mb, 2) AS used_mb,
  ROUND(fs.free_mb, 2)      AS free_mb,
  ROUND((1 - fs.free_mb / df.total_mb) * 100, 1) AS pct_used
FROM
  (SELECT tablespace_name, SUM(bytes)/1024/1024 total_mb FROM dba_data_files GROUP BY tablespace_name) df,
  (SELECT tablespace_name, SUM(bytes)/1024/1024 free_mb  FROM dba_free_space   GROUP BY tablespace_name) fs
WHERE df.tablespace_name = fs.tablespace_name
ORDER BY pct_used DESC;` },
    { id: "ora-blocking",       title: "Find Blocking Sessions",     description: "Identify sessions blocking other sessions", extension: "sql",
      code: `-- Blocking Sessions
SELECT
  l1.sid     AS blocking_sid,
  s1.username AS blocking_user,
  s1.status   AS blocking_status,
  l2.sid     AS waiting_sid,
  s2.username AS waiting_user,
  s2.sql_id   AS waiting_sql
FROM v$lock l1
JOIN v$lock    l2 ON l1.id1 = l2.id1 AND l1.id2 = l2.id2
JOIN v$session s1 ON l1.sid = s1.sid
JOIN v$session s2 ON l2.sid = s2.sid
WHERE l1.block = 1 AND l2.request > 0;` },
    { id: "ora-topsql",         title: "Top SQL by CPU",             description: "Find the most CPU-intensive SQL statements", extension: "sql",
      code: `-- Top SQL by CPU Usage
SELECT *
FROM (
  SELECT
    sql_id,
    ROUND(cpu_time/1e6, 2)        AS cpu_secs,
    ROUND(elapsed_time/1e6, 2)    AS elapsed_secs,
    executions,
    ROUND(cpu_time/NULLIF(executions,0)/1e6,4) AS cpu_per_exec,
    SUBSTR(sql_text, 1, 80)       AS sql_preview
  FROM v$sqlarea
  ORDER BY cpu_time DESC
)
WHERE ROWNUM <= 20;` },
    { id: "ora-alertlog",       title: "Alert Log Location",         description: "Find the Oracle alert log file path", extension: "sql",
      code: `-- Find Alert Log Location
SELECT value AS alert_log_dir
FROM v$diag_info
WHERE name = 'Diag Trace';` },
  ]},
  { id: "postgresql", label: "PostgreSQL", icon: "🐘", color: "#336791", scripts: [
    { id: "pg-dbsize",          title: "Check Database Size",        description: "Size of all databases on the server", extension: "sql",
      code: `-- Database Sizes
SELECT
  datname       AS database,
  pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;` },
    { id: "pg-tablesize",       title: "Check Table Size",           description: "Top tables by size including indexes", extension: "sql",
      code: `-- Table Sizes with Indexes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename))       AS table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename))        AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;` },
    { id: "pg-locks",           title: "Find Blocking Locks",        description: "Show blocked and blocking queries", extension: "sql",
      code: `-- Blocking Locks
SELECT
  blocked.pid          AS blocked_pid,
  blocked.query        AS blocked_query,
  blocking.pid         AS blocking_pid,
  blocking.query       AS blocking_query,
  blocked.wait_event_type,
  blocked.wait_event
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
  ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
WHERE blocked.cardinality(pg_blocking_pids(blocked.pid)) > 0;` },
    { id: "pg-slowqueries",     title: "Slow Query Analysis",        description: "Top slow queries via pg_stat_statements", extension: "sql",
      code: `-- Slow Queries (requires pg_stat_statements)
SELECT
  ROUND(mean_exec_time::numeric, 2) AS avg_ms,
  calls,
  ROUND(total_exec_time::numeric/1000, 2) AS total_secs,
  SUBSTR(query, 1, 100)             AS query_preview
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;` },
  ]},
  { id: "mysql", label: "MySQL", icon: "🐬", color: "#F29111", scripts: [
    { id: "my-processlist",     title: "Show Running Processes",     description: "Active queries and their status", extension: "sql",
      code: `-- Running Processes
SELECT
  id, user, host, db,
  command, time, state,
  SUBSTR(info, 1, 80) AS query
FROM information_schema.processlist
WHERE command != 'Sleep'
ORDER BY time DESC;` },
    { id: "my-tablesize",       title: "Check Table Size",           description: "Table and index sizes per database", extension: "sql",
      code: `-- Table Sizes
SELECT
  table_schema              AS db,
  table_name,
  ROUND(data_length/1024/1024, 2)  AS data_mb,
  ROUND(index_length/1024/1024, 2) AS index_mb,
  ROUND((data_length+index_length)/1024/1024, 2) AS total_mb
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema','performance_schema','sys','mysql')
ORDER BY (data_length+index_length) DESC
LIMIT 30;` },
    { id: "my-replication",     title: "Check Replication Status",   description: "Show slave/replica replication lag", extension: "sql",
      code: `-- Replication Status
SHOW SLAVE STATUS\G
-- Or in MySQL 8+:
-- SHOW REPLICA STATUS\G

-- Check seconds behind master:
-- Look for: Seconds_Behind_Master` },
  ]},
  { id: "linux", label: "Linux", icon: "🐧", color: "#374151", scripts: [
    { id: "lx-diskusage",       title: "Disk Usage Check",           description: "Check disk space usage across all mounts", extension: "sh",
      code: `#!/bin/bash
# Disk Usage Summary
echo "=== Disk Usage ==="
df -hT | grep -v tmpfs | grep -v udev

echo ""
echo "=== Top 10 Largest Directories ==="
du -sh /* 2>/dev/null | sort -rh | head -10` },
    { id: "lx-topcpu",          title: "Top CPU Processes",          description: "Find top CPU-consuming processes", extension: "sh",
      code: `#!/bin/bash
# Top CPU & Memory Consumers
echo "=== Top 10 by CPU ==="
ps aux --sort=-%cpu | head -11

echo ""
echo "=== Top 10 by Memory ==="
ps aux --sort=-%mem | head -11` },
    { id: "lx-logcheck",        title: "Recent Error Log Check",     description: "Scan system logs for errors and warnings", extension: "sh",
      code: `#!/bin/bash
# Check recent errors in system logs
echo "=== Last 50 System Errors ==="
grep -i "error\|critical\|failed" /var/log/syslog 2>/dev/null | tail -50

# For RHEL/CentOS:
# grep -i "error\|critical\|failed" /var/log/messages | tail -50

echo ""
echo "=== Last 20 Auth Failures ==="
grep "Failed password" /var/log/auth.log 2>/dev/null | tail -20` },
    { id: "lx-netconn",         title: "Active Network Connections",  description: "Show all active TCP connections", extension: "sh",
      code: `#!/bin/bash
# Active Network Connections
echo "=== Listening Ports ==="
ss -tlnp

echo ""
echo "=== Established Connections ==="
ss -tnp state established

echo ""
echo "=== Connection Count by State ==="
ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn` },
  ]},
  { id: "ansible", label: "Ansible", icon: "🤖", color: "#EE0000", scripts: [
    { id: "ans-ping",           title: "Ping All Hosts",             description: "Test connectivity to all inventory hosts", extension: "sh",
      code: `#!/bin/bash
# Ping all hosts in inventory
ansible all -m ping

# Ping specific group:
# ansible db_servers -m ping

# With custom inventory:
# ansible all -i inventory.ini -m ping` },
    { id: "ans-facts",          title: "Gather Host Facts",          description: "Collect system facts from remote hosts", extension: "sh",
      code: `#!/bin/bash
# Gather facts from all hosts
ansible all -m setup

# Filter specific facts:
ansible all -m setup -a 'filter=ansible_memory_mb'
ansible all -m setup -a 'filter=ansible_os_family'
ansible all -m setup -a 'filter=ansible_processor_vcpus'` },
    { id: "ans-playbook",       title: "Run Playbook Template",      description: "Basic Ansible playbook structure", extension: "yaml",
      code: `---
- name: Example Playbook
  hosts: db_servers
  become: yes
  vars:
    db_port: 5432
    app_user: dbadmin

  tasks:
    - name: Ensure package is installed
      ansible.builtin.package:
        name: postgresql
        state: present

    - name: Start and enable service
      ansible.builtin.service:
        name: postgresql
        state: started
        enabled: yes

    - name: Copy config file
      ansible.builtin.template:
        src: templates/pg_hba.conf.j2
        dest: /etc/postgresql/pg_hba.conf
        owner: postgres
        group: postgres
        mode: '0640'
      notify: Restart PostgreSQL

  handlers:
    - name: Restart PostgreSQL
      ansible.builtin.service:
        name: postgresql
        state: restarted` },
  ]},
  { id: "terraform", label: "Terraform", icon: "🏗️", color: "#7B42BC", scripts: [
    { id: "tf-rds",             title: "AWS RDS Instance",           description: "Provision an AWS RDS Oracle/PostgreSQL instance", extension: "tf",
      code: `# AWS RDS Instance
resource "aws_db_instance" "main" {
  identifier        = "prod-database"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  storage_type      = "gp3"

  db_name  = "appdb"
  username = "dbadmin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  multi_az               = true
  deletion_protection    = true
  skip_final_snapshot    = false
  final_snapshot_identifier = "prod-database-final"

  tags = {
    Name        = "prod-database"
    Environment = "production"
  }
}` },
    { id: "tf-commands",        title: "Common Terraform Commands",  description: "Day-to-day Terraform workflow commands", extension: "sh",
      code: `#!/bin/bash
# Terraform Workflow

# Initialise working directory
terraform init

# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Preview changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy infrastructure
# terraform destroy

# Show current state
terraform show

# List resources in state
terraform state list

# Import existing resource
# terraform import aws_instance.web i-1234567890abcdef0` },
  ]},
];

async function loadScripts() {
  try {
    const r = await window.storage.get("itplatform-scripts");
    if (r) {
      const stored = JSON.parse(r.value);
      // Merge: keep defaults as base, overlay stored changes
      return DEFAULT_SCRIPTS.map(defCat => {
        const storedCat = stored.find(s => s.id === defCat.id);
        if (!storedCat) return defCat;
        const mergedScripts = [...defCat.scripts];
        storedCat.scripts.forEach(ss => {
          const idx = mergedScripts.findIndex(ds => ds.id === ss.id);
          if (idx >= 0) mergedScripts[idx] = ss;
          else mergedScripts.push(ss);
        });
        return { ...storedCat, scripts: mergedScripts };
      }).concat(stored.filter(s => !DEFAULT_SCRIPTS.find(d => d.id === s.id)));
    }
  } catch {}
  return DEFAULT_SCRIPTS;
}
async function saveScripts(scriptCats) {
  try { await window.storage.set("itplatform-scripts", JSON.stringify(scriptCats)); } catch {}
}


// ── MARKDOWN RENDERER ─────────────────────────────────────────────────
function inlineFormat(text) {
  return text
    .replace(/`([^`]+)`/g, `<code style="background:#F3F4F6;color:#C74634;padding:0.1rem 0.4rem;border-radius:4px;font-family:'DM Mono',monospace;font-size:0.83em">$1</code>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" style="color:#2563EB;text-decoration:underline">$1</a>`)
    .replace(/•\s*/g, "");
}

function renderContent(raw) {
  if (!raw) return "";
  const codeBlocks = [];
  let text = raw.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const html = `<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem 1.2rem;border-radius:10px;font-family:'DM Mono',monospace;font-size:0.82rem;line-height:1.75;overflow-x:auto;margin:1.2rem 0;border:1px solid #313244"><code>${code.trim().replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`;
    codeBlocks.push(html);
    return `%%CODE_${codeBlocks.length - 1}%%`;
  });
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^%%CODE_\d+%%$/.test(line.trim())) {
      const idx = parseInt(line.match(/%%CODE_(\d+)%%/)[1]);
      out.push(codeBlocks[idx]); i++; continue;
    }
    if (/^### (.+)/.test(line)) { out.push(`<h4 style="font-size:0.95rem;font-weight:700;color:#1A1A2E;margin:1.4rem 0 0.5rem">${inlineFormat(line.replace(/^### /,""))}</h4>`); i++; continue; }
    if (/^## (.+)/.test(line))  { out.push(`<h3 style="font-size:1.1rem;font-weight:800;color:#1A1A2E;margin:1.8rem 0 0.6rem;padding-bottom:0.4rem;border-bottom:2px solid #E2E2EC">${inlineFormat(line.replace(/^## /,""))}</h3>`); i++; continue; }
    if (/^# (.+)/.test(line))   { out.push(`<h2 style="font-size:1.3rem;font-weight:900;color:#1A1A2E;margin:2rem 0 0.7rem;font-family:'Playfair Display',serif">${inlineFormat(line.replace(/^# /,""))}</h2>`); i++; continue; }
    if (/^[-•*] (.+)/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-•*] (.+)/.test(lines[i])) {
        items.push(`<li style="margin-bottom:0.45rem;line-height:1.7">${inlineFormat(lines[i].replace(/^[-•*] /,""))}</li>`);
        i++;
      }
      out.push(`<ul style="margin:0.6rem 0 1rem 1.4rem;padding:0">${items.join("")}</ul>`);
      continue;
    }
    if (/^\d+\. (.+)/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. (.+)/.test(lines[i])) {
        items.push(`<li style="margin-bottom:0.45rem;line-height:1.7">${inlineFormat(lines[i].replace(/^\d+\. /,""))}</li>`);
        i++;
      }
      out.push(`<ol style="margin:0.6rem 0 1rem 1.4rem;padding:0">${items.join("")}</ol>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) { out.push(`<hr style="border:none;border-top:1px solid #E2E2EC;margin:1.5rem 0"/>`); i++; continue; }
    if (/^\*\*(.+?)\*\*:?\s*$/.test(line.trim())) {
      const heading = line.trim().replace(/^\*\*/,"").replace(/\*\*:?\s*$/,"");
      out.push(`<p style="font-weight:700;font-size:0.95rem;color:#1A1A2E;margin:1.4rem 0 0.3rem">${heading}:</p>`); i++; continue;
    }
    if (line.trim() === "") { out.push(`<div style="height:0.5rem"></div>`); i++; continue; }
    out.push(`<p style="margin:0 0 0.5rem;line-height:1.85;color:#374151">${inlineFormat(line)}</p>`);
    i++;
  }
  return out.join("\n");
}

const CATEGORY_ICONS = { databases: "🗄️", automation: "⚙️", cloud: "☁️" };

// ══════════════════════════════════════════════════════════════════════
// 🔒 LOCK ICON
// ══════════════════════════════════════════════════════════════════════
function LockIcon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div style={{ width: 14, height: 10, border: "3px solid #f5c518", borderBottom: "none", borderRadius: "7px 7px 0 0", marginBottom: -1 }} />
      <div style={{ width: 22, height: 17, background: "#f5c518", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 5, height: 7, borderRadius: 3, background: "#0d1b2e", marginTop: 2 }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 📊 STATS FOOTER — shows on every page
// ══════════════════════════════════════════════════════════════════════
function StatsFooter({ topics }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const totalPages = topics.reduce((a, t) => a + t.pages.length, 0);

  const stats = [
    { value: topics.length, label: "Total Topics",      type: "number" },
    { value: totalPages,    label: "Knowledge Pages",   type: "number" },
    { value: DEFAULT_CATEGORIES.length, label: "Technology Areas", type: "number" },
    { value: null,          label: "Secured Admin",     type: "lock"   },
  ];

  return (
    <footer style={{
      background: "linear-gradient(135deg, #0d1b2e 0%, #112240 100%)",
      borderTop: "1px solid #1e3a5f",
      padding: "30px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            padding: "0 48px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
          }}>
            {stat.type === "lock" ? <LockIcon /> : (
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#e8edf5", lineHeight: 1, letterSpacing: "-0.5px" }}>
                {stat.value}
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 500, color: "#7a90aa", letterSpacing: "0.05em", textAlign: "center" }}>
              {stat.label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 44, background: "#1e3a5f", flexShrink: 0 }} />
          )}
        </div>
      ))}

      {/* Copyright — border auto-fits to text width */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 20 }}>
        <span style={{
          display: "inline-block",
          fontSize: 11, color: "#3d5470",
          letterSpacing: "0.06em",
          borderTop: "1px solid #1a2f48",
          paddingTop: 14,
        }}>
          © {new Date().getFullYear()} ITLearn Hub · All rights reserved
        </span>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 🔍 GLOBAL SEARCH BAR COMPONENT
// ══════════════════════════════════════════════════════════════════════
function GlobalSearch({ topics, onGoTopic, onGoPage }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const found = [];
    topics.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)) {
        found.push({ type: "topic", topic: t });
      }
      t.pages.forEach((p) => {
        if (p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)) {
          found.push({ type: "page", topic: t, page: p });
        }
      });
    });
    setResults(found.slice(0, 8));
  }, [query, topics]);

  const handleSelect = (r) => {
    setQuery("");
    setResults([]);
    if (r.type === "topic") onGoTopic(r.topic);
    else onGoPage(r.topic, r.page);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", alignItems: "center", background: "#F3F4F6", border: `1.5px solid ${focused ? "#2563EB" : "#E2E2EC"}`, borderRadius: 10, padding: "0.45rem 0.9rem", gap: "0.5rem", transition: "border-color 0.2s" }}>
        <span style={{ fontSize: "0.9rem", color: "#9CA3AF" }}>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search topics & pages…"
          style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.84rem", color: "#1A1A2E", width: "100%", fontFamily: "inherit" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
        )}
      </div>

      {results.length > 0 && focused && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 999, overflow: "hidden" }}>
          {results.map((r, i) => (
            <div key={i} onClick={() => handleSelect(r)}
              style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.7rem", borderBottom: i < results.length - 1 ? "1px solid #F3F4F6" : "none" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFF"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{r.topic.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "#1A1A2E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.type === "page" ? r.page.title : r.topic.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                  {r.type === "page" ? `in ${r.topic.title}` : r.topic.tagline}
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", background: r.type === "page" ? "#EFF6FF" : r.topic.lightColor, color: r.type === "page" ? "#2563EB" : r.topic.color, padding: "0.15rem 0.5rem", borderRadius: 100, fontWeight: 600, flexShrink: 0 }}>
                {r.type === "page" ? "page" : "topic"}
              </span>
            </div>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && focused && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, padding: "1.2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.83rem", zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          No results for "<strong>{query}</strong>"
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 🔐 ADMIN LOGIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
function AdminLogin({ onSuccess, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [sec, setSec]           = useState(getSecurityState());
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isLockedOut(sec)) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((sec.lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        const updated = { ...sec, lockedUntil: null, attempts: 0 };
        setSecurityState(updated); setSec(updated); setError(""); clearInterval(interval);
      } else { setCountdown(remaining); }
    }, 1000);
    return () => clearInterval(interval);
  }, [sec]);

  const handleLogin = () => {
    if (isLockedOut(sec)) return;
    if (password === ADMIN_PASSWORD) {
      const updated = { attempts: 0, lockedUntil: null, loggedIn: true, loginTime: Date.now() };
      setSecurityState(updated); onSuccess();
    } else {
      const attempts = sec.attempts + 1;
      const lockedUntil = attempts >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MINUTES * 60 * 1000 : null;
      const updated = { ...sec, attempts, lockedUntil };
      setSecurityState(updated); setSec(updated);
      if (lockedUntil) {
        setError(`🔒 Too many attempts. Locked for ${LOCKOUT_MINUTES} minutes.`);
      } else {
        setError(`❌ Wrong password. ${MAX_LOGIN_ATTEMPTS - attempts} attempt${MAX_LOGIN_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining.`);
      }
      setPassword("");
    }
  };

  const locked = isLockedOut(sec);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 25px 80px rgba(0,0,0,0.3)", animation: "fadeIn 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "#1A1A2E" }}>Admin Access</h2>
          <p style={{ fontSize: "0.83rem", color: "#6B7280", marginTop: "0.3rem" }}>Enter your password to manage content</p>
        </div>
        {locked ? (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>🔒</div>
            <div style={{ fontWeight: 700, color: "#DC2626", fontSize: "0.9rem" }}>Account Locked</div>
            <div style={{ color: "#EF4444", fontSize: "0.82rem", marginTop: "0.3rem" }}>
              Try again in <strong>{Math.ceil(countdown / 60)}m {countdown % 60}s</strong>
            </div>
          </div>
        ) : (
          <>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter admin password"
                style={{ width: "100%", padding: "0.85rem 3rem 0.85rem 1rem", border: `1.5px solid ${error ? "#FCA5A5" : "#E2E2EC"}`, borderRadius: 10, fontSize: "0.95rem", background: "#FAFAF7", outline: "none" }} autoFocus />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: "#6B7280" }}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {error && <div style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: 8, padding: "0.6rem 0.9rem", fontSize: "0.82rem", marginBottom: "1rem", fontWeight: 500 }}>{error}</div>}
            <button onClick={handleLogin} style={{ width: "100%", padding: "0.85rem", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", marginBottom: "0.8rem" }}>
              🔓 Login to Admin
            </button>
          </>
        )}
        <button onClick={onCancel} style={{ width: "100%", padding: "0.7rem", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 10, fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" }}>
          Cancel
        </button>
        <div style={{ marginTop: "1.2rem", padding: "0.8rem", background: "#F8FAFC", borderRadius: 8, fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center" }}>
          🛡️ Max {MAX_LOGIN_ATTEMPTS} attempts · {LOCKOUT_MINUTES}min lockout · Session expires in {SESSION_HOURS}h
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════
export default function App() {
  const [topics, setTopics]           = useState([]);
  const [view, setView]               = useState("home");
  const [activeTopic, setActiveTopic] = useState(null);
  const [activePage, setActivePage]   = useState(null);
  const [filterCat, setFilterCat]     = useState("all");
  const [search, setSearch]           = useState("");
  const [browseSearch, setBrowseSearch] = useState("");
  const [toast, setToast]             = useState(null);
  const [showLogin, setShowLogin]     = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [adminView, setAdminView]     = useState("topics");
  const [editingTopic, setEditingTopic]             = useState(null);
  const [editingPage, setEditingPage]               = useState(null);
  const [editingPageTopicId, setEditingPageTopicId] = useState(null);
  const [scripts, setScripts]           = useState(DEFAULT_SCRIPTS);
  const [scriptCat, setScriptCat]       = useState(null);   // active category id
  const [activeScript, setActiveScript] = useState(null);   // active script object
  const [scriptDropdown, setScriptDropdown] = useState(null); // open dropdown cat id
  const [editingScript, setEditingScript]   = useState(null);
  const [editingScriptCat, setEditingScriptCat] = useState(null);

  useEffect(() => {
    loadData().then(setTopics);
    loadScripts().then(setScripts);
    const sec = getSecurityState();
    if (isSessionValid(sec)) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const sec = getSecurityState();
    const remaining = (SESSION_HOURS * 3600 * 1000) - (Date.now() - sec.loginTime);
    const timer = setTimeout(() => { handleLogout(); showToast("⏰ Session expired. Please login again."); }, remaining);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  // 🔐 Secret keyboard shortcut: Ctrl + Shift + A to open admin login
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (isAdmin) { setView("admin"); setAdminView("topics"); }
        else setShowLogin(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isAdmin]);

  const persist = useCallback((newTopics) => { setTopics(newTopics); saveData(newTopics); }, []);
  const persistScripts = (s) => { setScripts(s); saveScripts(s); };

  const goScripts = (catId) => {
    const cat = scripts.find(c => c.id === catId);
    setScriptCat(cat || scripts[0]);
    setActiveScript(null);
    setView("scripts");
    setScriptDropdown(null);
  };
  const openScript = (script) => setActiveScript(script);

  const saveScriptItem = (catId, scriptData) => {
    const updated = scripts.map(cat => {
      if (cat.id !== catId) return cat;
      const exists = cat.scripts.find(s => s.id === scriptData.id);
      const newScripts = exists
        ? cat.scripts.map(s => s.id === scriptData.id ? scriptData : s)
        : [...cat.scripts, { ...scriptData, id: "script-" + Date.now() }];
      return { ...cat, scripts: newScripts };
    });
    persistScripts(updated);
    setAdminView("scripts");
    setEditingScript(null);
    showToast("✅ Script saved!");
  };
  const deleteScriptItem = (catId, scriptId) => {
    persistScripts(scripts.map(cat =>
      cat.id === catId ? { ...cat, scripts: cat.scripts.filter(s => s.id !== scriptId) } : cat
    ));
    showToast("🗑️ Script deleted");
  };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleLogout = () => {
    const sec = getSecurityState();
    setSecurityState({ ...sec, loggedIn: false, loginTime: null });
    setIsAdmin(false); setView("home");
    showToast("👋 Logged out successfully");
  };

  const handleAdminClick = () => {
    if (isAdmin) { setView("admin"); setAdminView("topics"); }
    else setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true); setShowLogin(false);
    setView("admin"); setAdminView("topics");
    showToast("✅ Welcome back! Admin session started.");
  };

  const goHome    = () => { setView("home");    setActiveTopic(null); setActivePage(null); };
  const goSession = () => { window.open("/session.html", "_blank"); };
  const goAbout  = () => { setView("about");  setActiveTopic(null); setActivePage(null); };
  const goBrowse = (cat = "all") => { setView("browse"); setFilterCat(cat); setActiveTopic(null); setBrowseSearch(""); };
  const goTopic  = (t) => { setActiveTopic(t); setView("topic"); setActivePage(null); };
  const goPage   = (topic, page) => { setActiveTopic(topic); setActivePage(page); setView("page"); };

  const filtered = topics.filter((t) => {
    const matchCat = filterCat === 'all' || t.category === filterCat;
    const q = browseSearch.toLowerCase();
    const matchSearch = !browseSearch ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.pages.some(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const byCategory = DEFAULT_CATEGORIES.map((c) => ({ ...c, items: topics.filter((t) => t.category === c.id) }));

  const saveTopic = (data) => {
    const next = data.id && topics.find((t) => t.id === data.id)
      ? topics.map((t) => t.id === data.id ? { ...t, ...data } : t)
      : [...topics, { ...data, id: "topic-" + Date.now(), pages: [] }];
    persist(next); setAdminView("topics"); setEditingTopic(null); showToast("✅ Topic saved!");
  };
  const deleteTopic = (id) => { persist(topics.filter((t) => t.id !== id)); showToast("🗑️ Topic deleted"); };
  const savePage = (topicId, pageData) => {
    const next = topics.map((t) => {
      if (t.id !== topicId) return t;
      const existing = t.pages.find((p) => p.id === pageData.id);
      const pages = existing
        ? t.pages.map((p) => p.id === pageData.id ? { ...p, ...pageData, lastUpdated: new Date().toISOString().split("T")[0] } : p)
        : [...t.pages, { ...pageData, id: "page-" + Date.now(), lastUpdated: new Date().toISOString().split("T")[0] }];
      return { ...t, pages };
    });
    persist(next); setAdminView("topics"); setEditingPage(null); setEditingPageTopicId(null); showToast("✅ Page saved!");
  };
  const deletePage = (topicId, pageId) => {
    persist(topics.map((t) => t.id === topicId ? { ...t, pages: t.pages.filter((p) => p.id !== pageId) } : t));
    showToast("🗑️ Page deleted");
  };

  return (
    // ✅ KEY FIX: flex column + min-height 100vh pushes footer to bottom
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#FAFAF7", color: "#1A1A2E", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(26,26,46,0.13); }
        .btn { border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s; border-radius: 9px; }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        input, textarea, select { font-family: 'DM Sans', sans-serif; outline: none; }
        textarea { resize: vertical; }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .slide-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .slide-row::-webkit-scrollbar { height: 4px; }
        .slide-row::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #c1c1d4; border-radius: 10px; }
      `}</style>

      {showLogin && <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />}

      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, background: "#1A1A2E", color: "#fff", borderRadius: 12, padding: "0.85rem 1.5rem", fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid #E2E2EC", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 3%", height: 58, gap: "0.5rem", overflow: "visible" }}>

        {/* Logo */}
        <div onClick={goHome} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 900, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
          IT<span style={{ color: "#2563EB" }}>Learn</span> Hub
        </div>

        {/* Search — shrinks in middle */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 320, margin: "0 0.5rem" }}>
          <GlobalSearch topics={topics} onGoTopic={goTopic} onGoPage={goPage} />
        </div>

        {/* Nav links — always visible, no wrap */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.1rem", flexShrink: 0 }}>
          {[["Home", goHome], ["Browse", () => goBrowse()], ["About", goAbout]].map(([label, fn]) => (
            <button key={label} onClick={fn}
              style={{ padding: "0.35rem 0.7rem", background: "transparent", border: "none", color: "#6B7280", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", borderRadius: 7, whiteSpace: "nowrap" }}
              onMouseEnter={e => e.target.style.color="#2563EB"} onMouseLeave={e => e.target.style.color="#6B7280"}>
              {label}
            </button>
          ))}

          {/* ── SCRIPTS DROPDOWN ── */}
          <div style={{ position: "relative" }}
            onMouseEnter={() => setScriptDropdown("open")}
            onMouseLeave={() => setScriptDropdown(null)}>
            <button style={{ padding: "0.35rem 0.7rem", background: scriptDropdown ? "#EFF6FF" : "transparent", border: "none", color: scriptDropdown ? "#2563EB" : "#6B7280", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: scriptDropdown ? 600 : 500, cursor: "pointer", borderRadius: 7, display: "flex", alignItems: "center", gap: "0.3rem", whiteSpace: "nowrap" }}>
              📜 Scripts <span style={{ fontSize: "0.55rem" }}>▼</span>
            </button>
            {scriptDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)", background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.14)", minWidth: 200, zIndex: 9999, overflow: "hidden", padding: "6px 0" }}>
                {scripts.map(cat => (
                  <button key={cat.id} onClick={() => goScripts(cat.id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 1rem", background: "transparent", border: "none", color: "#374151", fontFamily: "inherit", fontSize: "0.83rem", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background="#F5F5FF"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <span>{cat.icon}</span>
                    <span style={{ fontWeight: 500, flex: 1, textAlign: "left" }}>{cat.label}</span>
                    <span style={{ fontSize: "0.7rem", color: "#9CA3AF", background: "#F3F4F6", padding: "0.1rem 0.4rem", borderRadius: 100 }}>{cat.scripts.length}</span>
                  </button>
                ))}
                <div style={{ margin: "4px 8px 2px", borderTop: "1px solid #F3F4F6" }} />
                <button onClick={() => goScripts(scripts[0]?.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "0.5rem 1rem", background: "transparent", border: "none", color: "#2563EB", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="#EFF6FF"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  View All Scripts →
                </button>
              </div>
            )}
          </div>

          {/* Free Session */}
          <button onClick={goSession}
            style={{ padding: "0.35rem 0.75rem", background: "#FEF2F0", border: "1px solid #FCA5A5", color: "#C74634", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", borderRadius: 7, whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.background="#FEE2E2"}
            onMouseLeave={e => e.currentTarget.style.background="#FEF2F0"}>
            🎓 Free Session
          </button>

          {/* Admin — only when logged in */}
          {isAdmin && (
            <>
              <button onClick={() => { setView("admin"); setAdminView("topics"); }} className="btn"
                style={{ padding: "0.35rem 0.85rem", background: "#1A1A2E", color: "#fff", fontSize: "0.78rem", marginLeft: "0.3rem" }}>
                ✏️ Manage
              </button>
              <button onClick={handleLogout} className="btn"
                style={{ padding: "0.35rem 0.7rem", background: "#FEF2F2", color: "#DC2626", fontSize: "0.78rem" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ✅ MAIN CONTENT — flex:1 pushes footer to bottom */}
      <main style={{ flex: 1 }}>

        {/* ══════════ HOME VIEW ══════════ */}
        {view === "home" && (
          <div className="fade-in">
            <section style={{ background: "#fff", padding: "56px 6% 52px", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ maxWidth: 580 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0F7FF", color: "#2563EB", border: "1px solid #BFDBFE", borderRadius: 6, padding: "0.25rem 0.75rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.4rem" }}>
                  IT Knowledge Hub
                </div>
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem", color: "#1A1A2E", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
                  Master{" "}
                  <span style={{ color: "#2563EB", fontWeight: 700 }}>Databases</span>,{" "}
                  <span style={{ color: "#7C3AED", fontWeight: 700 }}>Automation</span>{" "}
                  <span style={{ color: "#374151", fontWeight: 400 }}>&</span>{" "}
                  <span style={{ color: "#0891B2", fontWeight: 700 }}>Cloud Technologies</span>
                </h1>
                <p style={{ fontSize: "0.95rem", color: "#6B7280", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 480, fontWeight: 400 }}>
                  A practical IT knowledge base covering Oracle, PostgreSQL, MySQL, MongoDB, SQL Server, Ansible, Terraform, AWS, Azure, and Kubernetes.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.7rem 1.4rem", background: "#2563EB", color: "#fff", fontSize: "0.88rem", fontWeight: 600 }}>Browse Topics →</button>
                  <button onClick={goAbout} className="btn" style={{ padding: "0.7rem 1.2rem", background: "transparent", color: "#6B7280", border: "1px solid #E2E2EC", fontSize: "0.88rem", fontWeight: 500 }}>About Me</button>
                </div>
              </div>
            </section>

            {/* 🎓 FREE SESSION PROMO BANNER */}
            <div style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)", padding: "20px 6%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "rgba(196,70,52,0.2)", border: "1px solid rgba(196,70,52,0.4)", borderRadius: 6, padding: "0.2rem 0.7rem", fontSize: "0.68rem", fontWeight: 700, color: "#fca5a5", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>🔴 Free</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#f1f5f9" }}>Oracle Basic Troubleshooting — Free 1-Hour Live Session</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2 }}>Limited seats · Microsoft Teams · Date TBA</div>
                </div>
              </div>
              <button onClick={goSession} style={{ padding: "0.55rem 1.3rem", background: "#C74634", color: "#fff", border: "none", borderRadius: 9, fontFamily: "inherit", fontSize: "0.83rem", fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity = "0.85"} onMouseLeave={e => e.target.style.opacity = "1"}>
                Register Free →
              </button>
            </div>

            {byCategory.map((cat) => (
              <section key={cat.id} style={{ padding: "50px 6% 40px", borderBottom: "1px solid #E2E2EC" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: cat.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{cat.icon} {cat.label}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900 }}>
                      {cat.id === "databases" ? "Database Platforms" : cat.id === "automation" ? "Automation Tools" : "Cloud Infrastructure"}
                    </div>
                  </div>
                  <button onClick={() => goBrowse(cat.id)} className="btn" style={{ padding: "0.5rem 1.1rem", background: cat.lightColor, color: cat.color, border: `1px solid ${cat.color}30`, fontSize: "0.82rem" }}>
                    See All {cat.items.length} →
                  </button>
                </div>
                <div className="slide-row">
                  {cat.items.map((t) => (
                    <div key={t.id} onClick={() => goTopic(t)} className="hover-lift" style={{ minWidth: 220, background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                      <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>{t.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.35rem" }}>{t.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6B7280", marginBottom: "0.8rem", lineHeight: 1.5 }}>{t.description.substring(0, 75)}…</div>
                      <span style={{ background: t.lightColor, color: t.color, padding: "0.2rem 0.65rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>{t.pages.length} pages</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ══════════ BROWSE VIEW ══════════ */}
        {view === "browse" && (
          <div className="fade-in">
            <div style={{ background: "#fff", padding: "40px 6% 30px", borderBottom: "1px solid #E2E2EC" }}>
              <Breadcrumb items={[{ label: "Home", fn: goHome }, { label: "Browse" }]} />
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginTop: "0.8rem", marginBottom: "1rem" }}>Browse Topics</h1>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {[{ id: "all", label: "All", icon: "📚", color: "#2563EB" }, ...DEFAULT_CATEGORIES].map((c) => (
                  <button key={c.id} onClick={() => setFilterCat(c.id)} className="btn" style={{ padding: "0.4rem 1rem", background: filterCat === c.id ? (c.color || "#2563EB") : "#F3F4F6", color: filterCat === c.id ? "#fff" : "#374151", fontSize: "0.82rem" }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
              <input value={browseSearch} onChange={(e) => setBrowseSearch(e.target.value)} placeholder="🔍  Search topics, pages…" style={{ width: "100%", maxWidth: 420, padding: "0.65rem 1rem", border: "1.5px solid #E2E2EC", borderRadius: 10, fontSize: "0.88rem", background: "#FAFAF7" }} />
            </div>
            <div style={{ padding: "2rem 6%" }}>
              {/* When searching, show matching pages too */}
              {browseSearch && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                    📄 Matching Pages
                  </div>
                  {topics.flatMap(t =>
                    t.pages
                      .filter(p => p.title.toLowerCase().includes(browseSearch.toLowerCase()) || p.content.toLowerCase().includes(browseSearch.toLowerCase()))
                      .map(p => ({ topic: t, page: p }))
                  ).length === 0 ? (
                    <div style={{ fontSize: "0.83rem", color: "#9CA3AF", marginBottom: "0.5rem" }}>No matching pages</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "0.8rem", marginBottom: "1.5rem" }}>
                      {topics.flatMap(t =>
                        t.pages
                          .filter(p => p.title.toLowerCase().includes(browseSearch.toLowerCase()) || p.content.toLowerCase().includes(browseSearch.toLowerCase()))
                          .map(p => ({ topic: t, page: p }))
                      ).map(({ topic: t, page: p }, i) => (
                        <div key={i} onClick={() => goPage(t, p)} className="hover-lift"
                          style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, padding: "1.2rem", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                            <span style={{ fontSize: "1.2rem" }}>{t.icon}</span>
                            <span style={{ fontSize: "0.72rem", color: t.color, fontWeight: 600 }}>{t.title}</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>{p.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.5 }}>
                            {p.content.replace(/```[\s\S]*?```/g, "[code]").replace(/\*\*/g, "").substring(0, 90)}…
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.8rem", marginTop: "0.5rem" }}>
                    📚 Matching Topics
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1.2rem" }}>
                {filtered.map((t) => (
                  <div key={t.id} onClick={() => goTopic(t)} className="hover-lift" style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                    <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>{t.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "0.3rem" }}>{t.title}</div>
                    <div style={{ fontSize: "0.78rem", color: t.color, fontWeight: 600, marginBottom: "0.6rem" }}>{t.tagline}</div>
                    <div style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "1rem" }}>{t.description.substring(0, 100)}…</div>
                    <span style={{ background: t.lightColor, color: t.color, padding: "0.2rem 0.65rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>{t.pages.length} page{t.pages.length !== 1 ? "s" : ""}</span>
                  </div>
                ))}
                {filtered.length === 0 && !browseSearch && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>No topics found</div>
                  </div>
                )}
                {filtered.length === 0 && browseSearch && (
                  <div style={{ gridColumn: "1/-1", fontSize: "0.83rem", color: "#9CA3AF" }}>No matching topics</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TOPIC VIEW ══════════ */}
        {view === "topic" && activeTopic && (
          <div className="fade-in">
            <div style={{ background: "#fff", padding: "40px 6% 35px", borderBottom: "1px solid #E2E2EC" }}>
              <Breadcrumb items={[{ label: "Home", fn: goHome }, { label: "Browse", fn: () => goBrowse() }, { label: activeTopic.title }]} />
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "1.2rem", flexWrap: "wrap" }}>
                <div style={{ fontSize: "3rem" }}>{activeTopic.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: activeTopic.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                    {CATEGORY_ICONS[activeTopic.category]} {activeTopic.category.toUpperCase()}
                  </div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem" }}>{activeTopic.title}</h1>
                  <p style={{ color: "#6B7280", lineHeight: 1.7, maxWidth: 640 }}>{activeTopic.description}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => { setEditingPage({ title: "", content: "" }); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }} className="btn"
                    style={{ padding: "0.6rem 1.2rem", background: activeTopic.lightColor, color: activeTopic.color, border: `1px solid ${activeTopic.color}30`, fontSize: "0.83rem" }}>
                    ＋ Add Page
                  </button>
                )}
              </div>
            </div>
            <div style={{ padding: "2.5rem 6%" }}>
              {activeTopic.pages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF", border: "2px dashed #E2E2EC", borderRadius: 16 }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📄</div>
                  <div style={{ fontWeight: 600 }}>No pages yet — content coming soon!</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1rem" }}>
                  {activeTopic.pages.map((page) => (
                    <div key={page.id} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div onClick={() => goPage(activeTopic, page)} style={{ flex: 1, cursor: "pointer" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{page.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>Updated: {page.lastUpdated}</div>
                          <div style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: "0.5rem", lineHeight: 1.5 }}>
                            {page.content.replace(/```[\s\S]*?```/g,"[code]").replace(/\*\*/g,"").substring(0,100)}…
                          </div>
                        </div>
                        {isAdmin && (
                          <div style={{ display: "flex", gap: "0.3rem", marginLeft: "0.5rem" }}>
                            <button onClick={() => { setEditingPage(page); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }}
                              style={{ background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 7, padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.78rem" }}>Edit</button>
                            <button onClick={() => deletePage(activeTopic.id, page.id)}
                              style={{ background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.78rem" }}>Del</button>
                          </div>
                        )}
                      </div>
                      <div onClick={() => goPage(activeTopic, page)} style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Read more →</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ PAGE VIEW ══════════ */}
        {view === "page" && activeTopic && activePage && (
          <div className="fade-in">
            <div style={{ background: "#fff", padding: "35px 6% 28px", borderBottom: "1px solid #E2E2EC" }}>
              <Breadcrumb items={[{ label: "Home", fn: goHome }, { label: "Browse", fn: () => goBrowse() }, { label: activeTopic.title, fn: () => goTopic(activeTopic) }, { label: activePage.title }]} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900 }}>{activePage.title}</h1>
                  <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginTop: "0.3rem" }}>From <strong>{activeTopic.title}</strong> · Updated {activePage.lastUpdated}</div>
                </div>
                {isAdmin && (
                  <button onClick={() => { setEditingPage(activePage); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }} className="btn"
                    style={{ padding: "0.5rem 1.1rem", background: "#EFF6FF", color: "#2563EB", fontSize: "0.82rem" }}>✏️ Edit Page</button>
                )}
              </div>
            </div>
            <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 6%" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "2.5rem", lineHeight: 1.8, fontSize: "0.93rem", color: "#2D2D44" }}
                dangerouslySetInnerHTML={{ __html: renderContent(activePage.content) }} />
              <CommentsSection
                pageId={activeTopic.id + "-" + activePage.id}
                pageTitle={activePage.title}
                pageUrl={"https://dbatech-hub.onrender.com/" + activeTopic.id + "/" + activePage.id}
              />
            </div>
          </div>
        )}

        {/* ══════════ ABOUT VIEW ══════════ */}
        {view === "about" && (
          <div className="fade-in">
            <div style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)", padding: "70px 6% 60px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap", position: "relative" }}>
                <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #0891B2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", flexShrink: 0, boxShadow: "0 8px 32px rgba(37,99,235,0.4)", border: "3px solid rgba(255,255,255,0.15)" }}>👨‍💻</div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#60A5FA", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>🌟 Senior Database Administrator</div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "0.6rem" }}>Atif — DBA & IT Professional</h1>
                  <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.7, maxWidth: 520 }}>11+ years of hands-on experience managing enterprise databases, building automation pipelines, and architecting cloud infrastructure.</p>
                  <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
                    <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "#0077B5", color: "#fff", borderRadius: 9, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                      🔗 LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#2563EB", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "1.5rem 6%" }}>
              {[["11+", "Years Experience"], ["5+", "Database Platforms"], ["1000+", "Issues Resolved"], ["∞", "Pages of Knowledge"]].map(([n,l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>{n}</div>
                  <div style={{ fontSize: "0.75rem", color: "#BFDBFE", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "60px 6%", background: "#fff", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ maxWidth: 820, margin: "0 auto" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>📖 My Story</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1.5rem" }}>The Knowledge Sharing Journey</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85 }}>My journey in databases began over <strong>20 years ago</strong>, starting with Oracle in enterprise environments. I've worked across industries managing mission-critical databases, building automation frameworks, and migrating workloads to the cloud.</p>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85 }}>Today this hub covers <strong>Oracle, PostgreSQL, MySQL, MongoDB, SQL Server</strong> — plus <strong>Ansible, Terraform</strong> and <strong>AWS, Azure, and Kubernetes</strong>. My goal: share knowledge freely and help the next generation of DBAs.</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "60px 6%", background: "#FAFAF7" }}>
              <div style={{ maxWidth: 820, margin: "0 auto" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>🛠️ Expertise</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1.8rem" }}>Areas of Specialization</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "1.2rem" }}>
                  {[
                    { icon: "🔴", title: "Oracle DBA",   desc: "RAC, Data Guard, RMAN, PL/SQL, Performance Tuning", color: "#C74634", light: "#FEF2F0" },
                    { icon: "🐘", title: "PostgreSQL",    desc: "Replication, Partitioning, JSON, pgBouncer",         color: "#336791", light: "#EFF6FF" },
                    { icon: "🐬", title: "MySQL",         desc: "InnoDB, Replication, Galera Cluster",                color: "#F29111", light: "#FFFBEB" },
                    { icon: "🪟", title: "SQL Server",    desc: "AlwaysOn, SSRS, SSIS, T-SQL, Azure SQL",            color: "#CC2927", light: "#FEF2F2" },
                    { icon: "🍃", title: "MongoDB",       desc: "Sharding, Replica Sets, Aggregation, Atlas",         color: "#4CAF50", light: "#F0FDF4" },
                    { icon: "⚙️", title: "Automation",    desc: "Ansible, Terraform, CI/CD, Python",                 color: "#7C3AED", light: "#F5F3FF" },
                    { icon: "☁️", title: "Cloud",         desc: "AWS RDS, Azure SQL, GCP, Kubernetes",               color: "#0891B2", light: "#ECFEFF" },
                    { icon: "🐧", title: "Linux Admin",   desc: "RHEL, Ubuntu, Storage, Security Hardening",         color: "#374151", light: "#F9FAFB" },
                  ].map((s) => (
                    <div key={s.title} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.3rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
                      <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{s.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.4rem" }}>{s.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "50px 6%", background: "#EFF6FF", borderTop: "1px solid #BFDBFE", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🤝</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "0.6rem" }}>Let's Connect!</h3>
              <p style={{ color: "#6B7280", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
                Have a question or just want to discuss databases? I'd love to hear from you.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                  style={{ padding: "0.75rem 1.8rem", background: "#0077B5", color: "#fff", borderRadius: 10, fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, textDecoration: "none" }}>
                  🔗 Connect on LinkedIn
                </a>
                <button onClick={() => setView("browse")} style={{ padding: "0.75rem 1.8rem", background: "#fff", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: 10, fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer" }}>
                  📚 Explore Knowledge Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ ADMIN VIEW ══════════ */}
        {view === "admin" && isAdmin && (
          <div className="fade-in">
            <div style={{ background: "#1A1A2E", padding: "35px 6% 28px" }}>
              <Breadcrumb dark items={[{ label: "Home", fn: goHome }, { label: "Admin Panel" }]} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.8rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>🔐 Admin Panel</h1>
                  <p style={{ color: "#9CA3AF", fontSize: "0.83rem", marginTop: "0.2rem" }}>🛡️ Secure session · Auto-expires in {SESSION_HOURS}h</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ padding: "0.5rem 1.1rem", background: "#DC2626", color: "#fff", fontSize: "0.82rem" }}>🚪 Logout</button>
              </div>
            </div>
            {/* Admin tab nav */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E2E2EC", background: "#fff", padding: "0 6%" }}>
              {[["topics","📚 Content"],["scripts","📜 Scripts"],["registrations","🎓 Registrations"],["session-settings","⚙️ Session Settings"]].map(([v,label]) => (
                <button key={v} onClick={() => setAdminView(v)}
                  style={{ padding: "0.85rem 1.2rem", background: "transparent", border: "none", borderBottom: adminView === v ? "2px solid #2563EB" : "2px solid transparent", color: adminView === v ? "#2563EB" : "#6B7280", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: adminView === v ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>

            {adminView === "topics" && (
              <div style={{ padding: "2rem 6%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>All Topics ({topics.length})</h2>
                  <button onClick={() => { setEditingTopic({ title: "", icon: "📘", category: "databases", tagline: "", color: "#2563EB", lightColor: "#EFF6FF", description: "" }); setAdminView("edit-topic"); }} className="btn"
                    style={{ padding: "0.55rem 1.2rem", background: "#2563EB", color: "#fff", fontSize: "0.85rem" }}>＋ New Topic</button>
                </div>
                {DEFAULT_CATEGORIES.map((cat) => {
                  const catTopics = topics.filter((t) => t.category === cat.id);
                  return (
                    <div key={cat.id} style={{ marginBottom: "2rem" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: cat.color, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "0.8rem" }}>{cat.icon} {cat.label}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {catTopics.map((t) => (
                          <div key={t.id} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, padding: "1rem 1.3rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flex: 1 }}>
                              <span style={{ fontSize: "1.4rem" }}>{t.icon}</span>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{t.title}</div>
                                <div style={{ fontSize: "0.77rem", color: "#9CA3AF" }}>{t.pages.length} page{t.pages.length !== 1 ? "s" : ""}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button onClick={() => goTopic(t)} style={{ padding: "0.35rem 0.8rem", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>View</button>
                              <button onClick={() => { setEditingPage({ title: "", content: "" }); setEditingPageTopicId(t.id); setAdminView("edit-page"); }} style={{ padding: "0.35rem 0.8rem", background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>+ Page</button>
                              <button onClick={() => { setEditingTopic(t); setAdminView("edit-topic"); }} style={{ padding: "0.35rem 0.8rem", background: "#F0FDF4", color: "#16A34A", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Edit</button>
                              <button onClick={() => deleteTopic(t.id)} style={{ padding: "0.35rem 0.8rem", background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Del</button>
                            </div>
                          </div>
                        ))}
                        {catTopics.length === 0 && <div style={{ fontSize: "0.83rem", color: "#9CA3AF" }}>No topics yet.</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {adminView === "edit-topic" && editingTopic !== null && (
              <TopicEditor topic={editingTopic} onSave={saveTopic} onCancel={() => { setAdminView("topics"); setEditingTopic(null); }} categories={DEFAULT_CATEGORIES} />
            )}
            {adminView === "edit-page" && editingPage !== null && (
              <PageEditor page={editingPage} topicId={editingPageTopicId} topics={topics} onSave={savePage} onCancel={() => { setAdminView("topics"); setEditingPage(null); setEditingPageTopicId(null); }} />
            )}
            {/* ══ SCRIPTS ADMIN VIEW ══ */}
            {adminView === "scripts" && (
              <div style={{ padding: "2rem 6%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Script Library Management</h2>
                  <button onClick={() => { setEditingScript({ title: "", description: "", extension: "sql", code: "" }); setEditingScriptCat(scripts[0]?.id); setAdminView("edit-script"); }} className="btn"
                    style={{ padding: "0.55rem 1.2rem", background: "#2563EB", color: "#fff", fontSize: "0.85rem" }}>＋ New Script</button>
                </div>
                {scripts.map(cat => (
                  <div key={cat.id} style={{ marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: cat.color, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "0.8rem" }}>{cat.icon} {cat.label} ({cat.scripts.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {cat.scripts.map(s => (
                        <div key={s.id} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 10, padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.7rem", fontFamily: "'DM Mono',monospace", background: "#F3F4F6", color: "#6B7280", padding: "0.15rem 0.5rem", borderRadius: 4, flexShrink: 0 }}>.{s.extension}</span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                            <button onClick={() => { openScript(s); setScriptCat(cat); setView("scripts"); }} style={{ padding: "0.3rem 0.7rem", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>View</button>
                            <button onClick={() => { setEditingScript(s); setEditingScriptCat(cat.id); setAdminView("edit-script"); }} style={{ padding: "0.3rem 0.7rem", background: "#F0FDF4", color: "#16A34A", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Edit</button>
                            <button onClick={() => deleteScriptItem(cat.id, s.id)} style={{ padding: "0.3rem 0.7rem", background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Del</button>
                          </div>
                        </div>
                      ))}
                      {cat.scripts.length === 0 && <div style={{ fontSize: "0.82rem", color: "#9CA3AF", padding: "0.5rem 0" }}>No scripts yet.</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "edit-script" && editingScript !== null && (
              <ScriptEditor
                script={editingScript}
                catId={editingScriptCat}
                categories={scripts}
                onSave={saveScriptItem}
                onCancel={() => { setAdminView("scripts"); setEditingScript(null); }}
              />
            )}

            {/* ══ REGISTRATIONS VIEW ══ */}
            {adminView === "registrations" && <RegistrationsPanel />}

            {/* ══ SESSION SETTINGS VIEW ══ */}
            {adminView === "session-settings" && <SessionSettingsPanel onSaved={() => { showToast("✅ Session settings saved! Reload session.html to see changes."); }} />}

          </div>
        )}

        {/* ══════════ SCRIPTS VIEW ══════════ */}
        {view === "scripts" && (
          <div className="fade-in">
            <div style={{ background: "#fff", padding: "32px 6% 0", borderBottom: "1px solid #E2E2EC" }}>
              <Breadcrumb items={[{ label: "Home", fn: goHome }, { label: "Scripts" }]} />
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginTop: "0.8rem", marginBottom: "1rem" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900 }}>Script Library</h1>
                <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{scripts.reduce((a,c) => a + c.scripts.length, 0)} scripts</span>
              </div>
              {/* Category tabs */}
              <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
                {scripts.map(cat => (
                  <button key={cat.id} onClick={() => { setScriptCat(cat); setActiveScript(null); }}
                    style={{ padding: "0.75rem 1.1rem", background: "transparent", border: "none", borderBottom: scriptCat?.id === cat.id ? `2px solid ${cat.color}` : "2px solid transparent", color: scriptCat?.id === cat.id ? cat.color : "#6B7280", fontFamily: "inherit", fontSize: "0.83rem", fontWeight: scriptCat?.id === cat.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.15s" }}>
                    {cat.icon} {cat.label}
                    <span style={{ background: scriptCat?.id === cat.id ? cat.color + "20" : "#F3F4F6", color: scriptCat?.id === cat.id ? cat.color : "#9CA3AF", fontSize: "0.68rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 100 }}>{cat.scripts.length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: activeScript ? "280px 1fr" : "1fr", gap: 0, minHeight: "60vh" }}>
              {/* Script list sidebar */}
              <div style={{ borderRight: "1px solid #E2E2EC", background: "#FAFAF7" }}>
                {(scriptCat || scripts[0])?.scripts.map(s => (
                  <div key={s.id} onClick={() => openScript(s)}
                    style={{ padding: "1rem 1.2rem", borderBottom: "1px solid #E2E2EC", cursor: "pointer", background: activeScript?.id === s.id ? "#fff" : "transparent", borderLeft: activeScript?.id === s.id ? `3px solid ${(scriptCat || scripts[0]).color}` : "3px solid transparent", transition: "all 0.12s" }}
                    onMouseEnter={e => { if (activeScript?.id !== s.id) e.currentTarget.style.background = "#F0F0F8"; }}
                    onMouseLeave={e => { if (activeScript?.id !== s.id) e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1A1A2E", marginBottom: "0.2rem" }}>{s.title}</div>
                    <div style={{ fontSize: "0.76rem", color: "#9CA3AF", lineHeight: 1.4 }}>{s.description}</div>
                    <div style={{ marginTop: "0.4rem" }}>
                      <span style={{ fontSize: "0.68rem", fontFamily: "'DM Mono', monospace", background: "#F3F4F6", color: "#6B7280", padding: "0.1rem 0.4rem", borderRadius: 4 }}>.{s.extension}</span>
                    </div>
                  </div>
                ))}
                {(scriptCat || scripts[0])?.scripts.length === 0 && (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.83rem" }}>No scripts yet in this category</div>
                )}
              </div>

              {/* Script viewer */}
              {activeScript ? (
                <div style={{ background: "#fff" }}>
                  <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #E2E2EC", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: (scriptCat || scripts[0]).color, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{(scriptCat || scripts[0]).icon} {(scriptCat || scripts[0]).label}</div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#1A1A2E" }}>{activeScript.title}</h2>
                      <p style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: "0.3rem" }}>{activeScript.description}</p>
                    </div>
                    <CopyButton text={activeScript.code} />
                  </div>
                  <div style={{ padding: "1.5rem 2rem" }}>
                    <pre style={{ background: "#1e1e2e", color: "#cdd6f4", padding: "1.5rem", borderRadius: 12, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", lineHeight: 1.8, overflowX: "auto", border: "1px solid #313244", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      <code>{activeScript.code}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.88rem", flexDirection: "column", gap: "0.8rem", padding: "4rem" }}>
                  <div style={{ fontSize: "3rem" }}>👈</div>
                  <div>Select a script to view it</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Redirect to home if someone tries to access /admin without being logged in */}
        {view === "admin" && !isAdmin && (() => { setView("home"); return null; })()}


      </main>

      {/* ✅ STATS FOOTER — always at the bottom of every page */}
      <StatsFooter topics={topics} />

    </div>
  );
}

// ── SUB COMPONENTS ─────────────────────────────────────────────────────
function Breadcrumb({ items, dark }) {
  return (
    <div style={{ fontSize: "0.8rem", color: dark ? "#6B7280" : "#9CA3AF", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: "0 0.2rem", opacity: 0.5 }}>/</span>}
          {item.fn
            ? <span onClick={item.fn} style={{ cursor: "pointer", color: dark ? "#9CA3AF" : "#2563EB" }}>{item.label}</span>
            : <span style={{ color: dark ? "#E5E7EB" : "#374151", fontWeight: 600 }}>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

function TopicEditor({ topic, onSave, onCancel, categories }) {
  const [form, setForm] = useState({ ...topic });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 6%" }}>
      <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1.5rem" }}>{form.id ? "Edit Topic" : "New Topic"}</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
          <Field label="Icon (emoji)" value={form.icon} onChange={(v) => set("icon", v)} />
        </div>
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4 }}>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.88rem", background: "#FAFAF7" }}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Accent Color (hex)" value={form.color} onChange={(v) => set("color", v)} placeholder="#2563EB" />
          <Field label="Light Color (hex)" value={form.lightColor} onChange={(v) => set("lightColor", v)} placeholder="#EFF6FF" />
        </div>
        <Field label="Description" value={form.description} onChange={(v) => set("description", v)} multiline />
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button onClick={() => onSave(form)} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>Save Topic</button>
          <button onClick={onCancel} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#F3F4F6", color: "#374151", fontSize: "0.92rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PageEditor({ page, topicId, topics, onSave, onCancel }) {
  const [form, setForm] = useState({ ...page });
  const [tid, setTid]   = useState(topicId || topics[0]?.id || "");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 6%" }}>
      <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.4rem" }}>{form.id ? "Edit Knowledge Page" : "New Knowledge Page"}</h2>
      <p style={{ fontSize: "0.83rem", color: "#6B7280", marginBottom: "1.5rem" }}>Supports <strong>**bold**</strong>, code blocks (```lang), and bullet lists (- item)</p>
      <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4 }}>Topic</label>
          <select value={tid} onChange={(e) => setTid(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.88rem", background: "#FAFAF7" }}>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
          </select>
        </div>
        <Field label="Page Title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Advanced Indexing Strategies" />
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4 }}>Content</label>
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)}
            placeholder={"Write your knowledge here...\n\nSupports:\n**bold text**\n- bullet lists\n```sql\nSELECT * FROM table;\n```"}
            style={{ width: "100%", minHeight: 340, padding: "0.85rem 1rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", background: "#FAFAF7", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button onClick={() => onSave(tid, form)} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>💾 Save Page</button>
          <button onClick={onCancel} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#F3F4F6", color: "#374151", fontSize: "0.92rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, placeholder }) {
  const style = { width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.88rem", background: "#FAFAF7", lineHeight: 1.6 };
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...style, minHeight: 90 }} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={style} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 💬 COMMENTS COMPONENT
// ══════════════════════════════════════════════════════════════════════
const DISQUS_SHORTNAME = "YOUR_DISQUS_SHORTNAME";

export function CommentsSection({ pageId, pageTitle, pageUrl }) {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow]     = useState(false);

  useEffect(() => {
    if (!show || loaded) return;
    window.disqus_config = function () {
      this.page.url        = pageUrl || window.location.href;
      this.page.identifier = pageId;
      this.page.title      = pageTitle;
    };
    const script = document.createElement("script");
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", +new Date());
    script.async = true;
    document.body.appendChild(script);
    setLoaded(true);
  }, [show, loaded, pageId, pageTitle, pageUrl]);

  return (
    <div style={{ marginTop: "3rem", borderTop: "1px solid #E2E2EC", paddingTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#1A1A2E" }}>💬 Comments & Discussion</h3>
          <p style={{ fontSize: "0.82rem", color: "#9CA3AF", marginTop: "0.2rem" }}>Questions or feedback? Leave a comment below!</p>
        </div>
        {!show && (
          <button onClick={() => setShow(true)} style={{ padding: "0.6rem 1.2rem", background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            Show Comments
          </button>
        )}
      </div>
      {show && (
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "1.5rem" }}>
          {DISQUS_SHORTNAME === "YOUR_DISQUS_SHORTNAME" ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "#374151" }}>Comments Not Configured Yet</div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                Register free at <strong style={{ color: "#2563EB" }}>disqus.com</strong> → Create a site → Get your shortname →<br/>
                Replace <code style={{ background: "#F3F4F6", padding: "0.1rem 0.4rem", borderRadius: 4 }}>YOUR_DISQUS_SHORTNAME</code> in App.jsx
              </div>
            </div>
          ) : (
            <div id="disqus_thread" />
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 🎓 REGISTRATIONS PANEL — view all session sign-ups
// ══════════════════════════════════════════════════════════════════════
function RegistrationsPanel() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.storage.get("oracle-session-regs", true)
      .then(r => { if (r) setRegs(JSON.parse(r.value)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const expLevel = { beginner: "🟢 Beginner", intermediate: "🟡 Intermediate", experienced: "🟠 Experienced", senior: "🔴 Senior" };

  const copyCSV = () => {
    const headers = "Full Name,Email,Phone,Address,Company,Job Title,Experience,Registered At";
    const rows = regs.map(r => [r.fullName,r.email,r.phone,r.address,r.company,r.jobTitle,r.experience,r.registeredAt].map(v => `"${(v||"").replace(/"/g,'""')}"`).join(","));
    navigator.clipboard.writeText([headers,...rows].join("\n"));
  };

  if (loading) return <div style={{ padding: "3rem 6%", color: "#9CA3AF" }}>Loading registrations…</div>;

  return (
    <div style={{ padding: "2rem 6%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Session Registrations</h2>
          <p style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: 3 }}>{regs.length} total registrant{regs.length !== 1 ? "s" : ""}</p>
        </div>
        {regs.length > 0 && (
          <button onClick={copyCSV} className="btn" style={{ padding: "0.5rem 1.1rem", background: "#F0FDF4", color: "#16A34A", border: "1px solid #86EFAC", fontSize: "0.82rem" }}>
            📋 Copy as CSV
          </button>
        )}
      </div>

      {regs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "#FAFAF7", borderRadius: 14, border: "1px dashed #E2E2EC" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <div style={{ fontWeight: 600, color: "#374151", marginBottom: "0.4rem" }}>No registrations yet</div>
          <div style={{ fontSize: "0.83rem", color: "#9CA3AF" }}>Share the session page link to start collecting sign-ups</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0.8rem", marginBottom: "1rem" }}>
            {[
              { label: "Total Registered", value: regs.length, color: "#2563EB", bg: "#EFF6FF" },
              { label: "Beginners",       value: regs.filter(r=>r.experience==="beginner").length,     color: "#16A34A", bg: "#F0FDF4" },
              { label: "Intermediate",    value: regs.filter(r=>r.experience==="intermediate").length,  color: "#D97706", bg: "#FFFBEB" },
              { label: "Experienced+",    value: regs.filter(r=>["experienced","senior"].includes(r.experience)).length, color: "#C74634", bg: "#FEF2F0" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "1rem 1.2rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Registrant list */}
          {regs.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 12, padding: "1rem 1.3rem", cursor: "pointer", transition: "box-shadow 0.15s" }}
              onClick={() => setSelected(selected === i ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>
                    {(r.fullName||"?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{r.fullName}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{r.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", background: "#F3F4F6", color: "#374151", padding: "0.2rem 0.6rem", borderRadius: 100 }}>{expLevel[r.experience] || r.experience}</span>
                  <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>{selected === i ? "▲" : "▼"}</span>
                </div>
              </div>
              {selected === i && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #F3F4F6", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.6rem" }}>
                  {[["📞 Phone", r.phone], ["🏢 Company", r.company], ["💼 Job Title", r.jobTitle], ["📍 Address", r.address], ["🕐 Registered", r.registeredAt ? new Date(r.registeredAt).toLocaleString() : "—"]].map(([label, val]) => val && (
                    <div key={label} style={{ fontSize: "0.8rem" }}>
                      <div style={{ color: "#9CA3AF", marginBottom: 2 }}>{label}</div>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ⚙️ SESSION SETTINGS PANEL — customize session.html from admin
// ══════════════════════════════════════════════════════════════════════
const DEFAULT_SESSION_SETTINGS = {
  date:       "TBA — Date to be announced soon",
  time:       "TBA",
  teamsLink:  "https://teams.microsoft.com/l/meetup-join/YOUR_LINK_HERE",
  spots:      "30",
  accentColor:"#C74634",
  topics: [
    "Common Oracle errors and how to diagnose them quickly in production",
    "Reading and interpreting Oracle alert logs — what to look for",
    "Top 10 most frequent ORA- error codes and their root causes",
    "Tablespace & space management issues — detection and resolution",
    "Session & locking troubleshooting — find and kill blocking sessions",
    "Quick performance checks using AWR/ASH snapshots",
  ],
};

function SessionSettingsPanel({ onSaved }) {
  const [cfg, setCfg] = useState(DEFAULT_SESSION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  useEffect(() => {
    window.storage.get("session-config")
      .then(r => { if (r) setCfg({ ...DEFAULT_SESSION_SETTINGS, ...JSON.parse(r.value) }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await window.storage.set("session-config", JSON.stringify(cfg));
      onSaved();
    } catch {}
    setSaving(false);
  };

  const updateTopic = (i, val) => {
    const t = [...cfg.topics]; t[i] = val; set("topics", t);
  };
  const addTopic    = () => set("topics", [...cfg.topics, ""]);
  const removeTopic = (i) => set("topics", cfg.topics.filter((_, idx) => idx !== i));

  if (loading) return <div style={{ padding: "3rem 6%", color: "#9CA3AF" }}>Loading settings…</div>;

  const Field = ({ label, hint, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: "1.2rem" }}>
      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>{label}</label>
      {hint && <span style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: -3 }}>{hint}</span>}
      {children}
    </div>
  );

  const Input = ({ value, onChange, placeholder, type="text" }) => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ padding: "0.7rem 0.9rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.88rem", outline: "none", fontFamily: "inherit" }}
      onFocus={e => e.target.style.borderColor = "#2563EB"}
      onBlur={e => e.target.style.borderColor = "#E2E2EC"} />
  );

  return (
    <div style={{ padding: "2rem 6%" }}>
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Session Page Settings</h2>
            <p style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: 3 }}>Changes apply to session.html instantly — no code editing needed</p>
          </div>
          <button onClick={save} disabled={saving} className="btn"
            style={{ padding: "0.6rem 1.4rem", background: saving ? "#93C5FD" : "#2563EB", color: "#fff", fontSize: "0.88rem" }}>
            {saving ? "Saving…" : "💾 Save Settings"}
          </button>
        </div>

        {/* Date & Time */}
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", marginBottom: "1.2rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A1A2E", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid #F3F4F6" }}>📅 Date & Time</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Session Date" hint='e.g. "Saturday, 15 March 2026" or "TBA"'>
              <Input value={cfg.date} onChange={v => set("date", v)} placeholder="Saturday, 15 March 2026" />
            </Field>
            <Field label="Session Time" hint='e.g. "2:00 PM — 3:00 PM GMT"'>
              <Input value={cfg.time} onChange={v => set("time", v)} placeholder="2:00 PM — 3:00 PM GMT" />
            </Field>
          </div>
        </div>

        {/* Teams Link & Spots */}
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", marginBottom: "1.2rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A1A2E", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid #F3F4F6" }}>🔗 Meeting & Spots</div>
          <Field label="Microsoft Teams Meeting Link" hint="Paste your full Teams invite link here">
            <Input value={cfg.teamsLink} onChange={v => set("teamsLink", v)} placeholder="https://teams.microsoft.com/l/meetup-join/..." />
          </Field>
          <Field label="Total Available Spots" hint="Number of seats you want to offer">
            <Input value={cfg.spots} onChange={v => set("spots", v)} placeholder="30" type="number" />
          </Field>
        </div>

        {/* Accent Colour */}
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", marginBottom: "1.2rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A1A2E", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid #F3F4F6" }}>🎨 Page Theme</div>
          <Field label="Accent Colour" hint="Used for the session title highlight and buttons">
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <input type="color" value={cfg.accentColor} onChange={e => set("accentColor", e.target.value)}
                style={{ width: 48, height: 38, border: "1.5px solid #E2E2EC", borderRadius: 8, cursor: "pointer", padding: 2 }} />
              <span style={{ fontSize: "0.85rem", color: "#374151", fontFamily: "monospace" }}>{cfg.accentColor}</span>
              <div style={{ width: 80, height: 32, borderRadius: 8, background: cfg.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", color: "#fff", fontWeight: 700 }}>Preview</div>
              {[["Oracle Red","#C74634"],["Blue","#2563EB"],["Purple","#7C3AED"],["Green","#16A34A"],["Dark","#1A1A2E"]].map(([name, hex]) => (
                <div key={hex} onClick={() => set("accentColor", hex)} title={name}
                  style={{ width: 26, height: 26, borderRadius: "50%", background: hex, cursor: "pointer", border: cfg.accentColor === hex ? "2px solid #1A1A2E" : "2px solid transparent", transition: "transform 0.15s" }}
                  onMouseEnter={e => e.target.style.transform="scale(1.15)"} onMouseLeave={e => e.target.style.transform="scale(1)"} />
              ))}
            </div>
          </Field>
        </div>

        {/* Topics */}
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A1A2E" }}>📚 Session Topics</div>
            <button onClick={addTopic} className="btn" style={{ padding: "0.3rem 0.8rem", background: "#EFF6FF", color: "#2563EB", fontSize: "0.78rem" }}>＋ Add Topic</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {cfg.topics.map((topic, i) => (
              <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <input value={topic} onChange={e => updateTopic(i, e.target.value)}
                  style={{ flex: 1, padding: "0.6rem 0.85rem", border: "1.5px solid #E2E2EC", borderRadius: 8, fontSize: "0.85rem", outline: "none", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor="#2563EB"} onBlur={e => e.target.style.borderColor="#E2E2EC"} />
                <button onClick={() => removeTopic(i)} style={{ padding: "0.4rem 0.6rem", background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn"
          style={{ padding: "0.75rem 2rem", background: saving ? "#93C5FD" : "#2563EB", color: "#fff", fontSize: "0.95rem", width: "100%" }}>
          {saving ? "Saving…" : "💾 Save All Settings"}
        </button>
        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center", marginTop: "0.8rem" }}>
          After saving, reload your session.html page to see the changes live
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 📋 COPY BUTTON
// ══════════════════════════════════════════════════════════════════════
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} className="btn"
      style={{ padding: "0.5rem 1.1rem", background: copied ? "#F0FDF4" : "#F3F4F6", color: copied ? "#16A34A" : "#374151", border: `1px solid ${copied ? "#86EFAC" : "#E2E2EC"}`, fontSize: "0.82rem", flexShrink: 0, transition: "all 0.2s" }}>
      {copied ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ✏️ SCRIPT EDITOR — Admin add/edit scripts
// ══════════════════════════════════════════════════════════════════════
function ScriptEditor({ script, catId, categories, onSave, onCancel }) {
  const [form, setForm] = useState({ ...script });
  const [selectedCat, setSelectedCat] = useState(catId || categories[0]?.id);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const extOptions = ["sql", "sh", "yaml", "tf", "py", "txt", "bash"];

  return (
    <div style={{ padding: "2rem 6%" }}>
      <div style={{ maxWidth: 860 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{script.id ? "Edit Script" : "New Script"}</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "0.85rem" }}>✕ Cancel</button>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Category</label>
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                style={{ padding: "0.65rem 0.85rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", fontFamily: "inherit", outline: "none" }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            {/* Extension */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>File Type</label>
              <select value={form.extension} onChange={e => set("extension", e.target.value)}
                style={{ padding: "0.65rem 0.85rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", fontFamily: "inherit", outline: "none" }}>
                {extOptions.map(e => <option key={e} value={e}>.{e}</option>)}
              </select>
            </div>
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Script Title <span style={{ color: "#EF4444" }}>*</span></label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Check Tablespace Size"
              style={{ padding: "0.65rem 0.85rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", fontFamily: "inherit", outline: "none" }}
              onFocus={e => e.target.style.borderColor="#2563EB"} onBlur={e => e.target.style.borderColor="#E2E2EC"} />
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Short Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. Shows used and free space per tablespace"
              style={{ padding: "0.65rem 0.85rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", fontFamily: "inherit", outline: "none" }}
              onFocus={e => e.target.style.borderColor="#2563EB"} onBlur={e => e.target.style.borderColor="#E2E2EC"} />
          </div>

          {/* Code */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Script Code <span style={{ color: "#EF4444" }}>*</span></label>
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Paste your script here — no formatting needed</span>
            </div>
            <textarea value={form.code} onChange={e => set("code", e.target.value)}
              placeholder={"-- Paste your script here\nSELECT * FROM v$instance;"}
              rows={16}
              style={{ padding: "0.9rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.82rem", fontFamily: "'DM Mono', monospace", lineHeight: 1.7, outline: "none", background: "#1e1e2e", color: "#cdd6f4", resize: "vertical" }}
              onFocus={e => e.target.style.borderColor="#2563EB"} onBlur={e => e.target.style.borderColor="#E2E2EC"} />
          </div>

          {/* Preview */}
          {form.code && (
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.5rem" }}>Preview</div>
              <pre style={{ background: "#1e1e2e", color: "#cdd6f4", padding: "1rem", borderRadius: 10, fontSize: "0.8rem", lineHeight: 1.7, overflow: "auto", maxHeight: 200, border: "1px solid #313244", whiteSpace: "pre-wrap" }}>
                <code>{form.code}</code>
              </pre>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.8rem", paddingTop: "0.5rem" }}>
            <button onClick={() => { if (!form.title.trim() || !form.code.trim()) return; onSave(selectedCat, form); }} className="btn"
              style={{ flex: 1, padding: "0.75rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>
              💾 Save Script
            </button>
            <button onClick={onCancel} className="btn"
              style={{ flex: 1, padding: "0.75rem", background: "#F3F4F6", color: "#374151", fontSize: "0.92rem" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
