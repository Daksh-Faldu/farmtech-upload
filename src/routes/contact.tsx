import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Instagram, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Farmaking Automation" },
      { name: "description", content: "Reach Farmaking Automation on WhatsApp, Instagram, or email for GPS auto-steering inquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Fill all fields");
    const text = `Hi Farmaking,%0AName: ${form.name}%0AEmail: ${form.email}%0A%0A${form.message}`;
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
    toast.success("Opening WhatsApp…");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-flame mb-3">Get in touch</p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold">Let's talk <span className="text-gradient-cyber">automation</span></h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl p-8 space-y-4">
          <ContactRow icon={MessageCircle} label="WhatsApp" value="+91 99999 99999" href="https://wa.me/919999999999" color="flame" />
          <ContactRow icon={Instagram} label="Instagram" value="@farmaking.automation" href="https://instagram.com/farmaking.automation" color="flame" />
          <ContactRow icon={Mail} label="Email" value="hello@farmaking.com" href="mailto:hello@farmaking.com" color="cyber" />
          <ContactRow icon={MapPin} label="Location" value="Ludhiana, Punjab, India" color="cyber" />
          <div className="rounded-2xl overflow-hidden border border-border mt-4">
            <iframe
              src="https://www.google.com/maps?q=Ludhiana,Punjab&output=embed"
              className="w-full h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            />
          </div>
        </motion.div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl p-8 space-y-5">
          <h2 className="font-display text-2xl font-bold">Send an inquiry</h2>
          <Field label="Name" value={form.name} onChange={v => setForm({...form, name: v})} />
          <Field label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} maxLength={1000}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="btn-flame w-full"><Send className="w-4 h-4"/> Send via WhatsApp</button>
        </motion.form>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href, color }: { icon: React.ElementType; label: string; value: string; href?: string; color: "cyber" | "flame" }) {
  const Inner = (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color === "cyber" ? "bg-cyber/15" : "bg-flame/15"}`}>
        <Icon className={`w-5 h-5 ${color === "cyber" ? "text-cyber-glow" : "text-flame"}`} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{Inner}</a> : Inner;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} maxLength={200}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
