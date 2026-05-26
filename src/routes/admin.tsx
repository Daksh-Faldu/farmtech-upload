import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Loader2, Shield, Download, Copy, Trash2, Search, Film, Users, HardDrive, LogOut } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Farmaking Automation" }] }),
  component: AdminPage,
});

type Video = {
  id: string; customer_name: string | null; mobile: string | null; tractor_model: string | null;
  location: string | null; written_review: string | null; video_url: string;
  video_path: string; file_size: number | null; created_at: string;
};

function AdminPage() {
  const [session, setSession] = useState<{ userId: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) {
        setSession({ userId: s.user.id });
        supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle()
          .then(({ data }) => { setIsAdmin(!!data); setChecking(false); });
      } else {
        setSession(null); setIsAdmin(false); setChecking(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setSession({ userId: s.user.id });
        supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle()
          .then(({ data }) => { setIsAdmin(!!data); setChecking(false); });
      } else setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-cyber-glow"/></div>;
  if (!session || !isAdmin) return <LoginCard />;
  return <Dashboard />;
}

function LoginCard() {
  const [email, setEmail] = useState("admin@farmaking.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back.");
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-10 w-full max-w-md glow-cyber">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber to-flame flex items-center justify-center mb-6">
          <Shield className="w-7 h-7 text-background" />
        </div>
        <h1 className="font-display text-3xl font-bold">Admin Access</h1>
        <p className="text-muted-foreground text-sm mt-2">Restricted area. Authorized personnel only.</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <button disabled={loading} className="btn-cyber w-full mt-6 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4"/>} Sign in
        </button>

        <div className="mt-6 text-xs text-muted-foreground border-t border-border pt-4">
          <p className="font-semibold text-cyber-glow mb-1">Default credentials</p>
          <p>admin@farmaking.com</p>
          <p>Farmaking@2025</p>
        </div>
      </motion.form>
    </section>
  );
}

function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos((data as Video[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = videos.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q || v.customer_name.toLowerCase().includes(q) || v.mobile.includes(q) || v.tractor_model.toLowerCase().includes(q);
    const matchState = !stateFilter || v.location.toLowerCase().includes(stateFilter.toLowerCase());
    return matchSearch && matchState;
  });

  const totalSize = videos.reduce((a, v) => a + (v.file_size || 0), 0);
  const uniqueCustomers = new Set(videos.map(v => v.mobile)).size;

  async function del(v: Video) {
    if (!confirm(`Delete review from ${v.customer_name}?`)) return;
    await supabase.storage.from("customer-videos").remove([v.video_path]);
    const { error } = await supabase.from("videos").delete().eq("id", v.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  function copy(v: Video) {
    navigator.clipboard.writeText(`${window.location.origin}/gallery?v=${v.id}`);
    toast.success("Share link copied");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-flame mb-2">Admin Console</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Dashboard</h1>
        </div>
        <button onClick={logout} className="btn-ghost-cyber !py-2"><LogOut className="w-4 h-4"/> Sign out</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat icon={Film} label="Total Uploads" value={videos.length} color="cyber" />
        <Stat icon={Users} label="Customers" value={uniqueCustomers} color="flame" />
        <Stat icon={HardDrive} label="Storage Used" value={`${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`} color="cyber" />
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, mobile, tractor…"
            className="w-full rounded-xl bg-input border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <input value={stateFilter} onChange={e => setStateFilter(e.target.value)} placeholder="Filter by state/city"
          className="rounded-xl bg-input border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cyber-glow"/></div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No videos found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden">
              <video src={v.video_url} controls className="w-full aspect-video object-cover bg-black" preload="metadata" />
              <div className="p-4 space-y-1">
                <p className="font-semibold">{v.customer_name}</p>
                <p className="text-xs text-muted-foreground">{v.mobile} · {v.tractor_model}</p>
                <p className="text-xs text-muted-foreground">{v.location}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {new Date(v.created_at).toLocaleDateString()} · {v.file_size ? (v.file_size/1024/1024).toFixed(1) + " MB" : ""}
                </p>
                {v.written_review && <p className="text-xs italic text-muted-foreground line-clamp-2 mt-2">"{v.written_review}"</p>}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <a href={v.video_url} download className="flex-1 inline-flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-cyber/10 text-cyber-glow hover:bg-cyber/20 transition"><Download className="w-3 h-3"/>Download</a>
                  <button onClick={() => copy(v)} className="flex-1 inline-flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-flame/10 text-flame hover:bg-flame/20 transition"><Copy className="w-3 h-3"/>Share</button>
                  <button onClick={() => del(v)} className="inline-flex items-center justify-center gap-1 text-xs py-2 px-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition"><Trash2 className="w-3 h-3"/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: "cyber" | "flame" }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === "cyber" ? "bg-cyber/15" : "bg-flame/15"}`}>
        <Icon className={`w-5 h-5 ${color === "cyber" ? "text-cyber-glow" : "text-flame"}`}/>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
