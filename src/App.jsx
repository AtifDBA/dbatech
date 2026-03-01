import { useState, useEffect, useCallback } from "react";

// ── DEFAULT CONTENT DATA ──────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  {
    id: "databases",
    label: "Databases",
    icon: "🗄️",
    color: "#2563EB",
    lightColor: "#EFF6FF",
  },
  {
    id: "automation",
    label: "Automation",
    icon: "⚙️",
    color: "#7C3AED",
    lightColor: "#F5F3FF",
  },
  {
    id: "cloud",
    label: "Cloud Infrastructure",
    icon: "☁️",
    color: "#0891B2",
    lightColor: "#ECFEFF",
  },
];

const DEFAULT_TOPICS = [
  // ── DATABASES
  {
    id: "oracle",
    category: "databases",
    title: "Oracle Database",
    icon: "🔴",
    tagline: "Enterprise RDBMS",
    color: "#C74634",
    lightColor: "#FEF2F0",
    description:
      "Oracle Database is the world's leading enterprise RDBMS, trusted by Fortune 500 companies for mission-critical workloads. Master PL/SQL, RAC, Data Guard, and more.",
    pages: [
      {
        id: "oracle-intro",
        title: "Introduction to Oracle DB",
        content:
          "Oracle Database is an object-relational database management system (ORDBMS) produced by Oracle Corporation. It was first released in 1979 and remains the most widely used enterprise database system in the world.\n\n**Key Concepts:**\n- Instances and Databases\n- Oracle Memory Architecture (SGA, PGA)\n- Background Processes (SMON, PMON, DBWn, LGWR, CKPT)\n- Physical & Logical Storage Structures\n\n**When to use Oracle:**\nOracle excels in high-transaction, high-availability enterprise environments requiring advanced partitioning, RAC (Real Application Clusters), and robust security features.",
        lastUpdated: "2025-01-01",
      },
      {
        id: "oracle-sql",
        title: "SQL & PL/SQL Fundamentals",
        content:
          "PL/SQL is Oracle's procedural extension to SQL, enabling you to write powerful stored procedures, functions, triggers, and packages.\n\n**PL/SQL Block Structure:**\n```\nDECLARE\n  v_name VARCHAR2(50);\nBEGIN\n  SELECT first_name INTO v_name FROM employees WHERE id = 1;\n  DBMS_OUTPUT.PUT_LINE('Name: ' || v_name);\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN\n    DBMS_OUTPUT.PUT_LINE('Not found');\nEND;\n```\n\n**Key PL/SQL Features:**\n- Cursors (Implicit & Explicit)\n- Collections (VARRAY, Nested Tables, Associative Arrays)\n- Packages and Package Bodies\n- Exception Handling\n- Bulk Operations (FORALL, BULK COLLECT)",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "postgresql",
    category: "databases",
    title: "PostgreSQL",
    icon: "🐘",
    tagline: "Advanced Open Source RDBMS",
    color: "#336791",
    lightColor: "#EFF6FF",
    description:
      "PostgreSQL is the world's most advanced open-source relational database. Known for its reliability, feature richness, and extensibility — it powers modern applications worldwide.",
    pages: [
      {
        id: "pg-intro",
        title: "Getting Started with PostgreSQL",
        content:
          "PostgreSQL (or Postgres) is a powerful, open-source object-relational database system with over 35 years of active development. It runs on all major operating systems and is fully ACID-compliant.\n\n**Key Features:**\n- Full ACID compliance\n- Advanced JSON/JSONB support\n- Powerful indexing (B-tree, GiST, GIN, BRIN)\n- Table partitioning\n- Foreign Data Wrappers (FDW)\n- Logical replication\n- Row-level security\n\n**Installation:**\n```bash\n# Ubuntu/Debian\nsudo apt install postgresql postgresql-contrib\n\n# Start service\nsudo systemctl start postgresql\n\n# Connect\npsql -U postgres\n```",
        lastUpdated: "2025-01-01",
      },
      {
        id: "pg-json",
        title: "JSON & JSONB Operations",
        content:
          "PostgreSQL offers unmatched JSON support, making it a hybrid between relational and document databases.\n\n**JSON vs JSONB:**\n- JSON: Stored as plain text, preserves whitespace\n- JSONB: Binary format, faster queries, supports indexing\n\n**Common Operators:**\n```sql\n-- Access JSON field\nSELECT data->>'name' FROM products;\n\n-- Check containment\nSELECT * FROM products WHERE data @> '{\"active\": true}';\n\n-- GIN index for fast JSON queries\nCREATE INDEX idx_gin ON products USING GIN(data);\n\n-- JSON aggregation\nSELECT json_agg(row_to_json(e))\nFROM employees e WHERE dept = 'Engineering';\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "mysql",
    category: "databases",
    title: "MySQL",
    icon: "🐬",
    tagline: "World's Most Popular Open Source DB",
    color: "#F29111",
    lightColor: "#FFFBEB",
    description:
      "MySQL is the most widely-used open-source relational database. It powers countless web applications, from startups to global enterprises.",
    pages: [
      {
        id: "mysql-intro",
        title: "MySQL Essentials",
        content:
          "MySQL is an open-source RDBMS owned by Oracle Corporation. It's the 'M' in the LAMP stack and powers sites like Facebook, Twitter, and YouTube.\n\n**Storage Engines:**\n- InnoDB (default): ACID, foreign keys, row-level locking\n- MyISAM: Faster reads, no transactions\n- Memory: Stored in RAM, volatile\n\n**Key Commands:**\n```sql\n-- Create database\nCREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n\n-- Show status\nSHOW ENGINE INNODB STATUS;\n\n-- Check slow queries\nSHOW VARIABLES LIKE 'slow_query_log';\nSET GLOBAL slow_query_log = 'ON';\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "mongodb",
    category: "databases",
    title: "MongoDB",
    icon: "🍃",
    tagline: "Leading NoSQL Document Database",
    color: "#4CAF50",
    lightColor: "#F0FDF4",
    description:
      "MongoDB is the most popular NoSQL database, storing data in flexible, JSON-like BSON documents. Perfect for modern, scalable applications.",
    pages: [
      {
        id: "mongo-intro",
        title: "MongoDB Fundamentals",
        content:
          "MongoDB stores data in BSON (Binary JSON) format within collections (analogous to tables). Each document can have a different structure, offering great flexibility.\n\n**Core Concepts:**\n- Database → Collection → Document\n- Dynamic schema — no predefined structure required\n- Horizontal scaling via sharding\n- Replica sets for high availability\n\n**Basic Operations:**\n```javascript\n// Insert\ndb.users.insertOne({ name: 'Alice', age: 30, tags: ['admin', 'dev'] });\n\n// Query with filter\ndb.users.find({ age: { $gte: 25 }, 'tags': 'admin' });\n\n// Aggregation Pipeline\ndb.orders.aggregate([\n  { $match: { status: 'shipped' } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' } } },\n  { $sort: { total: -1 } }\n]);\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "sqlserver",
    category: "databases",
    title: "SQL Server",
    icon: "🪟",
    tagline: "Microsoft's Enterprise RDBMS",
    color: "#CC2927",
    lightColor: "#FEF2F2",
    description:
      "Microsoft SQL Server is a comprehensive enterprise database platform with deep Azure integration, advanced analytics, and robust HA/DR capabilities.",
    pages: [
      {
        id: "mssql-intro",
        title: "SQL Server Overview",
        content:
          "SQL Server is Microsoft's flagship relational database management system, offering enterprise-grade features, tight Azure integration, and broad tool support.\n\n**Key Editions:**\n- Enterprise: Full feature set, unlimited virtualization\n- Standard: Core DB capabilities\n- Developer: Full features, free for dev/test\n- Express: Free, limited to 10GB\n\n**T-SQL Essentials:**\n```sql\n-- Common Table Expression (CTE)\nWITH SalesCTE AS (\n  SELECT EmployeeID, SUM(Amount) AS Total\n  FROM Sales GROUP BY EmployeeID\n)\nSELECT e.Name, c.Total\nFROM Employees e JOIN SalesCTE c ON e.ID = c.EmployeeID;\n\n-- Window Functions\nSELECT Name, Salary,\n  RANK() OVER (PARTITION BY Dept ORDER BY Salary DESC) AS Rnk\nFROM Employees;\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },

  // ── AUTOMATION
  {
    id: "ansible",
    category: "automation",
    title: "Ansible",
    icon: "🤖",
    tagline: "IT Automation & Configuration Mgmt",
    color: "#EE0000",
    lightColor: "#FFF1F1",
    description:
      "Ansible is an open-source automation tool for configuration management, application deployment, and task automation — using simple YAML playbooks.",
    pages: [
      {
        id: "ansible-intro",
        title: "Ansible Basics",
        content:
          "Ansible is agentless — it connects via SSH (Linux) or WinRM (Windows) to managed nodes. It uses YAML-based Playbooks to define automation tasks.\n\n**Core Concepts:**\n- Inventory: List of managed hosts\n- Playbook: YAML file of tasks\n- Module: Unit of work (e.g., apt, copy, service)\n- Role: Reusable collection of tasks\n\n**Sample Playbook:**\n```yaml\n---\n- name: Configure web server\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Install Apache\n      apt:\n        name: apache2\n        state: present\n\n    - name: Start Apache\n      service:\n        name: apache2\n        state: started\n        enabled: yes\n\n    - name: Deploy config\n      template:\n        src: apache.conf.j2\n        dest: /etc/apache2/sites-available/app.conf\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "terraform",
    category: "automation",
    title: "Terraform",
    icon: "🏗️",
    tagline: "Infrastructure as Code",
    color: "#7B42BC",
    lightColor: "#F5F3FF",
    description:
      "Terraform by HashiCorp lets you define cloud and on-prem infrastructure in human-readable HCL configuration files, enabling versioned, repeatable infrastructure deployments.",
    pages: [
      {
        id: "tf-intro",
        title: "Terraform Getting Started",
        content:
          "Terraform uses HCL (HashiCorp Configuration Language) to define infrastructure resources declaratively. It maintains a state file to track managed resources.\n\n**Core Workflow:**\n```bash\nterraform init    # Download providers\nterraform plan    # Preview changes\nterraform apply   # Apply changes\nterraform destroy # Tear down\n```\n\n**Example — AWS EC2:**\n```hcl\nterraform {\n  required_providers {\n    aws = { source = \"hashicorp/aws\" version = \"~> 5.0\" }\n  }\n}\n\nprovider \"aws\" { region = \"us-east-1\" }\n\nresource \"aws_instance\" \"web\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t3.micro\"\n  tags = { Name = \"WebServer\" }\n}\n\noutput \"public_ip\" {\n  value = aws_instance.web.public_ip\n}\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "cicd",
    category: "automation",
    title: "CI/CD Pipelines",
    icon: "🔄",
    tagline: "Continuous Integration & Delivery",
    color: "#0EA5E9",
    lightColor: "#F0F9FF",
    description:
      "Learn to build robust CI/CD pipelines using Jenkins, GitHub Actions, and GitLab CI to automate testing, building, and deploying applications at scale.",
    pages: [
      {
        id: "cicd-intro",
        title: "CI/CD Fundamentals",
        content:
          "CI/CD (Continuous Integration / Continuous Delivery) automates the software delivery pipeline from code commit to production deployment.\n\n**CI/CD Stages:**\n1. Source: Code commit triggers pipeline\n2. Build: Compile / package application\n3. Test: Unit, integration, security tests\n4. Stage: Deploy to staging environment\n5. Deploy: Release to production\n\n**GitHub Actions Example:**\n```yaml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },

  // ── CLOUD INFRASTRUCTURE
  {
    id: "aws",
    category: "cloud",
    title: "Amazon Web Services",
    icon: "🟠",
    tagline: "Market-Leading Cloud Platform",
    color: "#FF9900",
    lightColor: "#FFFBEB",
    description:
      "AWS is the world's most comprehensive cloud platform, offering 200+ fully featured services for compute, storage, databases, networking, AI/ML, and more.",
    pages: [
      {
        id: "aws-intro",
        title: "AWS Core Services",
        content:
          "Amazon Web Services (AWS) launched in 2006 and now holds the largest share of the cloud market. It operates in 33 geographic regions worldwide.\n\n**Essential Services:**\n- EC2: Virtual servers (instances)\n- S3: Object storage, 99.999999999% durability\n- RDS: Managed relational databases\n- Lambda: Serverless compute\n- VPC: Isolated virtual network\n- IAM: Identity & access management\n- CloudWatch: Monitoring & logging\n- EKS: Managed Kubernetes\n\n**AWS CLI Quick Start:**\n```bash\n# Configure\naws configure\n\n# List S3 buckets\naws s3 ls\n\n# Launch EC2 instance\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.micro \\\n  --key-name MyKeyPair\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "azure",
    category: "cloud",
    title: "Microsoft Azure",
    icon: "🔵",
    tagline: "Enterprise Cloud from Microsoft",
    color: "#0078D4",
    lightColor: "#EFF6FF",
    description:
      "Azure is Microsoft's cloud platform, deeply integrated with Microsoft products and ideal for enterprise workloads, hybrid cloud scenarios, and .NET development.",
    pages: [
      {
        id: "azure-intro",
        title: "Azure Fundamentals",
        content:
          "Microsoft Azure provides 200+ cloud services across compute, storage, networking, databases, AI, IoT, and more. It's particularly strong in hybrid cloud and enterprise scenarios.\n\n**Core Services:**\n- Azure VMs: IaaS compute\n- Azure Blob Storage: Object storage\n- Azure SQL Database: Managed SQL\n- Azure Functions: Serverless\n- Azure AD: Identity & access\n- AKS: Managed Kubernetes\n- Azure DevOps: Full DevOps platform\n\n**Azure CLI:**\n```bash\n# Login\naz login\n\n# Create resource group\naz group create --name MyRG --location eastus\n\n# Create storage account\naz storage account create \\\n  --name mystorageacct \\\n  --resource-group MyRG \\\n  --sku Standard_LRS\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
  {
    id: "kubernetes",
    category: "cloud",
    title: "Kubernetes",
    icon: "⚓",
    tagline: "Container Orchestration Platform",
    color: "#326CE5",
    lightColor: "#EFF6FF",
    description:
      "Kubernetes (K8s) is the de facto standard for container orchestration, automating deployment, scaling, and management of containerized applications.",
    pages: [
      {
        id: "k8s-intro",
        title: "Kubernetes Architecture",
        content:
          "Kubernetes clusters consist of a control plane and worker nodes. The control plane manages the cluster state, while worker nodes run the containerized workloads.\n\n**Key Objects:**\n- Pod: Smallest deployable unit (one or more containers)\n- Deployment: Manages replica sets and rolling updates\n- Service: Stable network endpoint for pods\n- ConfigMap/Secret: Configuration management\n- PersistentVolume: Storage abstraction\n\n**Essential kubectl Commands:**\n```bash\n# Get cluster info\nkubectl cluster-info\n\n# Deploy an app\nkubectl create deployment nginx --image=nginx:latest\n\n# Expose as service\nkubectl expose deployment nginx --port=80 --type=LoadBalancer\n\n# Scale\nkubectl scale deployment nginx --replicas=3\n\n# Get pods with details\nkubectl get pods -o wide\n\n# View logs\nkubectl logs -f pod-name\n```",
        lastUpdated: "2025-01-01",
      },
    ],
  },
];

// ── STORAGE HELPERS ────────────────────────────────────────────────────
async function loadData() {
  try {
    const r = await window.storage.get("itplatform-topics");
    if (r) return JSON.parse(r.value);
  } catch {}
  return DEFAULT_TOPICS;
}

async function saveData(topics) {
  try {
    await window.storage.set("itplatform-topics", JSON.stringify(topics));
  } catch {}
}

// ── MARKDOWN-LITE RENDERER ─────────────────────────────────────────────
function renderContent(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem 1.2rem;border-radius:10px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li style='margin-bottom:0.3rem'>$1</li>")
    .replace(/(<li[\s\S]*?<\/li>)/g, "<ul style='margin:0.5rem 0 0.5rem 1.2rem'>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<)(.+)$/gm, "$1")
    .replace(/^(<p>)?(.+)(<\/p>)?$/gm, (m) => (m.startsWith("<") ? m : `<p>${m}</p>`));
}

// ── ICONS MAP ──────────────────────────────────────────────────────────
const CATEGORY_ICONS = { databases: "🗄️", automation: "⚙️", cloud: "☁️" };

// ══════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════
export default function App() {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState("home"); // home | browse | topic | page | admin
  const [activeTopic, setActiveTopic] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  // Admin state
  const [adminView, setAdminView] = useState("topics"); // topics | edit-topic | edit-page
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingPageTopicId, setEditingPageTopicId] = useState(null);

  useEffect(() => {
    loadData().then(setTopics);
  }, []);

  const persist = useCallback(
    (newTopics) => {
      setTopics(newTopics);
      saveData(newTopics);
    },
    []
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Navigate helpers
  const goHome = () => { setView("home"); setActiveTopic(null); setActivePage(null); };
  const goBrowse = (cat = "all") => { setView("browse"); setFilterCat(cat); setActiveTopic(null); };
  const goTopic = (t) => { setActiveTopic(t); setView("topic"); setActivePage(null); };
  const goPage = (topic, page) => { setActiveTopic(topic); setActivePage(page); setView("page"); };
  const goAdmin = () => { setView("admin"); setAdminView("topics"); setEditingTopic(null); setEditingPage(null); };

  // ── FILTERED TOPICS ────────────────────────────────────────────────
  const filtered = topics.filter((t) => {
    const matchCat = filterCat === "all" || t.category === filterCat;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const byCategory = DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    items: topics.filter((t) => t.category === c.id),
  }));

  // ── ADMIN: SAVE TOPIC ──────────────────────────────────────────────
  const saveTopic = (data) => {
    let next;
    if (data.id && topics.find((t) => t.id === data.id)) {
      next = topics.map((t) => (t.id === data.id ? { ...t, ...data } : t));
    } else {
      const newTopic = { ...data, id: "topic-" + Date.now(), pages: [] };
      next = [...topics, newTopic];
    }
    persist(next);
    setAdminView("topics");
    setEditingTopic(null);
    showToast("✅ Topic saved!");
  };

  // ── ADMIN: DELETE TOPIC ────────────────────────────────────────────
  const deleteTopic = (id) => {
    persist(topics.filter((t) => t.id !== id));
    showToast("🗑️ Topic deleted");
  };

  // ── ADMIN: SAVE PAGE ───────────────────────────────────────────────
  const savePage = (topicId, pageData) => {
    const next = topics.map((t) => {
      if (t.id !== topicId) return t;
      const existing = t.pages.find((p) => p.id === pageData.id);
      const pages = existing
        ? t.pages.map((p) => (p.id === pageData.id ? { ...p, ...pageData, lastUpdated: new Date().toISOString().split("T")[0] } : p))
        : [...t.pages, { ...pageData, id: "page-" + Date.now(), lastUpdated: new Date().toISOString().split("T")[0] }];
      return { ...t, pages };
    });
    persist(next);
    setAdminView("topics");
    setEditingPage(null);
    setEditingPageTopicId(null);
    showToast("✅ Knowledge page saved!");
  };

  // ── ADMIN: DELETE PAGE ─────────────────────────────────────────────
  const deletePage = (topicId, pageId) => {
    const next = topics.map((t) =>
      t.id === topicId ? { ...t, pages: t.pages.filter((p) => p.id !== pageId) } : t
    );
    persist(next);
    showToast("🗑️ Page deleted");
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#FAFAF7", color: "#1A1A2E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #c1c1d4; border-radius: 10px; }
        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(26,26,46,0.13); }
        .btn { border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s; border-radius: 9px; }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        input, textarea, select { font-family: 'DM Sans', sans-serif; outline: none; }
        textarea { resize: vertical; }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tag { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 100px; font-size: 0.72rem; font-weight: 600; }
        .slide-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .slide-row::-webkit-scrollbar { height: 4px; }
        .slide-row::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid #E2E2EC", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4%", height: 62 }}>
        <div onClick={goHome} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", letterSpacing: "-0.5px" }}>
          IT<span style={{ color: "#2563EB" }}>Learn</span> Hub
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[["Home", goHome], ["Browse", () => goBrowse()], ...DEFAULT_CATEGORIES.map((c) => [c.label, () => goBrowse(c.id)])].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{ padding: "0.4rem 0.85rem", background: "transparent", border: "none", color: "#6B7280", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", borderRadius: 8, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#2563EB")} onMouseLeave={(e) => (e.target.style.color = "#6B7280")}>
              {label}
            </button>
          ))}
          <button onClick={goAdmin} className="btn" style={{ padding: "0.4rem 1rem", background: "#1A1A2E", color: "#fff", fontSize: "0.82rem" }}>
            ✏️ Manage
          </button>
        </div>
      </nav>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, background: "#1A1A2E", color: "#fff", borderRadius: 12, padding: "0.85rem 1.5rem", fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "fadeIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* ══════════ HOME VIEW ══════════ */}
      {view === "home" && (
        <div className="fade-in">
          {/* Hero */}
          <section style={{ background: "#fff", padding: "70px 6% 60px", borderBottom: "1px solid #E2E2EC" }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", borderRadius: 100, padding: "0.3rem 0.9rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
                🚀 Your Customizable IT Knowledge Hub
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.13, marginBottom: "1rem" }}>
                Master <span style={{ color: "#2563EB" }}>Databases, Automation</span> & Cloud Technologies
              </h1>
              <p style={{ fontSize: "1rem", color: "#6B7280", lineHeight: 1.78, marginBottom: "2rem", maxWidth: 520 }}>
                A living knowledge base you can grow over time. Add topics, write pages, and build your own IT learning library — all in one place.
              </p>
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.8rem 1.6rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>Browse All Topics →</button>
                <button onClick={goAdmin} className="btn" style={{ padding: "0.8rem 1.6rem", background: "transparent", color: "#1A1A2E", border: "1.5px solid #E2E2EC", fontSize: "0.92rem" }}>✏️ Add Content</button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div style={{ background: "#1A1A2E", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "2rem 6%" }}>
            {[
              [topics.length, "Total Topics"],
              [topics.reduce((a, t) => a + t.pages.length, 0), "Knowledge Pages"],
              [DEFAULT_CATEGORIES.length, "Technology Areas"],
              ["∞", "Always Growing"],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center", padding: "0.5rem" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          {byCategory.map((cat) => (
            <section key={cat.id} style={{ padding: "50px 6% 40px", borderBottom: "1px solid #E2E2EC" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: cat.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                    {cat.icon} {cat.label}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900 }}>
                    {cat.label === "Databases" ? "Database Platforms" : cat.label === "Automation" ? "Automation Tools" : "Cloud Infrastructure"}
                  </div>
                </div>
                <button onClick={() => goBrowse(cat.id)} className="btn" style={{ padding: "0.5rem 1.1rem", background: cat.lightColor, color: cat.color, border: `1px solid ${cat.color}30`, fontSize: "0.82rem" }}>
                  See All {cat.items.length} →
                </button>
              </div>
              <div className="slide-row">
                {cat.items.map((t) => (
                  <div key={t.id} onClick={() => goTopic(t)} className="hover-lift" style={{ minWidth: 220, background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", cursor: "pointer", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: "14px 14px 0 0" }} />
                    <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>{t.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.35rem" }}>{t.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280", marginBottom: "0.8rem", lineHeight: 1.5 }}>{t.description.substring(0, 80)}…</div>
                    <span className="tag" style={{ background: t.lightColor, color: t.color }}>{t.pages.length} pages</span>
                  </div>
                ))}
                <div onClick={goAdmin} className="hover-lift" style={{ minWidth: 200, background: "#F9FAFB", border: "2px dashed #E2E2EC", borderRadius: 14, padding: "1.5rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#9CA3AF" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>＋</div>
                  <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>Add New Topic</div>
                </div>
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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem", marginTop: "0.8rem" }}>Browse Topics</h1>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {[{ id: "all", label: "All", icon: "📚", color: "#2563EB" }, ...DEFAULT_CATEGORIES].map((c) => (
                <button key={c.id} onClick={() => setFilterCat(c.id)} className="btn" style={{ padding: "0.4rem 1rem", background: filterCat === c.id ? (c.color || "#2563EB") : "#F3F4F6", color: filterCat === c.id ? "#fff" : "#374151", fontSize: "0.82rem" }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search topics…" style={{ width: "100%", maxWidth: 420, padding: "0.65rem 1rem", border: "1.5px solid #E2E2EC", borderRadius: 10, fontSize: "0.88rem", background: "#FAFAF7" }} />
          </div>
          <div style={{ padding: "2rem 6%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1.2rem" }}>
            {filtered.map((t) => (
              <TopicCard key={t.id} topic={t} onClick={() => goTopic(t)} />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <div style={{ fontWeight: 600 }}>No topics found</div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Try a different search or <span onClick={goAdmin} style={{ color: "#2563EB", cursor: "pointer" }}>add a new topic</span>.</div>
              </div>
            )}
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
              <button onClick={() => { setEditingPage({ title: "", content: "" }); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }} className="btn" style={{ padding: "0.6rem 1.2rem", background: activeTopic.lightColor, color: activeTopic.color, border: `1px solid ${activeTopic.color}30`, fontSize: "0.83rem", whiteSpace: "nowrap" }}>
                ＋ Add Page
              </button>
            </div>
          </div>
          <div style={{ padding: "2.5rem 6%" }}>
            {activeTopic.pages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF", border: "2px dashed #E2E2EC", borderRadius: 16 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📄</div>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No pages yet</div>
                <div style={{ fontSize: "0.85rem" }}>Click <strong>+ Add Page</strong> to start adding knowledge content.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1rem" }}>
                {activeTopic.pages.map((page) => (
                  <div key={page.id} className="hover-lift" style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div onClick={() => goPage(activeTopic, page)} style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{page.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Last updated: {page.lastUpdated}</div>
                        <div style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: "0.5rem", lineHeight: 1.5 }}>
                          {page.content.replace(/```[\s\S]*?```/g, "[code]").replace(/\*\*/g, "").substring(0, 100)}…
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.3rem", marginLeft: "0.5rem" }}>
                        <button onClick={() => { setEditingPage(page); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }} style={{ background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 7, padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.78rem" }}>Edit</button>
                        <button onClick={() => { deletePage(activeTopic.id, page.id); setTopics((prev) => prev.map((t) => t.id === activeTopic.id ? { ...t, pages: t.pages.filter((p) => p.id !== page.id) } : t)); }} style={{ background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 7, padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.78rem" }}>Del</button>
                      </div>
                    </div>
                    <div onClick={() => goPage(activeTopic, page)} style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#2563EB", fontWeight: 600 }}>Read more →</div>
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
              <button onClick={() => { setEditingPage(activePage); setEditingPageTopicId(activeTopic.id); setView("admin"); setAdminView("edit-page"); }} className="btn" style={{ padding: "0.5rem 1.1rem", background: "#EFF6FF", color: "#2563EB", fontSize: "0.82rem" }}>
                ✏️ Edit Page
              </button>
            </div>
          </div>
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 6%" }}>
            <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "2.5rem", lineHeight: 1.8, fontSize: "0.93rem", color: "#2D2D44" }}
              dangerouslySetInnerHTML={{ __html: renderContent(activePage.content) }} />
          </div>
        </div>
      )}

      {/* ══════════ ADMIN VIEW ══════════ */}
      {view === "admin" && (
        <div className="fade-in">
          <div style={{ background: "#1A1A2E", padding: "35px 6% 28px" }}>
            <Breadcrumb dark items={[{ label: "Home", fn: goHome }, { label: "Content Manager" }]} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff", marginTop: "0.8rem" }}>✏️ Content Manager</h1>
            <p style={{ color: "#9CA3AF", marginTop: "0.3rem", fontSize: "0.88rem" }}>Add, edit, and organize your IT knowledge base.</p>
          </div>

          {/* ── ADMIN: TOPICS LIST ── */}
          {adminView === "topics" && (
            <div style={{ padding: "2rem 6%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>All Topics ({topics.length})</h2>
                <button onClick={() => { setEditingTopic({ title: "", icon: "📘", category: "databases", tagline: "", color: "#2563EB", lightColor: "#EFF6FF", description: "" }); setAdminView("edit-topic"); }} className="btn" style={{ padding: "0.55rem 1.2rem", background: "#2563EB", color: "#fff", fontSize: "0.85rem" }}>
                  ＋ New Topic
                </button>
              </div>
              {DEFAULT_CATEGORIES.map((cat) => {
                const catTopics = topics.filter((t) => t.category === cat.id);
                return (
                  <div key={cat.id} style={{ marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: cat.color, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                      {cat.icon} {cat.label}
                    </div>
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
                      {catTopics.length === 0 && <div style={{ fontSize: "0.83rem", color: "#9CA3AF", padding: "0.5rem 0" }}>No topics in this category yet.</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── ADMIN: EDIT TOPIC ── */}
          {adminView === "edit-topic" && editingTopic !== null && (
            <TopicEditor topic={editingTopic} onSave={saveTopic} onCancel={() => { setAdminView("topics"); setEditingTopic(null); }} categories={DEFAULT_CATEGORIES} />
          )}

          {/* ── ADMIN: EDIT PAGE ── */}
          {adminView === "edit-page" && editingPage !== null && (
            <PageEditor page={editingPage} topicId={editingPageTopicId} topics={topics} onSave={savePage} onCancel={() => { setAdminView("topics"); setEditingPage(null); setEditingPageTopicId(null); }} />
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════════

function Breadcrumb({ items, dark }) {
  return (
    <div style={{ fontSize: "0.8rem", color: dark ? "#6B7280" : "#9CA3AF", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: "0 0.2rem", opacity: 0.5 }}>/</span>}
          {item.fn ? (
            <span onClick={item.fn} style={{ cursor: "pointer", color: dark ? "#9CA3AF" : "#2563EB" }}>{item.label}</span>
          ) : (
            <span style={{ color: dark ? "#E5E7EB" : "#374151", fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function TopicCard({ topic, onClick }) {
  return (
    <div onClick={onClick} className="hover-lift" style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.5rem", cursor: "pointer", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: topic.color, borderRadius: "14px 14px 0 0" }} />
      <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>{topic.icon}</div>
      <div style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "0.3rem" }}>{topic.title}</div>
      <div style={{ fontSize: "0.78rem", color: topic.color, fontWeight: 600, marginBottom: "0.6rem" }}>{topic.tagline}</div>
      <div style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "1rem" }}>
        {topic.description.substring(0, 100)}…
      </div>
      <span style={{ background: topic.lightColor, color: topic.color, padding: "0.2rem 0.65rem", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>
        {topic.pages.length} page{topic.pages.length !== 1 ? "s" : ""}
      </span>
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
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
          <button onClick={() => onSave(form)} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>
            Save Topic
          </button>
          <button onClick={onCancel} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#F3F4F6", color: "#374151", fontSize: "0.92rem" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PageEditor({ page, topicId, topics, onSave, onCancel }) {
  const [form, setForm] = useState({ ...page });
  const [tid, setTid] = useState(topicId || (topics[0]?.id ?? ""));
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 6%" }}>
      <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.4rem" }}>{form.id ? "Edit Knowledge Page" : "New Knowledge Page"}</h2>
      <p style={{ fontSize: "0.83rem", color: "#6B7280", marginBottom: "1.5rem" }}>Supports <strong>**bold**</strong>, code blocks with triple backticks, and bullet lists with <strong>- item</strong></p>
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
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)} placeholder={"Write your knowledge here...\n\nSupports:\n**bold text**\n- bullet lists\n```sql\nSELECT * FROM table;\n```"} style={{ width: "100%", minHeight: 340, padding: "0.85rem 1rem", border: "1.5px solid #E2E2EC", borderRadius: 9, fontSize: "0.87rem", background: "#FAFAF7", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
          <button onClick={() => onSave(tid, form)} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>
            💾 Save Page
          </button>
          <button onClick={onCancel} className="btn" style={{ flex: 1, padding: "0.75rem", background: "#F3F4F6", color: "#374151", fontSize: "0.92rem" }}>
            Cancel
          </button>
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
