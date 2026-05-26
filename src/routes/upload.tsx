import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Upload as UploadIcon, CheckCircle2, Loader2, X, Film, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Your Review — Farmaking Automation" },
      { name: "description", content: "Upload tractor & GPS review videos in original HD quality. Up to 2GB." },
    ],
  }),
  component: UploadPage,
});

const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const ACCEPT = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi", "video/webm"];

function UploadPage() {
  const [form, setForm] = useState({ customer_name: "", mobile: "", tractor_model: "", location: "", written_review: "" });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<{ shareUrl: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!ACCEPT.includes(f.type) && !f.name.match(/\.(mp4|mov|avi|webm)$/i)) {
      toast.error("Unsupported format. Use MP4, MOV, AVI or WEBM.");
      return;
    }
    if (f.size > MAX_SIZE) { toast.error("File too large. Max 2GB."); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error("Please pick a video first.");
    if (form.mobile && !/^[0-9+\-\s]{7,15}$/.test(form.mobile)) return toast.error("Invalid mobile number.");

    setUploading(true);
    setProgress(0);
    const ext = file.name.split(".").pop() || "mp4";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Fake progress ticker (Supabase JS client doesn't expose progress for standard upload)
    const ticker = setInterval(() => setProgress(p => Math.min(p + Math.random() * 8, 92)), 600);

    const { error: upErr } = await supabase.storage
      .from("customer-videos")
      .upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });

    clearInterval(ticker);

    if (upErr) { setUploading(false); setProgress(0); return toast.error("Upload failed: " + upErr.message); }

    const { data: pub } = supabase.storage.from("customer-videos").getPublicUrl(path);
    const videoUrl = pub.publicUrl;

    const { data: row, error: dbErr } = await supabase.from("videos").insert({
      customer_name: form.customer_name || null,
      mobile: form.mobile || null,
      tractor_model: form.tractor_model || null,
      location: form.location || null,
      written_review: form.written_review || null,
      video_path: path,
      video_url: videoUrl,
      file_size: file.size,
    }).select("id").single();

    if (dbErr) { setUploading(false); return toast.error("Save failed: " + dbErr.message); }

    setProgress(100);
    setUploading(false);
    const shareUrl = `${window.location.origin}/gallery?v=${row.id}`;
    setDone({ shareUrl });
    toast.success("Upload complete!");
  }

  function reset() {
    setForm({ customer_name: "", mobile: "", tractor_model: "", location: "", written_review: "" });
    setFile(null); setPreviewUrl(null); setProgress(0); setDone(null);
  }

  if (done) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-10 text-center glow-cyber">
          <div className="w-20 h-20 rounded-full bg-cyber/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-cyber-glow" />
          </div>
          <h1 className="font-display text-3xl font-bold">Upload complete</h1>
          <p className="text-muted-foreground mt-3">Your review is live in original quality.</p>
          {previewUrl && <video src={previewUrl} controls className="mt-6 w-full rounded-2xl" />}
          <div className="mt-6 flex items-center gap-2 glass rounded-xl p-3">
            <input readOnly value={done.shareUrl} className="bg-transparent flex-1 text-sm outline-none text-muted-foreground" />
            <button onClick={() => { navigator.clipboard.writeText(done.shareUrl); toast.success("Link copied"); }}
              className="btn-cyber !py-2 !px-3"><Copy className="w-4 h-4"/></button>
          </div>
          <div className="flex gap-3 justify-center mt-8">
            <button onClick={reset} className="btn-ghost-cyber">Upload another</button>
            <a href={done.shareUrl} className="btn-flame"><Share2 className="w-4 h-4"/> View</a>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">Customer Review</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">Share your story in <span className="text-gradient-cyber">HD</span></h1>
        <p className="text-muted-foreground mt-3">Up to 2GB per video. Original quality preserved — no WhatsApp compression.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-10 glass rounded-3xl p-6 sm:p-10 space-y-6">
        <p className="text-xs text-muted-foreground">All fields below are optional — only the video is required.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Customer Name" value={form.customer_name} onChange={v => setForm({...form, customer_name: v})} />
          <Field label="Mobile Number" value={form.mobile} onChange={v => setForm({...form, mobile: v})} type="tel" />
          <Field label="Tractor Model" value={form.tractor_model} onChange={v => setForm({...form, tractor_model: v})} placeholder="e.g. John Deere 5310" />
          <Field label="State / City" value={form.location} onChange={v => setForm({...form, location: v})} placeholder="e.g. Ludhiana, Punjab" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Written Review (optional)</label>
          <textarea value={form.written_review} onChange={e => setForm({...form, written_review: e.target.value})}
            rows={3} maxLength={1000}
            className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-flame bg-flame/5" : "border-border hover:border-cyber/60 hover:bg-cyber/5"}`}
        >
          <input ref={inputRef} type="file" accept="video/*" capture="environment" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {!file ? (
            <>
              <UploadIcon className="w-10 h-10 mx-auto text-cyber-glow mb-4" />
              <p className="font-semibold">Drag & drop video here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to choose · MP4, MOV, AVI, WEBM · up to 2GB</p>
            </>
          ) : (
            <div className="flex items-center gap-3 text-left">
              <Film className="w-8 h-8 text-cyber-glow shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                className="p-2 rounded-lg hover:bg-white/5"><X className="w-4 h-4"/></button>
            </div>
          )}
        </div>

        {previewUrl && !done && (
          <video src={previewUrl} controls className="w-full rounded-2xl max-h-80" />
        )}

        {uploading && <UploadOverlay progress={progress} fileName={file?.name || ""} />}

        <button type="submit" disabled={uploading} className="btn-flame w-full !py-4 disabled:opacity-60">
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading…</> : <><UploadIcon className="w-4 h-4"/> Submit Review</>}
        </button>
      </form>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={200}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
