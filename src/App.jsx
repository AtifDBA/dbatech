import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SECURITY CONFIG — CHANGE THIS PASSWORD BEFORE DEPLOYING!
// ══════════════════════════════════════════════════════════════════════
const ADMIN_PASSWORD = "";
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

// ══════════════════════════════════════════════════════════════════════
// 📜 SCRIPT LIBRARY DATA
// ══════════════════════════════════════════════════════════════════════
const SCRIPT_CATEGORIES = [
  { id: "oracle",     label: "Oracle",      icon: "🔴", color: "#C74634", light: "#FEF2F0" },
  { id: "sqlserver",  label: "SQL Server",  icon: "🪟", color: "#CC2927", light: "#FEF2F2" },
  { id: "postgresql", label: "PostgreSQL",  icon: "🐘", color: "#336791", light: "#EFF6FF" },
  { id: "mysql",      label: "MySQL",       icon: "🐬", color: "#E8960C", light: "#FFFBEB" },
  { id: "mongodb",    label: "MongoDB",     icon: "🍃", color: "#3D8A40", light: "#F0FDF4" },
  { id: "linux",      label: "Linux",       icon: "🐧", color: "#374151", light: "#F9FAFB" },
];

const DEFAULT_SCRIPTS = [
  // ── ORACLE ──
  { id: "ora-session-kill", category: "oracle", title: "Kill Blocking Sessions", description: "Find and kill all blocking sessions in Oracle.", lang: "sql",
    code: `-- Find blocking sessions\nSELECT s.sid, s.serial#, s.username, s.status, s.blocking_session\nFROM v$session s\nWHERE s.blocking_session IS NOT NULL;\n\n-- Kill a specific session\nALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;` },
  { id: "ora-top-sql", category: "oracle", title: "Top SQL by CPU", description: "List top 10 SQL statements consuming the most CPU.", lang: "sql",
    code: `SELECT * FROM (\n  SELECT sql_id, elapsed_time/executions AS avg_elapsed,\n         cpu_time/executions AS avg_cpu,\n         executions, substr(sql_text,1,80) AS sql_preview\n  FROM v$sqlstats\n  WHERE executions > 0\n  ORDER BY cpu_time DESC\n) WHERE ROWNUM <= 10;` },
  { id: "ora-tablespace", category: "oracle", title: "Tablespace Usage", description: "Check free and used space across all tablespaces.", lang: "sql",
    code: `SELECT df.tablespace_name,\n       ROUND(df.totalspace/1024/1024,2) AS total_mb,\n       ROUND(fs.freespace/1024/1024,2) AS free_mb,\n       ROUND((df.totalspace-fs.freespace)/df.totalspace*100,1) AS pct_used\nFROM\n  (SELECT tablespace_name, SUM(bytes) totalspace FROM dba_data_files GROUP BY tablespace_name) df,\n  (SELECT tablespace_name, SUM(bytes) freespace FROM dba_free_space GROUP BY tablespace_name) fs\nWHERE df.tablespace_name = fs.tablespace_name(+)\nORDER BY pct_used DESC NULLS LAST;` },
  { id: "ora-rman-backup", category: "oracle", title: "RMAN Full Backup", description: "RMAN script for full database backup with compression.", lang: "bash",
    code: `#!/bin/bash\nrman target / <<EOF\nRUN {\n  CONFIGURE COMPRESSION ALGORITHM 'MEDIUM';\n  CONFIGURE BACKUP OPTIMIZATION ON;\n  BACKUP AS COMPRESSED BACKUPSET\n    FULL DATABASE\n    FORMAT '/backup/oracle/%d_%T_%s.bkp'\n    TAG 'FULL_DB_BACKUP';\n  BACKUP ARCHIVELOG ALL\n    FORMAT '/backup/oracle/arch_%d_%T_%s.bkp'\n    DELETE INPUT;\n  DELETE NOPROMPT OBSOLETE;\n}\nEOF` },
  { id: "ora-invalid-objects", category: "oracle", title: "Recompile Invalid Objects", description: "Find and recompile all invalid database objects.", lang: "sql",
    code: `-- List all invalid objects\nSELECT owner, object_type, object_name, status\nFROM dba_objects\nWHERE status = 'INVALID'\nORDER BY owner, object_type, object_name;\n\n-- Recompile all invalid objects\nBEGIN\n  FOR obj IN (SELECT owner, object_name, object_type\n               FROM dba_objects WHERE status='INVALID') LOOP\n    BEGIN\n      EXECUTE IMMEDIATE 'ALTER ' || obj.object_type ||\n        ' ' || obj.owner || '.' || obj.object_name || ' COMPILE';\n    EXCEPTION WHEN OTHERS THEN NULL;\n    END;\n  END LOOP;\nEND;\n/` },

  // ── SQL SERVER ──
  { id: "mssql-blocking", category: "sqlserver", title: "Find Blocking Queries", description: "Identify blocking chains and long-running queries.", lang: "sql",
    code: `SELECT\n  blocking.session_id AS blocker_id,\n  blocked.session_id  AS blocked_id,\n  blocked.wait_time/1000 AS wait_sec,\n  blocked.wait_type,\n  SUBSTRING(bt.text, 1, 200) AS blocker_sql,\n  SUBSTRING(bkt.text,1, 200) AS blocked_sql\nFROM sys.dm_exec_sessions AS blocking\nJOIN sys.dm_exec_requests AS blocked ON blocking.session_id = blocked.blocking_session_id\nCROSS APPLY sys.dm_exec_sql_text(blocking.most_recent_sql_handle) bt\nCROSS APPLY sys.dm_exec_sql_text(blocked.sql_handle) bkt\nORDER BY blocked.wait_time DESC;` },
  { id: "mssql-index-missing", category: "sqlserver", title: "Missing Index Suggestions", description: "Show SQL Server's missing index recommendations with impact score.", lang: "sql",
    code: `SELECT TOP 20\n  ROUND(migs.avg_total_user_cost * migs.avg_user_impact * (migs.user_seeks + migs.user_scans), 0) AS impact_score,\n  mid.statement AS table_name,\n  mid.equality_columns,\n  mid.inequality_columns,\n  mid.included_columns,\n  migs.user_seeks,\n  migs.user_scans\nFROM sys.dm_db_missing_index_group_stats migs\nJOIN sys.dm_db_missing_index_groups mig ON migs.group_handle = mig.index_group_handle\nJOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle\nORDER BY impact_score DESC;` },
  { id: "mssql-backup", category: "sqlserver", title: "Full + Log Backup Script", description: "Backup all user databases with timestamp in filename.", lang: "sql",
    code: `-- Full backup all user databases\nDECLARE @db NVARCHAR(128), @path NVARCHAR(500);\nDECLARE db_cursor CURSOR FOR\n  SELECT name FROM sys.databases\n  WHERE database_id > 4 AND state_desc = 'ONLINE';\nOPEN db_cursor; FETCH NEXT FROM db_cursor INTO @db;\nWHILE @@FETCH_STATUS = 0 BEGIN\n  SET @path = 'D:\\Backups\\' + @db + '_' +\n    REPLACE(CONVERT(VARCHAR,GETDATE(),120),':','-') + '.bak';\n  EXEC('BACKUP DATABASE [' + @db + '] TO DISK=''' + @path +\n    ''' WITH COMPRESSION, STATS=10');\n  FETCH NEXT FROM db_cursor INTO @db;\nEND\nCLOSE db_cursor; DEALLOCATE db_cursor;` },

  // ── POSTGRESQL ──
  { id: "pg-bloat", category: "postgresql", title: "Table Bloat Check", description: "Find tables with excessive dead tuples needing VACUUM.", lang: "sql",
    code: `SELECT\n  schemaname, relname AS table_name,\n  n_dead_tup AS dead_tuples,\n  n_live_tup AS live_tuples,\n  ROUND(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup,0)*100,1) AS dead_pct,\n  last_vacuum, last_autovacuum\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 1000\nORDER BY dead_pct DESC NULLS LAST\nLIMIT 20;` },
  { id: "pg-long-queries", category: "postgresql", title: "Long Running Queries", description: "Show queries running longer than 5 minutes.", lang: "sql",
    code: `SELECT\n  pid, now() - pg_stat_activity.query_start AS duration,\n  query, state, wait_event_type, wait_event, usename, application_name\nFROM pg_stat_activity\nWHERE (now() - pg_stat_activity.query_start) > INTERVAL '5 minutes'\n  AND state != 'idle'\nORDER BY duration DESC;` },
  { id: "pg-index-usage", category: "postgresql", title: "Unused Indexes", description: "Find indexes that are never or rarely used.", lang: "sql",
    code: `SELECT\n  schemaname, relname AS table_name,\n  indexrelname AS index_name,\n  idx_scan AS times_used,\n  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size\nFROM pg_stat_user_indexes\nJOIN pg_index USING (indexrelid)\nWHERE idx_scan < 10\n  AND NOT indisprimary\n  AND NOT indisunique\nORDER BY pg_relation_size(indexrelid) DESC\nLIMIT 20;` },

  // ── MYSQL ──
  { id: "mysql-slow", category: "mysql", title: "Enable Slow Query Log", description: "Enable and configure the MySQL slow query log.", lang: "sql",
    code: `-- Enable slow query log\nSET GLOBAL slow_query_log = 'ON';\nSET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';\nSET GLOBAL long_query_time = 2;      -- seconds\nSET GLOBAL log_queries_not_using_indexes = 'ON';\n\n-- Check current status\nSHOW VARIABLES LIKE 'slow_query%';\nSHOW VARIABLES LIKE 'long_query_time';` },
  { id: "mysql-replication", category: "mysql", title: "Replication Status Check", description: "Full replication health check including lag and errors.", lang: "sql",
    code: `-- On replica server\nSHOW SLAVE STATUS\\G\n\n-- Key fields to check:\n-- Slave_IO_Running: Yes\n-- Slave_SQL_Running: Yes\n-- Seconds_Behind_Master: 0 (ideally)\n-- Last_Error: (should be empty)\n\n-- Check replication lag\nSELECT\n  SERVICE_STATE, LAST_ERROR_NUMBER, LAST_ERROR_MESSAGE,\n  LAST_HEARTBEAT_TIMESTAMP\nFROM performance_schema.replication_connection_status;` },

  // ── MONGODB ──
  { id: "mongo-stats", category: "mongodb", title: "Collection Stats & Size", description: "Get size, document count and index info for all collections.", lang: "javascript",
    code: `// Run in mongosh\ndb.getCollectionNames().forEach(function(col) {\n  const stats = db[col].stats();\n  print(col + ':');\n  print('  Documents : ' + stats.count);\n  print('  Data Size : ' + (stats.size/1024/1024).toFixed(2) + ' MB');\n  print('  Index Size: ' + (stats.totalIndexSize/1024/1024).toFixed(2) + ' MB');\n  print('  Indexes   : ' + stats.nindexes);\n  print('---');\n});` },
  { id: "mongo-slow-ops", category: "mongodb", title: "Find Slow Operations", description: "Profile and find slow queries in MongoDB.", lang: "javascript",
    code: `// Enable profiling (level 1 = slow ops only)\nuse myDatabase\ndb.setProfilingLevel(1, { slowms: 100 })\n\n// Find slowest recent operations\ndb.system.profile.find(\n  { millis: { $gt: 100 } },\n  { op: 1, ns: 1, millis: 1, command: 1, ts: 1 }\n).sort({ millis: -1 }).limit(10).pretty()\n\n// Check replication lag\nrs.printSecondaryReplicationInfo()` },

  // ── LINUX ──
  { id: "linux-disk", category: "linux", title: "Disk & I/O Analysis", description: "Comprehensive disk usage, I/O wait and top consumers.", lang: "bash",
    code: `#!/bin/bash\n# Disk usage overview\necho "=== Disk Usage ==="\ndf -hT | grep -v tmpfs\n\n# Top 10 largest directories\necho "\\n=== Top 10 Largest Dirs ==="\ndu -sh /* 2>/dev/null | sort -rh | head -10\n\n# I/O stats (requires sysstat)\necho "\\n=== I/O Stats (5 snapshots) ==="\niostat -xz 2 5\n\n# Processes with most I/O\necho "\\n=== Top I/O Processes ==="\niostat -p ALL | sort -k6 -rn | head -15` },
  { id: "linux-memory", category: "linux", title: "Memory Usage & Leak Check", description: "Analyze memory usage, swap, and top consumers.", lang: "bash",
    code: `#!/bin/bash\necho "=== Memory Overview ==="\nfree -h\n\necho "\\n=== Swap Usage ==="\nswapon --show\n\necho "\\n=== Top 15 Memory Consumers ==="\nps aux --sort=-%mem | awk 'NR<=16 {printf "%-10s %-6s %-6s %s\\n",$1,$3,$4,$11}'\n\necho "\\n=== OOM Kill History ==="\ndmesg | grep -i 'killed process' | tail -10\n\necho "\\n=== Huge Pages ==="\ngrep -i hugepages /proc/meminfo` },
  { id: "linux-os-check", category: "linux", title: "OS Health Check Script", description: "Full system health snapshot — CPU, memory, disk, network.", lang: "bash",
    code: `#!/bin/bash\nHOST=$(hostname)\nDATE=$(date '+%Y-%m-%d %H:%M:%S')\necho "============================"\necho " System Health: $HOST"\necho " $DATE"\necho "============================"\necho "\\n--- CPU Load ---"\nuptime\nmpstat 1 3 | tail -4\n\necho "\\n--- Memory ---"\nfree -h\n\necho "\\n--- Disk ---"\ndf -hT | grep -v 'tmpfs\\|udev'\n\necho "\\n--- Network ---"\nss -s\n\necho "\\n--- Last 5 Failed Logins ---"\nlastb | head -5\n\necho "\\n--- Top 5 CPU Processes ---"\nps aux --sort=-%cpu | head -6` },
  { id: "linux-db-tune", category: "linux", title: "Kernel Tuning for Databases", description: "Recommended sysctl settings for Oracle / PostgreSQL servers.", lang: "bash",
    code: `#!/bin/bash\n# Apply DB-optimized kernel parameters\n# Add to /etc/sysctl.conf or /etc/sysctl.d/99-db.conf\n\ntee /etc/sysctl.d/99-db.conf <<'EOF'\n# Shared Memory (Oracle/PostgreSQL)\nkernel.shmmax = 68719476736\nkernel.shmall = 4294967296\nkernel.shmmni = 4096\n\n# Semaphores\nkernel.sem = 250 32000 100 128\n\n# Network buffers\nnet.core.rmem_max = 4194304\nnet.core.wmem_max = 4194304\nnet.ipv4.tcp_rmem = 4096 87380 4194304\nnet.ipv4.tcp_wmem = 4096 65536 4194304\n\n# VM / Swappiness (keep low for DB servers)\nvm.swappiness = 10\nvm.dirty_background_ratio = 3\nvm.dirty_ratio = 15\nEOF\n\nsysctl -p /etc/sysctl.d/99-db.conf\necho "Kernel parameters applied."` },
];

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
    <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", border: `1px solid ${focused ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "0.38rem 0.85rem", gap: "0.5rem", transition: "border-color 0.2s" }}>
        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search topics & pages…"
          style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.8rem", color: "#fff", width: "100%", fontFamily: "inherit" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
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
// ══════════════════════════════════════════════════════════════════════
// 📂 SCRIPTS DROPDOWN NAV COMPONENT
// ══════════════════════════════════════════════════════════════════════
function ScriptsDropdown({ goScripts }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button className="nav-link" style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: open ? "#fff" : undefined, background: open ? "rgba(255,255,255,0.07)" : undefined }}>
        📜 Scripts
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", minWidth: 180, boxShadow: "0 16px 48px rgba(0,0,0,0.5)", zIndex: 200, paddingTop: 4, paddingBottom: 4 }}>
          <div style={{ padding: "0.4rem 0.9rem 0.3rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>By Platform</div>
          {SCRIPT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { goScripts(cat.id); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "0.65rem", width: "100%", padding: "0.55rem 0.9rem", background: "none", border: "none", color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}>
              <span style={{ width: 22, height: 22, background: cat.light, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>{cat.icon}</span>
              {cat.label}
              <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#475569" }}>
                {DEFAULT_SCRIPTS.filter(s => s.category === cat.id).length}
              </span>
            </button>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0" }} />
          <button onClick={() => { goScripts("oracle"); setOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.9rem", background: "none", border: "none", color: "#60A5FA", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            View All Scripts →
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 📋 COPY TO CLIPBOARD HELPER
// ══════════════════════════════════════════════════════════════════════
function copyToClipboard(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const el = document.createElement("textarea");
  el.value = text; document.body.appendChild(el); el.select();
  document.execCommand("copy"); document.body.removeChild(el);
  return Promise.resolve();
}

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
  const [scriptCat, setScriptCat]     = useState("oracle");
  const [activeScript, setActiveScript] = useState(null);
  const [scriptCopied, setScriptCopied] = useState(null);
  const [scriptSearch, setScriptSearch] = useState("");
  const [editingScript, setEditingScript] = useState(null);
  const [customScripts, setCustomScripts] = useState([]);

  useEffect(() => {
    loadData().then(setTopics);
    // Load custom scripts from storage
    window.storage?.get("itplatform-scripts").then(r => {
      if (r) { try { setCustomScripts(JSON.parse(r.value)); } catch {} }
    }).catch(() => {});
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

  const goHome   = () => { setView("home");   setActiveTopic(null); setActivePage(null); };
  const goAbout  = () => { setView("about");  setActiveTopic(null); setActivePage(null); };
  const goBrowse = (cat = "all") => { setView("browse"); setFilterCat(cat); setActiveTopic(null); setBrowseSearch(""); };
  const goScripts = (cat = "oracle") => { setView("scripts"); setScriptCat(cat); setActiveScript(null); setScriptSearch(""); };
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

  const allScripts = [...DEFAULT_SCRIPTS, ...customScripts];

  const saveScript = (data) => {
    let next;
    if (data.id && customScripts.find(s => s.id === data.id)) {
      next = customScripts.map(s => s.id === data.id ? { ...s, ...data } : s);
    } else {
      next = [...customScripts, { ...data, id: "script-" + Date.now() }];
    }
    setCustomScripts(next);
    try { window.storage?.set("itplatform-scripts", JSON.stringify(next)); } catch {}
    setAdminView("scripts"); setEditingScript(null);
    showToast("✅ Script saved!");
  };

  const deleteScript = (id) => {
    const next = customScripts.filter(s => s.id !== id);
    setCustomScripts(next);
    try { window.storage?.set("itplatform-scripts", JSON.stringify(next)); } catch {}
    if (activeScript?.id === id) setActiveScript(null);
    showToast("🗑️ Script deleted");
  };

  return (
    // ✅ KEY FIX: flex column + min-height 100vh pushes footer to bottom
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: "100vh", background: "#F4F6F9", color: "#0B1220", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F4F6F9;
          --surface: #FFFFFF;
          --ink: #0B1220;
          --ink2: #1E293B;
          --muted: #64748B;
          --dim: #94A3B8;
          --border: #E1E7EF;
          --accent: #1D4ED8;
          --accent-light: #EEF2FF;
          --accent-glow: rgba(29,78,216,0.15);
          --nav-bg: #0B1220;
          --nav-border: rgba(255,255,255,0.07);
        }
        body { font-family: 'IBM Plex Sans', sans-serif; background: var(--bg); color: var(--ink); }
        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(11,18,32,0.12); }
        .btn { border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; transition: all 0.2s; border-radius: 8px; }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        input, textarea, select { font-family: 'IBM Plex Sans', sans-serif; outline: none; }
        textarea { resize: vertical; }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .slide-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .slide-row::-webkit-scrollbar { height: 4px; }
        .slide-row::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .nav-link { padding: 0.38rem 0.85rem; background: transparent; border: none; color: rgba(255,255,255,0.5); font-family: 'IBM Plex Sans', sans-serif; font-size: 0.8rem; font-weight: 500; cursor: pointer; border-radius: 6px; letter-spacing: 0.01em; transition: all 0.15s; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; transition: all 0.2s; }
        .card:hover { border-color: #C7D7F5; box-shadow: 0 8px 32px rgba(29,78,216,0.07); }
        .section-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.67rem; font-weight: 500; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.55rem; }
        .section-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--accent); border-radius: 1px; }
        .section-title { font-family: 'Syne', sans-serif; font-weight: 800; color: var(--ink); line-height: 1.15; letter-spacing: -0.02em; }
      `}</style>

      {showLogin && <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />}

      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, background: "#1A1A2E", color: "#fff", borderRadius: 12, padding: "0.85rem 1.5rem", fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#0B1220", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 3.5%", height: 60, gap: "1rem" }}>
        {/* Brand */}
        <div onClick={goHome} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: "#1D4ED8", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>DBA<span style={{ color: "#60A5FA" }}>·</span>Tech Hub</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "0.1rem", alignItems: "center" }}>
          {[["Home", goHome], ["About", goAbout], ["Browse All", () => goBrowse()]].map(([label, fn]) => (
            <button key={label} onClick={fn} className="nav-link">{label}</button>
          ))}
          {/* Scripts dropdown */}
          <ScriptsDropdown goScripts={goScripts} />
          {/* Category links */}
          {DEFAULT_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => goBrowse(c.id)} className="nav-link">{c.label}</button>
          ))}
        </div>

        {/* Right: search + admin */}
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0 }}>
          <GlobalSearch topics={topics} onGoTopic={goTopic} onGoPage={goPage} />
          {isAdmin && (
            <>
              <button onClick={() => { setView("admin"); setAdminView("topics"); }} className="btn" style={{ padding: "0.38rem 0.9rem", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.12)" }}>
                ✏️ Manage
              </button>
              <button onClick={handleLogout} className="btn" style={{ padding: "0.38rem 0.8rem", background: "rgba(239,68,68,0.15)", color: "#FCA5A5", fontSize: "0.75rem", border: "1px solid rgba(239,68,68,0.2)" }}>
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

            {/* ── HERO ── */}
            <section style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #0f2a47 60%, #0a1f3a 100%)", padding: "72px 6% 64px", position: "relative", overflow: "hidden" }}>
              {/* Background grid pattern */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
              {/* Glow orb */}
              <div style={{ position: "absolute", top: "-80px", right: "8%", width: 420, height: 420, background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" }}>
                {/* Left: headline */}
                <div style={{ flex: "1 1 480px", minWidth: 0 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.15)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 6, padding: "0.3rem 0.85rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.6rem" }}>
                    <span style={{ width: 6, height: 6, background: "#22C55E", borderRadius: "50%", animation: "pulse 2s infinite" }} />
                    Enterprise Database Knowledge Platform
                  </div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3.1rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem", color: "#F0F4FF", letterSpacing: "-0.02em" }}>
                    Deep-Dive Guides on<br />
                    <span style={{ color: "#60A5FA" }}>Enterprise Databases</span>,<br />
                    Cloud & Automation
                  </h1>
                  <p style={{ fontSize: "1rem", color: "#94A3B8", lineHeight: 1.8, marginBottom: "2.2rem", maxWidth: 520, fontWeight: 300 }}>
                    11+ years of enterprise experience distilled into practical technical guides — covering Oracle, SQL Server, PostgreSQL, MongoDB, AWS, Azure, and Kubernetes at production scale.
                  </p>
                  <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.8rem 1.7rem", background: "#2563EB", color: "#fff", fontSize: "0.9rem", fontWeight: 600, borderRadius: 8, boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}>
                      Explore Knowledge Base →
                    </button>
                    <button onClick={() => goBrowse("databases")} className="btn" style={{ padding: "0.8rem 1.4rem", background: "rgba(255,255,255,0.07)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.88rem", fontWeight: 500, borderRadius: 8 }}>
                      🗄️ Database Guides
                    </button>
                  </div>
                </div>

                {/* Right: stat cards */}
                <div style={{ flex: "0 0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                  {[
                    { n: "11+", l: "Years Enterprise\nExperience",   icon: "📅", c: "#3B82F6" },
                    { n: "5+",  l: "Database\nPlatforms",            icon: "🗄️", c: "#8B5CF6" },
                    { n: "1K+", l: "Issues\nDiagnosed & Resolved",   icon: "✅", c: "#10B981" },
                    { n: "∞",   l: "Pages of\nKnowledge",            icon: "📚", c: "#F59E0B" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1.25rem 1.4rem", backdropFilter: "blur(8px)", minWidth: 130 }}>
                      <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{s.icon}</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#F0F4FF", lineHeight: 1, marginBottom: "0.35rem" }}>{s.n}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748B", lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── WHAT MAKES THIS PLATFORM EXCEPTIONAL ── */}
            <section style={{ background: "#fff", padding: "56px 6%", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 2.8rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Why This Knowledge Base</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", fontWeight: 900, color: "#0D1B2E", lineHeight: 1.2, marginBottom: "0.8rem" }}>
                  What Makes Exceptional Database Knowledge?
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.8 }}>
                  Before diving in, understand what separates deep enterprise database expertise from generic IT content.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {[
                  { icon: "🎯", title: "Specialized Database Focus", color: "#2563EB", light: "#EFF6FF", desc: "Every guide focuses exclusively on database technologies — not generic IT overviews. This translates to deeper expertise and faster problem resolution grounded in real enterprise incidents." },
                  { icon: "🔀", title: "Multi-Platform Expertise", color: "#7C3AED", light: "#F5F3FF", desc: "Enterprise environments rarely standardize on a single database. Guides cover SQL Server, Oracle, MySQL, PostgreSQL, and cloud-native databases — your entire ecosystem." },
                  { icon: "⚡", title: "Strategic & Tactical Coverage", color: "#0891B2", light: "#ECFEFF", desc: "Both strategic architecture design and tactical troubleshooting. From high-level HA/DR patterns to low-level query plan analysis and index tuning scripts." },
                  { icon: "🏭", title: "Production-Grade Context", color: "#059669", light: "#ECFDF5", desc: "All content is informed by real MNC-scale production environments — not lab setups. Includes compliance considerations, performance benchmarks, and failure scenarios." },
                ].map((f, i) => (
                  <div key={i} className="hover-lift" style={{ background: "#FAFAFA", border: "1px solid #E2E2EC", borderRadius: 16, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: f.color }} />
                    <div style={{ width: 44, height: 44, background: f.light, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "1rem" }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0D1B2E", marginBottom: "0.6rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.83rem", color: "#6B7280", lineHeight: 1.7 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── TOPIC SECTIONS BY CATEGORY ── */}
            {byCategory.map((cat) => (
              <section key={cat.id} style={{ padding: "52px 6% 44px", borderBottom: "1px solid #E2E2EC", background: cat.id === "automation" ? "#FAFAFA" : "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: cat.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{cat.icon} {cat.label}</div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 900, color: "#0D1B2E", lineHeight: 1.15 }}>
                      {cat.id === "databases" ? "Database Platforms" : cat.id === "automation" ? "Automation & DevOps Tools" : "Cloud Infrastructure"}
                    </h2>
                    <p style={{ fontSize: "0.83rem", color: "#6B7280", marginTop: "0.35rem" }}>
                      {cat.id === "databases" ? "Enterprise RDBMS, NoSQL, and cloud-native database guides." : cat.id === "automation" ? "IaC, configuration management, and CI/CD pipeline references." : "Multi-cloud architecture, managed services, and container orchestration."}
                    </p>
                  </div>
                  <button onClick={() => goBrowse(cat.id)} className="btn" style={{ padding: "0.55rem 1.2rem", background: cat.lightColor, color: cat.color, border: `1.5px solid ${cat.color}25`, fontSize: "0.83rem", flexShrink: 0 }}>
                    View All {cat.items.length} →
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.1rem" }}>
                  {cat.items.map((t) => (
                    <div key={t.id} onClick={() => goTopic(t)} className="hover-lift" style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.6rem", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.9rem" }}>
                        <div style={{ width: 40, height: 40, background: t.lightColor, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{t.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0D1B2E", lineHeight: 1.2 }}>{t.title}</div>
                          <div style={{ fontSize: "0.7rem", color: t.color, fontWeight: 600, marginTop: 2 }}>{t.tagline}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.65, marginBottom: "1rem" }}>{t.description.substring(0, 88)}…</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: t.lightColor, color: t.color, padding: "0.22rem 0.65rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700 }}>{t.pages.length} page{t.pages.length !== 1 ? "s" : ""}</span>
                        <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Read →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* ── WHAT TO EXPECT SECTION ── */}
            <section style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #112240 100%)", padding: "60px 6%" }}>
              <div style={{ maxWidth: 860, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#60A5FA", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Knowledge Standards</div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 900, color: "#F0F4FF", lineHeight: 1.2, marginBottom: "0.8rem" }}>
                    What to Expect from This Platform
                  </h2>
                  <p style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.8 }}>
                    When you explore this knowledge base, every guide is built to a consistent professional standard.
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  {[
                    { icon: "🔍", title: "Faster Problem Diagnosis", desc: "Patterns recognized from hundreds of real production incidents — not textbook scenarios." },
                    { icon: "📈", title: "Proactive Recommendations", desc: "Optimization opportunities identified before they become problems, with measurable benchmarks." },
                    { icon: "🎓", title: "Knowledge Transfer", desc: "Learn best practices and the reasoning behind them — not just prescriptive steps to follow blindly." },
                    { icon: "⏱️", title: "Realistic Complexity", desc: "Honest about tradeoffs, edge cases, and failure modes at enterprise scale." },
                    { icon: "📐", title: "Measurable Improvements", desc: "Performance gains, cost reductions, and security enhancements quantified with real data." },
                    { icon: "🏢", title: "Enterprise Context", desc: "HIPAA, PCI-DSS, and SOC 2 compliance considerations woven into relevant guides." },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.4rem", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                      <div style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#E2E8F0", marginBottom: "0.4rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.65 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── PLATFORM COVERAGE STRIP ── */}
            <section style={{ background: "#fff", padding: "40px 6%", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Platform Coverage</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#0D1B2E" }}>Multi-Platform Expertise Across Your Entire Stack</h3>
                </div>
                <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.65rem 1.4rem", background: "#2563EB", color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>
                  Explore All Topics →
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
                {[
                  { label: "Oracle 19c", color: "#C74634", light: "#FEF2F0" },
                  { label: "SQL Server", color: "#CC2927", light: "#FEF2F2" },
                  { label: "PostgreSQL", color: "#336791", light: "#EFF6FF" },
                  { label: "MySQL", color: "#F29111", light: "#FFFBEB" },
                  { label: "MongoDB", color: "#4CAF50", light: "#F0FDF4" },
                  { label: "Azure SQL", color: "#0078D4", light: "#EFF6FF" },
                  { label: "AWS RDS", color: "#FF9900", light: "#FFFBEB" },
                  { label: "Kubernetes", color: "#326CE5", light: "#EFF6FF" },
                  { label: "Terraform", color: "#7B42BC", light: "#F5F3FF" },
                  { label: "Ansible", color: "#EE0000", light: "#FFF1F1" },
                  { label: "CI/CD", color: "#0EA5E9", light: "#F0F9FF" },
                  { label: "Performance Tuning", color: "#059669", light: "#ECFDF5" },
                  { label: "HA & DR", color: "#7C3AED", light: "#F5F3FF" },
                  { label: "Security & TDE", color: "#0891B2", light: "#ECFEFF" },
                ].map((tag, i) => (
                  <span key={i} onClick={() => goBrowse()} style={{ background: tag.light, color: tag.color, border: `1px solid ${tag.color}20`, padding: "0.3rem 0.85rem", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${tag.color}20`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ══════════ SCRIPTS VIEW ══════════ */}
        {view === "scripts" && (
          <div className="fade-in" style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>

            {/* ── Sidebar ── */}
            <aside style={{ width: 220, flexShrink: 0, background: "#0B1220", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" }}>
              <div style={{ padding: "1.25rem 1rem 0.75rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>Script Library</div>
              {SCRIPT_CATEGORIES.map(cat => {
                const count = allScripts.filter(s => s.category === cat.id).length;
                const active = scriptCat === cat.id;
                return (
                  <button key={cat.id} onClick={() => { setScriptCat(cat.id); setActiveScript(null); setScriptSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.7rem 1rem", background: active ? "rgba(29,78,216,0.15)" : "none", border: "none", borderLeft: active ? `3px solid #1D4ED8` : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: "0.83rem", fontWeight: active ? 600 : 400, width: "100%", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; } }}>
                    <span style={{ width: 26, height: 26, background: active ? cat.light : "rgba(255,255,255,0.06)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, transition: "background 0.15s" }}>{cat.icon}</span>
                    <span style={{ flex: 1 }}>{cat.label}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: active ? "#60A5FA" : "#334155", background: active ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.04)", padding: "0.1rem 0.4rem", borderRadius: 4 }}>{count}</span>
                  </button>
                );
              })}
              {/* Total count */}
              <div style={{ marginTop: "auto", padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#334155" }}>
                {allScripts.length} scripts total · {customScripts.length} custom
              </div>
            </aside>

            {/* ── Main content ── */}
            <div style={{ flex: 1, background: "#F4F6F9", display: "flex", flexDirection: "column" }}>
              {(() => {
                const cat = SCRIPT_CATEGORIES.find(c => c.id === scriptCat);
                const filtered = allScripts.filter(s =>
                  s.category === scriptCat &&
                  (!scriptSearch || s.title.toLowerCase().includes(scriptSearch.toLowerCase()) || s.description.toLowerCase().includes(scriptSearch.toLowerCase()))
                );
                return (
                  <>
                    {/* Header */}
                    <div style={{ background: "#fff", borderBottom: "1px solid #E1E7EF", padding: "1.4rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{ width: 38, height: 38, background: cat.light, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", border: `1.5px solid ${cat.color}20` }}>{cat.icon}</div>
                        <div>
                          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0B1220" }}>{cat.label} Scripts</h1>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#64748B" }}>{filtered.length} script{filtered.length !== 1 ? "s" : ""} · Click to view & copy</div>
                        </div>
                      </div>
                      <input value={scriptSearch} onChange={e => setScriptSearch(e.target.value)}
                        placeholder="Search scripts…"
                        style={{ padding: "0.5rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 8, fontSize: "0.83rem", background: "#F4F6F9", fontFamily: "inherit", outline: "none", width: 220 }} />
                    </div>

                    {/* Script list + viewer */}
                    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                      {/* Script cards list */}
                      <div style={{ width: 300, flexShrink: 0, overflowY: "auto", borderRight: "1px solid #E1E7EF", padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {filtered.length === 0 && (
                          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94A3B8", fontSize: "0.83rem" }}>No scripts found</div>
                        )}
                        {filtered.map(script => {
                          const isActive = activeScript?.id === script.id;
                          const isCustom = customScripts.some(s => s.id === script.id);
                          return (
                            <div key={script.id} onClick={() => setActiveScript(script)}
                              style={{ padding: "0.9rem 1rem", background: isActive ? "#EEF2FF" : "#fff", border: `1.5px solid ${isActive ? "#1D4ED8" : "#E1E7EF"}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
                              onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "#C7D7F5"; }}
                              onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "#E1E7EF"; }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: isActive ? "#1D4ED8" : "#0B1220", flex: 1, marginRight: "0.4rem" }}>{script.title}</span>
                                <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                                  {isCustom && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", background: "#FEF3C7", color: "#92400E", padding: "0.1rem 0.35rem", borderRadius: 3 }}>custom</span>}
                                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", background: isActive ? "#1D4ED8" : "#F1F5F9", color: isActive ? "#fff" : "#64748B", padding: "0.15rem 0.45rem", borderRadius: 4 }}>{script.lang}</span>
                                </div>
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.5 }}>{script.description}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Code viewer */}
                      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
                        {!activeScript ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94A3B8", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📜</div>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.4rem", color: "#64748B" }}>Select a script to view</div>
                            <div style={{ fontSize: "0.82rem" }}>Choose from the {cat.label} scripts on the left</div>
                          </div>
                        ) : (
                          <div className="fade-in">
                            {/* Script title bar */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#0B1220" }}>{activeScript.title}</h2>
                                  {customScripts.some(s => s.id === activeScript.id) && (
                                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", padding: "0.15rem 0.5rem", borderRadius: 4 }}>custom</span>
                                  )}
                                </div>
                                <p style={{ fontSize: "0.83rem", color: "#64748B", lineHeight: 1.6 }}>{activeScript.description}</p>
                              </div>
                              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                {isAdmin && customScripts.some(s => s.id === activeScript.id) && (
                                  <>
                                    <button onClick={() => { setEditingScript(activeScript); setView("admin"); setAdminView("edit-script"); }} className="btn" style={{ padding: "0.55rem 0.9rem", background: "#F0FDF4", color: "#16A34A", fontSize: "0.78rem", border: "1px solid #BBF7D0" }}>✏️ Edit</button>
                                    <button onClick={() => deleteScript(activeScript.id)} className="btn" style={{ padding: "0.55rem 0.9rem", background: "#FEF2F2", color: "#DC2626", fontSize: "0.78rem", border: "1px solid #FECACA" }}>🗑️ Delete</button>
                                  </>
                                )}
                                <button onClick={() => { copyToClipboard(activeScript.code); setScriptCopied(activeScript.id); setTimeout(() => setScriptCopied(null), 2000); }} className="btn" style={{ padding: "0.55rem 1.1rem", background: scriptCopied === activeScript.id ? "#059669" : "#1D4ED8", color: "#fff", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  {scriptCopied === activeScript.id ? "✅ Copied!" : "📋 Copy Code"}
                                </button>
                              </div>
                            </div>
                            {/* Code block */}
                            <div style={{ background: "#0B1120", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1.2rem", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{ display: "flex", gap: "0.4rem" }}>
                                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                                </div>
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", color: "#475569", letterSpacing: "0.06em" }}>{activeScript.lang.toUpperCase()}</span>
                              </div>
                              <pre style={{ margin: 0, padding: "1.4rem 1.5rem", overflowX: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.82rem", lineHeight: 1.8, color: "#CBD5E1" }}>
                                <code style={{ color: "#CBD5E1" }}>{activeScript.code}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
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
                          {page.attachments && page.attachments.length > 0 && (
                            <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                              {page.attachments.map(att => {
                                const icon = att.type?.includes("pdf") ? "📄" : att.type?.includes("presentation") || att.type?.includes("ppt") ? "📊" : "📝";
                                return <span key={att.id} style={{ fontSize: "0.65rem", background: "#EEF2FF", color: "#4338CA", border: "1px solid #C7D2FE", padding: "0.1rem 0.4rem", borderRadius: 4 }}>{icon} {att.name.length > 18 ? att.name.slice(0,16)+"…" : att.name}</span>;
                              })}
                            </div>
                          )}
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

              {/* ── ATTACHMENTS DOWNLOAD SECTION ── */}
              {activePage.attachments && activePage.attachments.length > 0 && (
                <div style={{ marginTop: "1.5rem", background: "#fff", border: "1px solid #E1E7EF", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.5rem", background: "#F8FAFC", borderBottom: "1px solid #E1E7EF", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1rem" }}>📎</span>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0B1220" }}>Attachments</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", background: "#EEF2FF", color: "#4338CA", padding: "0.1rem 0.45rem", borderRadius: 4 }}>{activePage.attachments.length} file{activePage.attachments.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {activePage.attachments.map(att => {
                      const EXT_META = {
                        "application/pdf": { icon: "📄", label: "PDF", color: "#DC2626", light: "#FEF2F2" },
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: "📝", label: "DOCX", color: "#1D4ED8", light: "#EEF2FF" },
                        "application/msword": { icon: "📝", label: "DOC", color: "#1D4ED8", light: "#EEF2FF" },
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: "📊", label: "PPTX", color: "#D97706", light: "#FFFBEB" },
                        "application/vnd.ms-powerpoint": { icon: "📊", label: "PPT", color: "#D97706", light: "#FFFBEB" },
                      };
                      const meta = EXT_META[att.type] || { icon: "📎", label: "FILE", color: "#64748B", light: "#F8FAFC" };
                      const formatSize = (b) => b < 1024*1024 ? (b/1024).toFixed(0)+"KB" : (b/1024/1024).toFixed(1)+"MB";
                      return (
                        <a key={att.id} href={att.data} download={att.name}
                          style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.75rem 1rem", background: meta.light, border: `1px solid ${meta.color}20`, borderRadius: 10, textDecoration: "none", transition: "all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = ""}>
                          <div style={{ width: 40, height: 40, background: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, border: `1px solid ${meta.color}20` }}>{meta.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0B1220", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{att.name}</div>
                            <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.1rem" }}>{meta.label} · {formatSize(att.size)} · Uploaded {att.uploadedAt}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.85rem", background: meta.color, color: "#fff", borderRadius: 7, fontSize: "0.78rem", fontWeight: 600, flexShrink: 0 }}>
                            ⬇ Download
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

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

            {/* ── HERO — professional personal brand ── */}
            <section style={{ background: "#0B1220", padding: "0 6%", position: "relative", overflow: "hidden", minHeight: 320, display: "flex", alignItems: "center" }}>
              {/* Grid bg */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
              {/* Blue glow */}
              <div style={{ position: "absolute", top: "-60px", right: "10%", width: 420, height: 420, background: "radial-gradient(circle, rgba(29,78,216,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
              {/* Accent line left */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(180deg, #1D4ED8, #0891B2)" }} />

              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "2.8rem", padding: "52px 0", flexWrap: "wrap", width: "100%" }}>

                {/* Avatar — initials-based, professional */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 18, background: "linear-gradient(135deg, #1D4ED8 0%, #0891B2 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(29,78,216,0.2), 0 12px 40px rgba(0,0,0,0.4)", position: "relative" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>A</span>
                    {/* Online indicator */}
                    <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, background: "#10B981", borderRadius: "50%", border: "2.5px solid #0B1220" }} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#60A5FA", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.55rem" }}>
                    ● Senior Database Administrator · MNC
                  </div>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.7rem, 3vw, 2.5rem)", fontWeight: 800, color: "#F1F5F9", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "0.8rem" }}>
                    Enterprise DBA &<br/>IT Professional
                  </h1>
                  <p style={{ fontSize: "0.93rem", color: "#64748B", lineHeight: 1.8, maxWidth: 500, fontWeight: 300, marginBottom: "1.5rem" }}>
                    11+ years managing mission-critical databases across enterprise and MNC environments. Building this platform to share production-grade knowledge and help the next generation of DBAs grow.
                  </p>

                  {/* Action row */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                    <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.35rem", background: "#0A66C2", color: "#fff", borderRadius: 8, fontSize: "0.84rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(10,102,194,0.35)", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0958A8"}
                      onMouseLeave={e => e.currentTarget.style.background = "#0A66C2"}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      View LinkedIn Profile
                    </a>
                    <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.65rem 1.2rem", background: "rgba(255,255,255,0.07)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.13)", fontSize: "0.84rem" }}>
                      📚 Knowledge Base →
                    </button>
                  </div>
                </div>

                {/* Right: quick-facts card */}
                <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.4rem 1.8rem", minWidth: 200 }}>
                  {[
                    { icon: "🏢", label: "Current Role", val: "Senior DBA · MNC" },
                    { icon: "📍", label: "Experience", val: "11+ Years" },
                    { icon: "🗄️", label: "Platforms", val: "5+ DB Engines" },
                    { icon: "✅", label: "Issues Solved", val: "1,000+" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", paddingBottom: i < 3 ? "0.9rem" : 0, marginBottom: i < 3 ? "0.9rem" : 0, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.label}</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#CBD5E1", marginTop: 2 }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Stats bar */}
            <div style={{ background: "#1D4ED8", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {[["11+", "Years Enterprise Experience"], ["5+", "Database Platforms"], ["1,000+", "Issues Resolved"], ["∞", "Pages of Knowledge"]].map(([n, l], i) => (
                <div key={i} style={{ padding: "1.5rem 2rem", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: "0.7rem", color: "#BFDBFE", marginTop: "0.3rem", letterSpacing: "0.04em" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* What this platform covers */}
            <section style={{ background: "#fff", padding: "60px 6%", borderBottom: "1px solid #E1E7EF" }}>
              <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div className="section-eyebrow">Knowledge Scope</div>
                <h2 className="section-title" style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", marginBottom: "0.7rem" }}>What This Platform Covers</h2>
                <p style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.8, maxWidth: 640, marginBottom: "2.5rem" }}>
                  Specialized database knowledge built from real production incidents, enterprise architecture decisions, and years of hands-on platform management — not textbook content.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: "1rem" }}>
                  {[
                    { icon: "🔴", title: "Oracle Database",    desc: "RAC, Data Guard, RMAN, ASM, PL/SQL, OEM, Performance Tuning", color: "#C74634", light: "#FEF2F0" },
                    { icon: "🐘", title: "PostgreSQL",          desc: "Replication, Partitioning, JSONB, pgBouncer, Vacuum tuning",  color: "#336791", light: "#EFF6FF" },
                    { icon: "🐬", title: "MySQL",               desc: "InnoDB engine, Replication, Galera Cluster, slow query log",  color: "#E8960C", light: "#FFFBEB" },
                    { icon: "🪟", title: "SQL Server",          desc: "Always On AG, SSIS, T-SQL, Azure SQL, Query Store",          color: "#CC2927", light: "#FEF2F2" },
                    { icon: "🍃", title: "MongoDB",             desc: "Sharding, Replica Sets, Atlas, Aggregation pipelines",       color: "#3D8A40", light: "#F0FDF4" },
                    { icon: "☁️", title: "Cloud DBs",           desc: "AWS RDS/Aurora, Azure SQL, GCP Cloud SQL, multi-AZ HA",     color: "#0891B2", light: "#ECFEFF" },
                    { icon: "⚙️", title: "Automation & IaC",   desc: "Ansible, Terraform, Python scripts, CI/CD for DB ops",      color: "#7C3AED", light: "#F5F3FF" },
                    { icon: "🐧", title: "Linux & Systems",     desc: "RHEL, storage architecture, kernel tuning, security hardening", color: "#374151", light: "#F9FAFB" },
                  ].map((s) => (
                    <div key={s.title} className="card hover-lift" style={{ padding: "1.3rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
                      <div style={{ width: 38, height: 38, background: s.light, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", marginBottom: "0.85rem" }}>{s.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0B1220", marginBottom: "0.35rem" }}>{s.title}</div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B", lineHeight: 1.65 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why this knowledge base */}
            <section style={{ background: "#F4F6F9", padding: "60px 6%", borderBottom: "1px solid #E1E7EF" }}>
              <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div className="section-eyebrow">My Approach</div>
                <h2 className="section-title" style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", marginBottom: "2.2rem" }}>What Makes This Knowledge Base Different</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.2rem" }}>
                  {[
                    { icon: "🎯", title: "Specialized Database Focus", color: "#1D4ED8", light: "#EEF2FF", desc: "Every guide focuses exclusively on database technologies. This specialization means deeper expertise, faster problem resolution, and solutions informed by real enterprise incidents — not generic IT advice." },
                    { icon: "🔀", title: "Multi-Platform Coverage", color: "#7C3AED", light: "#F5F3FF", desc: "Enterprise environments rarely standardize on a single database. Guides cover the full spectrum — SQL Server, Oracle, MySQL, PostgreSQL, and cloud-native databases — so your entire stack is addressed." },
                    { icon: "🏭", title: "Production-Grade Context", color: "#059669", light: "#ECFDF5", desc: "All content is grounded in real MNC-scale production environments. Includes failure scenarios, compliance considerations (HIPAA, PCI-DSS), and performance benchmarks you won't find in documentation." },
                    { icon: "📐", title: "Strategic + Tactical Depth", color: "#0891B2", light: "#ECFEFF", desc: "From high-level HA/DR architecture patterns to low-level index tuning scripts and query execution plan analysis — both layers are covered with measurable, actionable guidance." },
                  ].map((f, i) => (
                    <div key={i} className="card hover-lift" style={{ padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: f.color }} />
                      <div style={{ width: 44, height: 44, background: f.light, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "1rem" }}>{f.icon}</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0B1220", marginBottom: "0.55rem" }}>{f.title}</div>
                      <div style={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.75 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section style={{ background: "#0B1220", padding: "52px 6%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.7rem" }}>📚</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#F1F5F9", marginBottom: "0.5rem" }}>Explore the Knowledge Base</h3>
                <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.75, marginBottom: "1.5rem" }}>Browse technical guides, scripts, and architecture patterns built from real enterprise production experience.</p>
                <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.75rem 1.6rem", background: "#1D4ED8", color: "#fff", fontSize: "0.87rem", boxShadow: "0 4px 20px rgba(29,78,216,0.35)" }}>
                    Browse All Topics →
                  </button>
                  <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.75rem 1.4rem", background: "#0A66C2", color: "#fff", borderRadius: 8, fontSize: "0.87rem", fontWeight: 600, textDecoration: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ══════════ ADMIN VIEW ══════════ */}
        {view === "admin" && isAdmin && (
          <div className="fade-in">
            <div style={{ background: "#0B1220", padding: "28px 6% 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#60A5FA", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>🔐 Admin Panel</div>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F1F5F9" }}>Content Management</h1>
                  <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: "0.2rem" }}>Secure session · Auto-expires in {SESSION_HOURS}h</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ padding: "0.5rem 1.1rem", background: "rgba(239,68,68,0.15)", color: "#FCA5A5", fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.2)" }}>🚪 Logout</button>
              </div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 0 }}>
                {[["topics", "📚 Topics & Pages"], ["scripts", "📜 Script Library"]].map(([tab, label]) => (
                  <button key={tab} onClick={() => setAdminView(tab)}
                    style={{ padding: "0.65rem 1.4rem", background: "none", border: "none", borderBottom: adminView === tab || (tab === "topics" && ["edit-topic","edit-page"].includes(adminView)) || (tab === "scripts" && adminView === "edit-script") ? "2px solid #1D4ED8" : "2px solid transparent", color: adminView === tab || (tab === "topics" && ["edit-topic","edit-page"].includes(adminView)) || (tab === "scripts" && adminView === "edit-script") ? "#60A5FA" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>
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

            {/* ── SCRIPTS TAB ── */}
            {adminView === "scripts" && (
              <div style={{ padding: "2rem 6%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0B1220" }}>Script Library — Custom Scripts</h2>
                    <p style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.2rem" }}>Add your own scripts. Built-in scripts cannot be edited but custom scripts can be managed here.</p>
                  </div>
                  <button onClick={() => { setEditingScript({ title: "", description: "", category: "oracle", lang: "sql", code: "" }); setAdminView("edit-script"); }} className="btn"
                    style={{ padding: "0.6rem 1.3rem", background: "#1D4ED8", color: "#fff", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    ＋ New Script
                  </button>
                </div>

                {/* Group custom scripts by category */}
                {customScripts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem 2rem", border: "2px dashed #E1E7EF", borderRadius: 16, color: "#94A3B8" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📜</div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.4rem", color: "#64748B" }}>No custom scripts yet</div>
                    <div style={{ fontSize: "0.82rem", marginBottom: "1.5rem" }}>Click "＋ New Script" to add your first custom script</div>
                    <button onClick={() => { setEditingScript({ title: "", description: "", category: "oracle", lang: "sql", code: "" }); setAdminView("edit-script"); }} className="btn"
                      style={{ padding: "0.65rem 1.4rem", background: "#1D4ED8", color: "#fff", fontSize: "0.85rem" }}>
                      ＋ Add First Script
                    </button>
                  </div>
                ) : (
                  SCRIPT_CATEGORIES.map(cat => {
                    const catScripts = customScripts.filter(s => s.category === cat.id);
                    if (catScripts.length === 0) return null;
                    return (
                      <div key={cat.id} style={{ marginBottom: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 700, color: cat.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                          <span style={{ background: cat.light, padding: "0.15rem 0.4rem", borderRadius: 4 }}>{cat.icon} {cat.label}</span>
                          <span style={{ color: "#94A3B8", fontWeight: 400 }}>({catScripts.length} custom)</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                          {catScripts.map(script => (
                            <div key={script.id} style={{ background: "#fff", border: "1px solid #E1E7EF", borderRadius: 12, padding: "1rem 1.3rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                                  <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0B1220" }}>{script.title}</span>
                                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", background: "#F1F5F9", color: "#64748B", padding: "0.1rem 0.4rem", borderRadius: 4 }}>{script.lang}</span>
                                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", background: "#FEF3C7", color: "#92400E", padding: "0.1rem 0.35rem", borderRadius: 3 }}>custom</span>
                                </div>
                                <div style={{ fontSize: "0.77rem", color: "#64748B" }}>{script.description}</div>
                              </div>
                              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                <button onClick={() => { goScripts(script.category); setTimeout(() => setActiveScript(script), 100); }}
                                  style={{ padding: "0.35rem 0.8rem", background: "#F4F6F9", color: "#374151", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>View</button>
                                <button onClick={() => { setEditingScript(script); setAdminView("edit-script"); }}
                                  style={{ padding: "0.35rem 0.8rem", background: "#F0FDF4", color: "#16A34A", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Edit</button>
                                <button onClick={() => deleteScript(script.id)}
                                  style={{ padding: "0.35rem 0.8rem", background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Built-in scripts info */}
                <div style={{ marginTop: "2.5rem", padding: "1.2rem 1.5rem", background: "#F8FAFC", border: "1px solid #E1E7EF", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>ℹ️</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0B1220", marginBottom: "0.2rem" }}>Built-in Scripts ({DEFAULT_SCRIPTS.length} total)</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.6 }}>
                      The {DEFAULT_SCRIPTS.length} built-in scripts across Oracle, SQL Server, PostgreSQL, MySQL, MongoDB, and Linux are read-only. Use "＋ New Script" to add your own scripts alongside them.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SCRIPT EDITOR ── */}
            {adminView === "edit-script" && editingScript !== null && (
              <ScriptEditor script={editingScript} onSave={saveScript} onCancel={() => { setAdminView("scripts"); setEditingScript(null); }} />
            )}

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

function ScriptEditor({ script, onSave, onCancel }) {
  const [form, setForm] = useState({ ...script });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.title.trim() && form.code.trim() && form.category && form.lang;

  return (
    <div style={{ padding: "2rem 6%", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0B1220" }}>{script.id ? "Edit Script" : "New Script"}</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.2rem" }}>Fill in the details and paste your script code below.</p>
        </div>
        <button onClick={onCancel} style={{ background: "#F4F6F9", border: "1px solid #E1E7EF", borderRadius: 8, padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.82rem", color: "#64748B", fontFamily: "inherit" }}>← Back</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {/* Title */}
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Script Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="e.g. Kill Blocking Sessions"
            style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.9rem", fontFamily: "inherit", outline: "none", background: "#fff" }} />
        </div>

        {/* Category */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Platform / Category *</label>
          <select value={form.category} onChange={e => set("category", e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.88rem", fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
            {SCRIPT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>

        {/* Language */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Language *</label>
          <select value={form.lang} onChange={e => set("lang", e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.88rem", fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
            {["sql", "bash", "python", "javascript", "powershell", "hcl", "yaml"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Description */}
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Description</label>
          <input value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="Brief description of what this script does"
            style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.88rem", fontFamily: "inherit", outline: "none", background: "#fff" }} />
        </div>
      </div>

      {/* Code editor */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Script Code *</label>
        <div style={{ background: "#0B1120", borderRadius: 12, overflow: "hidden", border: "1.5px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1.1rem", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.06em" }}>{form.lang?.toUpperCase() || "CODE"}</span>
          </div>
          <textarea value={form.code} onChange={e => set("code", e.target.value)}
            placeholder={`-- Paste your ${form.lang || "script"} code here...`}
            rows={18}
            style={{ width: "100%", padding: "1.2rem 1.4rem", background: "transparent", border: "none", outline: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.83rem", lineHeight: 1.8, color: "#CBD5E1", resize: "vertical", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button onClick={onCancel} className="btn" style={{ padding: "0.7rem 1.4rem", background: "#F4F6F9", color: "#374151", border: "1px solid #E1E7EF", fontSize: "0.88rem" }}>Cancel</button>
        <button onClick={() => valid && onSave(form)} className="btn"
          style={{ padding: "0.7rem 1.6rem", background: valid ? "#1D4ED8" : "#94A3B8", color: "#fff", fontSize: "0.88rem", cursor: valid ? "pointer" : "not-allowed", boxShadow: valid ? "0 4px 16px rgba(29,78,216,0.3)" : "none" }}>
          {script.id ? "💾 Save Changes" : "✅ Create Script"}
        </button>
      </div>
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
  const [attachments, setAttachments] = useState(page.attachments || []);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const ALLOWED = {
    "application/pdf": { ext: "pdf", icon: "📄", label: "PDF" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "docx", icon: "📝", label: "DOCX" },
    "application/msword": { ext: "doc", icon: "📝", label: "DOC" },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": { ext: "pptx", icon: "📊", label: "PPTX" },
    "application/vnd.ms-powerpoint": { ext: "ppt", icon: "📊", label: "PPT" },
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    Promise.all(files.map(file => {
      if (!ALLOWED[file.type]) return Promise.resolve(null);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({
          id: "att-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          name: file.name,
          type: file.type,
          size: file.size,
          data: ev.target.result, // base64 data URL
          uploadedAt: new Date().toISOString().split("T")[0],
        });
        reader.readAsDataURL(file);
      });
    })).then(results => {
      const valid = results.filter(Boolean);
      setAttachments(prev => [...prev, ...valid]);
      setUploading(false);
    });
    e.target.value = "";
  };

  const removeAttachment = (id) => setAttachments(prev => prev.filter(a => a.id !== id));

  const formatSize = (bytes) => bytes < 1024*1024 ? (bytes/1024).toFixed(0)+"KB" : (bytes/1024/1024).toFixed(1)+"MB";

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 6%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0B1220" }}>{form.id ? "Edit Page" : "New Knowledge Page"}</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.2rem" }}>Supports **bold**, code blocks (```lang), bullet lists. Attach DOCX, PPTX or PDF files.</p>
        </div>
        <button onClick={onCancel} style={{ background: "#F4F6F9", border: "1px solid #E1E7EF", borderRadius: 8, padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.82rem", color: "#64748B", fontFamily: "inherit" }}>← Back</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E1E7EF", borderRadius: 16, padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {/* Topic selector */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Topic</label>
          <select value={tid} onChange={(e) => setTid(e.target.value)} style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.88rem", background: "#F8FAFC", fontFamily: "inherit", outline: "none" }}>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Page Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="e.g. Advanced Indexing Strategies"
            style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.92rem", fontFamily: "inherit", outline: "none", background: "#F8FAFC", boxSizing: "border-box" }} />
        </div>

        {/* Content */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Content</label>
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)}
            placeholder={"Write your knowledge here...\n\nUse:\n**bold text**\n- bullet lists\n```sql\nSELECT * FROM table;\n```"}
            style={{ width: "100%", minHeight: 300, padding: "0.85rem 1rem", border: "1.5px solid #E1E7EF", borderRadius: 9, fontSize: "0.87rem", background: "#F8FAFC", lineHeight: 1.75, fontFamily: "'IBM Plex Mono', monospace", resize: "vertical", boxSizing: "border-box" }} />
        </div>

        {/* ── FILE ATTACHMENTS ── */}
        <div style={{ border: "1.5px dashed #CBD5E1", borderRadius: 12, padding: "1.4rem", background: "#F8FAFC" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0B1220", marginBottom: "0.15rem" }}>📎 Attachments</div>
              <div style={{ fontSize: "0.73rem", color: "#64748B" }}>Upload PDF, DOCX, or PPTX files. Visitors can download them from this page.</div>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "#1D4ED8", color: "#fff", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
              {uploading ? "⏳ Uploading…" : "＋ Add Files"}
              <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileUpload} style={{ display: "none" }} disabled={uploading} />
            </label>
          </div>

          {/* File type pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: attachments.length ? "1rem" : 0 }}>
            {[["📄","PDF"],["📝","DOCX"],["📊","PPTX"]].map(([icon, label]) => (
              <span key={label} style={{ background: "#EEF2FF", color: "#4338CA", border: "1px solid #C7D2FE", padding: "0.2rem 0.6rem", borderRadius: 100, fontSize: "0.7rem", fontWeight: 600 }}>{icon} {label}</span>
            ))}
          </div>

          {/* Attachment list */}
          {attachments.length === 0 && !uploading && (
            <div style={{ textAlign: "center", padding: "1.2rem", color: "#94A3B8", fontSize: "0.8rem" }}>No files attached yet</div>
          )}
          {attachments.map(att => {
            const meta = ALLOWED[att.type] || { icon: "📎", label: att.name.split(".").pop().toUpperCase() };
            return (
              <div key={att.id} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.75rem 1rem", background: "#fff", border: "1px solid #E1E7EF", borderRadius: 9, marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0B1220", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{att.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.1rem" }}>{meta.label} · {formatSize(att.size)} · {att.uploadedAt}</div>
                </div>
                <button onClick={() => removeAttachment(att.id)}
                  style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 6, padding: "0.3rem 0.65rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>✕ Remove</button>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => onSave(tid, { ...form, attachments })} className="btn"
            style={{ flex: 1, padding: "0.8rem", background: "#1D4ED8", color: "#fff", fontSize: "0.92rem", boxShadow: "0 4px 16px rgba(29,78,216,0.25)" }}>
            💾 Save Page
          </button>
          <button onClick={onCancel} className="btn" style={{ flex: 1, padding: "0.8rem", background: "#F4F6F9", color: "#374151", fontSize: "0.92rem", border: "1px solid #E1E7EF" }}>Cancel</button>
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
