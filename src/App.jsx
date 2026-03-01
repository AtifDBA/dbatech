import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// 🔐 SECURITY CONFIG — CHANGE THIS PASSWORD BEFORE DEPLOYING!
// ══════════════════════════════════════════════════════════════════════
const ADMIN_PASSWORD = "DBAtech@2025#Secure";
const MAX_LOGIN_ATTEMPTS = 5;        // Lock after 5 wrong attempts
const LOCKOUT_MINUTES = 15;          // Locked for 15 minutes
const SESSION_HOURS = 8;             // Auto-logout after 8 hours

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
    if (r) return JSON.parse(r.value);
  } catch {}
  return DEFAULT_TOPICS;
}
async function saveData(topics) {
  try { await window.storage.set("itplatform-topics", JSON.stringify(topics)); } catch {}
}

// ── MARKDOWN-LITE RENDERER ─────────────────────────────────────────────
function renderContent(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem 1.2rem;border-radius:10px;font-family:'DM Mono',monospace;font-size:0.78rem;line-height:1.7;overflow-x:auto;margin:1rem 0"><code>${code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li style='margin-bottom:0.3rem'>$1</li>")
    .replace(/(<li[\s\S]*?<\/li>)/g, "<ul style='margin:0.5rem 0 0.5rem 1.2rem'>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<)(.+)$/gm, "$1");
}

