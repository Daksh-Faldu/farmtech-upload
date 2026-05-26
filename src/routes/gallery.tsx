import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Tractor, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Video = {
  id: string;
  customer_name: string | null;
  tractor_model: string | null;
  location: string | null;
  written_review: string | null;
  video_url: string;
  created_at: string;
};

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Customer Reviews Gallery — Farmaking Automation" },
      { name: "description", content: "Watch real tractor & GPS reviews from farmers across India in original HD." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ v: typeof s.v === "string" ? s.v : undefined }),
  component: GalleryPage,
});

function GalleryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("videos").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setVideos((data as Video[]) || []); setLoading(false); });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">Reels Gallery</p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold">Real farmers. <span className="text-gradient-cyber">Real results.</span></h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      ) : videos.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No videos yet. Be the first!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((v, i) => <ReelCard key={v.id} v={v} index={i} />)}
        </div>
      )}
    </section>
  );
}

function ReelCard({ v, index }: { v: Video; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.play().catch(() => {}); } else { el.pause(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      className="glass rounded-2xl overflow-hidden hover:glow-cyber transition group"
    >
      <div className="relative aspect-[9/16] bg-black">
        <video
          ref={ref}
          src={v.video_url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          controls
        />
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-flame/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Play className="w-4 h-4 text-background fill-background" />
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold">{v.customer_name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Tractor className="w-3 h-3 text-cyber-glow"/>{v.tractor_model}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-flame"/>{v.location}</p>
        {v.written_review && <p className="text-xs mt-3 line-clamp-3 text-muted-foreground">"{v.written_review}"</p>}
      </div>
    </motion.div>
  );
}
