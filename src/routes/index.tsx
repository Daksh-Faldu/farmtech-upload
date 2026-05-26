import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Cpu, Satellite, Sparkles, Tractor, Upload, Play, Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Farmaking Automation — Leading World Towards Automation" },
      { name: "description", content: "GPS auto-steering & AI farming automation. Upload your tractor review videos in HD." },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  { name: "Harpreet Singh", model: "John Deere 5310", location: "Ludhiana, Punjab", quote: "Straight lines, less diesel, less stress. The GPS steering changed how I farm.", rating: 5 },
  { name: "Ramesh Patel", model: "Mahindra Arjun 605", location: "Anand, Gujarat", quote: "Installed in one day. My night ploughing is now twice as fast and accurate.", rating: 5 },
  { name: "Suresh Reddy", model: "Sonalika Tiger DI 75", location: "Guntur, AP", quote: "Premium build, easy controls. Best investment for any modern farmer.", rating: 5 },
];

const products = [
  { icon: Satellite, title: "GPS Auto Steering", desc: "Centimeter-accurate guidance for ploughing, sowing and spraying." },
  { icon: Cpu, title: "AI Control Unit", desc: "Smart on-board computer with terrain learning and obstacle alerts." },
  { icon: Tractor, title: "Universal Tractor Kit", desc: "Fits 30+ tractor brands. Plug-and-play with no permanent mods." },
  { icon: Sparkles, title: "Cloud Dashboard", desc: "Track every acre, every pass, every drop of fuel — from your phone." },
];

function HomePage() {
  const [videos, setVideos] = useState<{ id: string; video_url: string; customer_name: string | null }[]>([]);

  useEffect(() => {
    supabase.from("videos").select("id, video_url, customer_name").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => data && setVideos(data));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyber/20 blur-[120px]" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] rounded-full bg-flame/20 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-widest text-cyber-glow uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
            Smart Agriculture · Made in India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95]"
          >
            Leading World <br />
            Towards <span className="text-gradient-cyber">Automation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            GPS auto-steering, AI-powered control and cloud telemetry for tractors of every size.
            Share your real-world review in <span className="text-foreground font-semibold">original HD quality</span> — no WhatsApp compression.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link to="/upload" className="btn-flame">
              <Upload className="w-4 h-4" /> Upload Review
            </Link>
            <Link to="/gallery" className="btn-ghost-cyber">
              <Play className="w-4 h-4" /> Watch Reviews <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="mt-20 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { k: "12K+", v: "Acres Automated" },
              { k: "2.5cm", v: "GPS Accuracy" },
              { k: "30+", v: "Tractor Brands" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="font-display text-3xl font-bold text-gradient-cyber">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">The System</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Engineered for the field</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:glow-cyber transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber/20 to-flame/20 flex items-center justify-center mb-4 group-hover:from-cyber/40 group-hover:to-flame/40 transition">
                <p.icon className="w-6 h-6 text-cyber-glow" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">Voices from the field</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Trusted by real farmers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-7 relative"
            >
              <Quote className="w-8 h-8 text-cyber/40 mb-4" />
              <p className="text-sm leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-flame text-flame" />)}
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.model} · {t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT REELS */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">Latest Reels</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Real reviews, original HD</h2>
          </div>
          <Link to="/gallery" className="btn-ghost-cyber">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>

        {videos.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground mb-6">Be the first to upload a review.</p>
            <Link to="/upload" className="btn-flame">Upload yours</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {videos.map((v) => (
              <Link key={v.id} to="/gallery" className="aspect-[9/16] rounded-2xl overflow-hidden glass relative group">
                <video src={v.video_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <p className="text-xs font-medium truncate">{v.customer_name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl glass p-12 md:p-20 text-center">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-flame/30 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyber/30 blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl font-bold">Your review,<br/><span className="text-gradient-cyber">in true quality.</span></h2>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">No compression. No watermarks. Direct from your camera to our cloud. Up to 2GB per video.</p>
            <Link to="/upload" className="btn-flame mt-10"><Upload className="w-4 h-4"/> Start Upload</Link>
          </div>
        </div>
      </section>
    </>
  );
}