const CATEGORY_ICONS = { databases: "🗄️", automation: "⚙️", cloud: "☁️" };

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
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                style={{ width: "100%", padding: "0.85rem 3rem 0.85rem 1rem", border: `1.5px solid ${error ? "#FCA5A5" : "#E2E2EC"}`, borderRadius: 10, fontSize: "0.95rem", background: "#FAFAF7", outline: "none" }}
                autoFocus
              />
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
  const [toast, setToast]             = useState(null);
  const [showLogin, setShowLogin]     = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [adminView, setAdminView]     = useState("topics");
  const [editingTopic, setEditingTopic]         = useState(null);
  const [editingPage, setEditingPage]           = useState(null);
  const [editingPageTopicId, setEditingPageTopicId] = useState(null);

  // Check existing valid session on mount
  useEffect(() => {
    loadData().then(setTopics);
    const sec = getSecurityState();
    if (isSessionValid(sec)) setIsAdmin(true);
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (!isAdmin) return;
    const sec = getSecurityState();
    const remaining = (SESSION_HOURS * 3600 * 1000) - (Date.now() - sec.loginTime);
    const timer = setTimeout(() => { handleLogout(); showToast("⏰ Session expired. Please login again."); }, remaining);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const persist = useCallback((newTopics) => { setTopics(newTopics); saveData(newTopics); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleLogout = () => {
    const sec = getSecurityState();
    setSecurityState({ ...sec, loggedIn: false, loginTime: null });
    setIsAdmin(false);
    setView("home");
    showToast("👋 Logged out successfully");
  };

  const handleAdminClick = () => {
    if (isAdmin) { setView("admin"); setAdminView("topics"); }
    else setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setView("admin");
    setAdminView("topics");
    showToast("✅ Welcome back! Admin session started.");
  };

  // Navigation
  const goHome    = () => { setView("home"); setActiveTopic(null); setActivePage(null); };
  const goAbout   = () => { setView("about"); setActiveTopic(null); setActivePage(null); };
  const goBrowse  = (cat = "all") => { setView("browse"); setFilterCat(cat); setActiveTopic(null); };
  const goTopic   = (t) => { setActiveTopic(t); setView("topic"); setActivePage(null); };
  const goPage    = (topic, page) => { setActiveTopic(topic); setActivePage(page); setView("page"); };

  // Filtered topics
  const filtered = topics.filter((t) => {
    const matchCat = filterCat === "all" || t.category === filterCat;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const byCategory = DEFAULT_CATEGORIES.map((c) => ({ ...c, items: topics.filter((t) => t.category === c.id) }));

  // Admin actions
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

  // ── RENDER ──────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#FAFAF7", color: "#1A1A2E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
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

      {/* 🔐 LOGIN MODAL */}
      {showLogin && <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, background: "#1A1A2E", color: "#fff", borderRadius: 12, padding: "0.85rem 1.5rem", fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid #E2E2EC", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4%", height: 62 }}>
        <div onClick={goHome} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer" }}>
          IT<span style={{ color: "#2563EB" }}>Learn</span> Hub
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
          {[["Home", goHome], ["About Me", goAbout], ["Browse", () => goBrowse()], ...DEFAULT_CATEGORIES.map((c) => [c.label, () => goBrowse(c.id)])].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{ padding: "0.4rem 0.85rem", background: "transparent", border: "none", color: "#6B7280", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", borderRadius: 8 }}
              onMouseEnter={(e) => e.target.style.color = "#2563EB"} onMouseLeave={(e) => e.target.style.color = "#6B7280"}>
              {label}
            </button>
          ))}

          {/* Admin button — always visible but requires password */}
          <button onClick={handleAdminClick} className="btn" style={{ padding: "0.4rem 1rem", background: isAdmin ? "#1A1A2E" : "#F3F4F6", color: isAdmin ? "#fff" : "#374151", fontSize: "0.82rem" }}>
            {isAdmin ? "✏️ Manage" : "🔐 Admin"}
          </button>

          {/* Logout — only shown when logged in */}
          {isAdmin && (
            <button onClick={handleLogout} className="btn" style={{ padding: "0.4rem 0.85rem", background: "#FEF2F2", color: "#DC2626", fontSize: "0.78rem" }}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* ══════════ HOME VIEW ══════════ */}
      {view === "home" && (
        <div className="fade-in">
          <section style={{ background: "#fff", padding: "70px 6% 60px", borderBottom: "1px solid #E2E2EC" }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", borderRadius: 100, padding: "0.3rem 0.9rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
                🚀 IT Knowledge Hub — Databases · Automation · Cloud
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.13, marginBottom: "1rem" }}>
                Master <span style={{ color: "#2563EB" }}>Databases, Automation</span> & Cloud Technologies
              </h1>
              <p style={{ fontSize: "1rem", color: "#6B7280", lineHeight: 1.78, marginBottom: "2rem", maxWidth: 520 }}>
                A professional IT knowledge base covering Oracle, PostgreSQL, MySQL, MongoDB, SQL Server, Ansible, Terraform, AWS, Azure, and Kubernetes.
              </p>
              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                <button onClick={() => goBrowse()} className="btn" style={{ padding: "0.8rem 1.6rem", background: "#2563EB", color: "#fff", fontSize: "0.92rem" }}>Browse All Topics →</button>
              </div>
            </div>
          </section>

          <div style={{ background: "#1A1A2E", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "2rem 6%" }}>
            {[[topics.length, "Total Topics"], [topics.reduce((a,t) => a + t.pages.length, 0), "Knowledge Pages"], [DEFAULT_CATEGORIES.length, "Technology Areas"], ["🔒", "Secured Admin"]].map(([n,l]) => (
              <div key={l} style={{ textAlign: "center", padding: "0.5rem" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginTop: 2 }}>{l}</div>
              </div>
            ))}
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search topics…" style={{ width: "100%", maxWidth: 420, padding: "0.65rem 1rem", border: "1.5px solid #E2E2EC", borderRadius: 10, fontSize: "0.88rem", background: "#FAFAF7" }} />
          </div>
          <div style={{ padding: "2rem 6%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1.2rem" }}>
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
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <div style={{ fontWeight: 600 }}>No topics found</div>
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
              {/* Add Page button — ADMIN ONLY */}
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
                      {/* Edit/Delete — ADMIN ONLY */}
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

            {/* 💬 COMMENTS SECTION */}
            <CommentsSection
              pageId={activeTopic.id + "-" + activePage.id}
              pageTitle={activePage.title}
              pageUrl={"https://dbatech-hub.onrender.com/" + activeTopic.id + "/" + activePage.id}
            />
          </div>
        </div>
      )}


      {/* ══════════ ABOUT ME VIEW ══════════ */}
      {view === "about" && (
        <div className="fade-in">

          {/* ── HERO BANNER ── */}
          <div style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)", padding: "70px 6% 60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -60, left: "30%", width: 240, height: 240, background: "radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap", position: "relative" }}>
              {/* Avatar */}
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #0891B2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", flexShrink: 0, boxShadow: "0 8px 32px rgba(37,99,235,0.4)", border: "3px solid rgba(255,255,255,0.15)" }}>
                👨‍💻
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#60A5FA", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  🌟 Senior Database Administrator
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "0.6rem" }}>
                  Atif — DBA & IT Professional
                </h1>
                <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.7, maxWidth: 520 }}>
                  11+ years of hands-on experience managing enterprise databases, building automation pipelines, and architecting cloud infrastructure across global organizations.
                </p>
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
                  <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "#0077B5", color: "#fff", borderRadius: 9, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}>
                    🔗 LinkedIn Profile
                  </a>
                 
                </div>
              </div>
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div style={{ background: "#2563EB", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "1.5rem 6%" }}>
            {[["20+", "Years Experience"], ["5+", "Database Platforms"], ["1000+", "Issues Resolved"], ["∞", "Pages of Knowledge"]].map(([n,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: "0.75rem", color: "#BFDBFE", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* ── MY STORY ── */}
          <div style={{ padding: "60px 6%", background: "#fff", borderBottom: "1px solid #E2E2EC" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>📖 My Story</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1.5rem", color: "#1A1A2E" }}>
                The Knowledge Sharing Journey
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85, marginBottom: "1rem" }}>
                    My journey in the world of databases began over <strong>20 years ago</strong>, starting with Oracle in enterprise environments. Over the years, I've worked across industries — managing mission-critical databases, building automation frameworks, and migrating workloads to the cloud.
                  </p>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85 }}>
                    Throughout my career, I noticed that many talented professionals struggled to find <strong>practical, real-world knowledge</strong> that goes beyond textbooks. That gap inspired me to build this hub — a place where I document everything I've learned, so others can grow faster.
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85, marginBottom: "1rem" }}>
                    Today this hub covers <strong>Oracle, PostgreSQL, MySQL, MongoDB, SQL Server</strong> — as well as modern topics like <strong>Automation with Ansible & Terraform</strong> and <strong>Cloud Infrastructure on AWS, Azure, and Kubernetes</strong>.
                  </p>
                  <p style={{ fontSize: "0.95rem", color: "#4B5563", lineHeight: 1.85 }}>
                    My goal is simple: <strong>share knowledge freely</strong>, help beginners break into the DBA field, and document solutions to problems that took me days to solve — so you can solve them in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── EXPERTISE AREAS ── */}
          <div style={{ padding: "60px 6%", background: "#FAFAF7" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>🛠️ Expertise</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1.8rem", color: "#1A1A2E" }}>Areas of Specialization</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "1.2rem" }}>
                {[
                  { icon: "🔴", title: "Oracle DBA", desc: "RAC, Data Guard, RMAN, PL/SQL, Performance Tuning, OEM", color: "#C74634", light: "#FEF2F0" },
                  { icon: "🐘", title: "PostgreSQL", desc: "Replication, Partitioning, JSON, Extensions, pgBouncer", color: "#336791", light: "#EFF6FF" },
                  { icon: "🐬", title: "MySQL", desc: "InnoDB, Replication, Galera Cluster, Performance Schema", color: "#F29111", light: "#FFFBEB" },
                  { icon: "🪟", title: "SQL Server", desc: "AlwaysOn, SSRS, SSIS, T-SQL, Azure SQL Integration", color: "#CC2927", light: "#FEF2F2" },
                  { icon: "🍃", title: "MongoDB", desc: "Sharding, Replica Sets, Aggregation, Atlas Cloud", color: "#4CAF50", light: "#F0FDF4" },
                  { icon: "⚙️", title: "Automation", desc: "Ansible, Terraform, CI/CD, Shell Scripting, Python", color: "#7C3AED", light: "#F5F3FF" },
                  { icon: "☁️", title: "Cloud", desc: "AWS RDS/Aurora, Azure SQL, GCP Cloud SQL, Kubernetes", color: "#0891B2", light: "#ECFEFF" },
                  { icon: "🐧", title: "Linux Admin", desc: "RHEL, Ubuntu, Storage, Networking, Security Hardening", color: "#374151", light: "#F9FAFB" },
                ].map((s) => (
                  <div key={s.title} style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 14, padding: "1.3rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.4rem", color: "#1A1A2E" }}>{s.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── JOURNEY TIMELINE ── */}
          <div style={{ padding: "60px 6%", background: "#fff", borderTop: "1px solid #E2E2EC", borderBottom: "1px solid #E2E2EC" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>📅 Timeline</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, marginBottom: "2rem", color: "#1A1A2E" }}>My Journey</h2>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 2, background: "#E2E2EC" }} />
                {[
                  { year: "2000s", icon: "🌱", title: "Started as Junior DBA", desc: "Began career managing Oracle databases in enterprise environments. Learned the fundamentals of database administration the hard way — by solving real production problems." },
                  { year: "2005s", icon: "📈", title: "Expanded to Multiple Platforms", desc: "Added SQL Server, MySQL to expertise. Started leading database projects and mentoring junior DBAs. Discovered the power of scripting for automation." },
                  { year: "2010s", icon: "🤖", title: "Embraced Automation", desc: "Adopted Ansible and shell scripting to automate repetitive DBA tasks. Built CI/CD pipelines for database deployments, saving hundreds of hours per year." },
                  { year: "2015s", icon: "☁️", title: "Cloud Migration Journey", desc: "Led migrations from on-premise databases to AWS RDS, Azure SQL, and GCP. Learned Kubernetes and container orchestration for database workloads." },
                  { year: "2020s", icon: "📚", title: "Started Knowledge Sharing", desc: "Began documenting 20+ years of hard-won knowledge. Built this hub to give back to the community that helped me grow throughout my career." },
                  { year: "Today", icon: "🚀", title: "ITLearn Hub", desc: "This platform is my commitment to the DBA and IT community — freely sharing everything I know about databases, automation, and cloud technologies." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", position: "relative" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#EFF6FF", border: "2px solid #2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0, zIndex: 1 }}>
                      {item.icon}
                    </div>
                    <div style={{ paddingTop: "0.2rem" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2563EB", marginBottom: "0.2rem" }}>{item.year}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1A1A2E", marginBottom: "0.4rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHY THIS HUB ── */}
          <div style={{ padding: "60px 6%", background: "#1A1A2E" }}>
            <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#60A5FA", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>💡 My Mission</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>
                Why I Built This Hub
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.8, maxWidth: 620, margin: "0 auto 2.5rem" }}>
                Throughout my career, I spent countless hours searching for answers that should have been documented somewhere. This hub is my answer to that problem — and my gift to the next generation of DBAs and IT professionals.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
                {[
                  { icon: "🎯", title: "Real-World Focus", desc: "Every page covers practical scenarios from actual production environments — not just theory." },
                  { icon: "🆓", title: "Always Free", desc: "Knowledge should be accessible to everyone. This hub will always be completely free to use." },
                  { icon: "🔄", title: "Always Growing", desc: "I add new content regularly as I learn, encounter new challenges, and discover better solutions." },
                ].map((w) => (
                  <div key={w.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1.5rem" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.7rem" }}>{w.icon}</div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem", marginBottom: "0.4rem" }}>{w.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.7 }}>{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CONTACT CTA ── */}
          <div style={{ padding: "50px 6%", background: "#EFF6FF", borderTop: "1px solid #BFDBFE", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🤝</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: "#1A1A2E", marginBottom: "0.6rem" }}>
              Let's Connect!
            </h3>
            <p style={{ color: "#6B7280", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
              Have a question, suggestion, or just want to discuss databases? I'd love to hear from you. Drop a comment on any page or reach out on LinkedIn.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/mokhtar-atif-dba" target="_blank" rel="noreferrer"
                style={{ padding: "0.75rem 1.8rem", background: "#0077B5", color: "#fff", borderRadius: 10, fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, textDecoration: "none" }}>
                🔗 Connect on LinkedIn
              </a>
              <button onClick={() => { window.scrollTo(0,0); }} style={{ padding: "0.75rem 1.8rem", background: "#fff", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: 10, fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer" }}
                onClick={() => { setView("browse"); }}>
                📚 Explore Knowledge Hub
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ══════════ ADMIN VIEW (PASSWORD PROTECTED) ══════════ */}
      {view === "admin" && isAdmin && (
        <div className="fade-in">
          <div style={{ background: "#1A1A2E", padding: "35px 6% 28px" }}>
            <Breadcrumb dark items={[{ label: "Home", fn: goHome }, { label: "Admin Panel" }]} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.8rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>🔐 Admin Panel</h1>
                <p style={{ color: "#9CA3AF", fontSize: "0.83rem", marginTop: "0.2rem" }}>
                  🛡️ Secure session · Auto-expires in {SESSION_HOURS}h · Only you can see this
                </p>
              </div>
              <button onClick={handleLogout} className="btn" style={{ padding: "0.5rem 1.1rem", background: "#DC2626", color: "#fff", fontSize: "0.82rem" }}>
                🚪 Logout
              </button>
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
        </div>
      )}

      {/* Block admin view if not logged in */}
      {view === "admin" && !isAdmin && (
        <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔐</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.8rem" }}>Access Restricted</h2>
          <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>You need admin credentials to access this area.</p>
          <button onClick={() => setShowLogin(true)} className="btn" style={{ padding: "0.8rem 2rem", background: "#1A1A2E", color: "#fff", fontSize: "0.95rem" }}>🔓 Login as Admin</button>
        </div>
      )}
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
// 💬 COMMENTS COMPONENT (Disqus — Free, Email Notifications Built-in)
// ══════════════════════════════════════════════════════════════════════
// SETUP: Register free at disqus.com → create site → get shortname
// Replace "YOUR_DISQUS_SHORTNAME" below with your actual shortname
const DISQUS_SHORTNAME = "YOUR_DISQUS_SHORTNAME";

export function CommentsSection({ pageId, pageTitle, pageUrl }) {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow]     = useState(false);

  useEffect(() => {
    if (!show || loaded) return;
    // Load Disqus script dynamically
    window.disqus_config = function () {
      this.page.url      = pageUrl || window.location.href;
      this.page.identifier = pageId;
      this.page.title    = pageTitle;
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#1A1A2E" }}>
            💬 Comments & Discussion
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#9CA3AF", marginTop: "0.2rem" }}>
            Questions or feedback? Leave a comment below!
          </p>
        </div>
        {!show && (
          <button
            onClick={() => setShow(true)}
            style={{ padding: "0.6rem 1.2rem", background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            Show Comments
          </button>
        )}
      </div>

      {/* Disqus embed */}
      {show && (
        <div style={{ background: "#fff", border: "1px solid #E2E2EC", borderRadius: 16, padding: "1.5rem" }}>
          {DISQUS_SHORTNAME === "YOUR_DISQUS_SHORTNAME" ? (
            // Placeholder shown until Disqus is configured
            <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "#374151" }}>
                Comments Not Configured Yet
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                Register free at <strong style={{ color: "#2563EB" }}>disqus.com</strong> →<br/>
                Create a site → Get your shortname →<br/>
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
