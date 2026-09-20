import React, { useState } from "react";
import { Plus, X, Save, Sparkles, Calendar, Tag, FileText, DollarSign, MapPin, Heart } from "lucide-react";

const RECEIPT_CATEGORIES = [
  { id: "memory",    label: "Memory",    emoji: "🧠", color: "#9B83D8" },
  { id: "food",      label: "Food",      emoji: "🍽️", color: "#D9A15C" },
  { id: "travel",    label: "Travel",    emoji: "✈️", color: "#7CB49C" },
  { id: "purchase",  label: "Purchase",  emoji: "🛍️", color: "#BEAEE8" },
  { id: "health",    label: "Health",    emoji: "💚", color: "#548C74" },
  { id: "milestone", label: "Milestone", emoji: "⭐", color: "#E6A868" },
  { id: "social",    label: "Social",    emoji: "👥", color: "#9B83D8" },
  { id: "work",      label: "Work",      emoji: "💼", color: "#A39E93" },
];

const STORAGE_KEY = "trace_personal_receipts";

function getPersonalReceipts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveReceipt(receipt) {
  const existing = getPersonalReceipts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([receipt, ...existing]));
}

export default function AddReceiptFAB({ onReceiptAdded, isOpen: externalIsOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalIsOpen !== undefined ? externalIsOpen : internalOpen;
  const setOpen = (val) => {
    if (onOpenChange) onOpenChange(val);
    setInternalOpen(val);
  };

  const [saved, setSaved] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "memory",
    date: new Date().toISOString().slice(0, 10), amount: "", location: "",
  });

  // Auto-minimize when scrolling down to prevent blocking reading
  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setMinimized(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedCat = RECEIPT_CATEGORIES.find(c => c.id === form.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const receipt = {
      id: `personal-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: selectedCat.label,
      date: form.date,
      amount: form.amount ? parseFloat(form.amount) : null,
      location: form.location.trim(),
      emoji: selectedCat.emoji,
      source: "personal",
      createdAt: new Date().toISOString(),
    };
    saveReceipt(receipt);
    setSaved(true);
    if (onReceiptAdded) onReceiptAdded(receipt);
    setTimeout(() => {
      setSaved(false); setOpen(false);
      setForm({ title: "", description: "", category: "memory", date: new Date().toISOString().slice(0, 10), amount: "", location: "" });
    }, 1400);
  };

  const inputClass = "w-full bg-archive-900 border border-archive-700/60 rounded-xl px-4 py-2.5 text-sm text-paper font-mono placeholder:text-archive-600 focus:outline-none focus:border-amber-accent/60 focus:ring-1 focus:ring-amber-accent/30 transition-all";
  const labelClass = "block text-xs font-mono text-archive-400 mb-1.5 uppercase tracking-wider";

  // Close modal on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Floating Action Button — auto-collapses on scroll and has manual minimize toggle so it NEVER blocks reading */}
      <aside aria-label="Quick Actions" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex items-center">
        {minimized ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-archive-900/95 hover:bg-archive-850 border border-amber-accent/60 text-amber-accent shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
            title="Expand Leave Your Trace"
            aria-label="Expand Leave Your Trace button"
          >
            <Plus className="w-4 h-4 text-amber-accent group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-mono font-bold text-amber-accent">Trace</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-archive-950/95 backdrop-blur-md p-1 rounded-full border border-archive-700/70 shadow-2xl transition-all">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full transition-all duration-300 hover:brightness-110 active:scale-95 shadow-glow-amber"
              style={{
                background: "linear-gradient(135deg, #D9A15C 0%, #E6A868 100%)",
                boxShadow: "0 4px 18px rgba(217,161,92,0.35)"
              }}
              title="Add a personal life receipt"
              aria-label="Leave Your Trace: Add personal life receipt"
            >
              <Plus className="w-4 h-4 text-archive-950 hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-bold text-archive-950 font-sans tracking-tight">
                Leave Your Trace
              </span>
            </button>

            {/* Minimize button to shrink into tiny corner circle while reading */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMinimized(true);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full text-archive-400 hover:text-white hover:bg-archive-800 active:scale-90 transition-all cursor-pointer"
              title="Minimize button while reading"
              aria-label="Minimize button to keep screen clear"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-receipt-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,10,8,0.85)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-archive-700/70 shadow-2xl overflow-hidden" style={{ backgroundColor: "#1A1A16" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-archive-700/50"
              style={{ background: "linear-gradient(135deg, rgba(217,161,92,0.08) 0%, rgba(26,26,22,0) 100%)" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${selectedCat.color}20`, border: `1px solid ${selectedCat.color}40` }}>
                  {selectedCat.emoji}
                </div>
                <div>
                  <h2 id="add-receipt-modal-title" className="text-base font-bold text-paper font-editorial">Leave Your Trace</h2>
                  <p className="text-[11px] text-archive-500 font-mono">Add a personal life receipt to your archive</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-archive-500 hover:text-white hover:bg-archive-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={labelClass}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {RECEIPT_CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                      style={{
                        backgroundColor: form.category === cat.id ? `${cat.color}25` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.category === cat.id ? cat.color + "70" : "#3a3a36"}`,
                        color: form.category === cat.id ? cat.color : "#8a8a82"
                      }}>
                      <span>{cat.emoji}</span><span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}><FileText className="inline w-3 h-3 mr-1" />Title *</label>
                <input type="text" className={inputClass} placeholder="e.g. First trip to Goa with college friends"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
              </div>

              <div>
                <label className={labelClass}><Sparkles className="inline w-3 h-3 mr-1" />Memory Note</label>
                <textarea className={inputClass + " resize-none"} rows={2} placeholder="What made this moment worth keeping?"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}><Calendar className="inline w-3 h-3 mr-1" />Date</label>
                  <input type="date" className={inputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}><DollarSign className="inline w-3 h-3 mr-1" />Amount (Rs.)</label>
                  <input type="number" className={inputClass} placeholder="0.00" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} min="0" step="0.01" />
                </div>
                <div>
                  <label className={labelClass}><MapPin className="inline w-3 h-3 mr-1" />Location</label>
                  <input type="text" className={inputClass} placeholder="City / Place" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <p className="text-[11px] text-archive-600 font-mono flex items-center space-x-1">
                  <Heart className="w-3 h-3" /><span>Private by design · Saved locally</span>
                </p>
                <button type="submit" disabled={!form.title.trim()}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    saved ? "bg-sage-accent text-white"
                    : form.title.trim() ? "bg-amber-accent hover:bg-amber-light text-archive-950 hover:shadow-lg hover:shadow-amber-accent/20"
                    : "bg-archive-800 text-archive-600 cursor-not-allowed"
                  }`}>
                  {saved ? <><Sparkles className="w-4 h-4" /><span>Traced! ✓</span></> : <><Save className="w-4 h-4" /><span>Add to Archive</span></>}
                </button>
              </div>
            </form>

            <div className="px-6 py-3 border-t border-archive-700/40 bg-archive-950/50 text-[10px] font-mono text-archive-600 text-center">
              Your personal receipts never leave this browser · No servers · No accounts
            </div>
          </div>
        </div>
      )}
    </>
  );
}
