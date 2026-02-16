'use client'

import { motion } from "framer-motion"
import { Newspaper, Bell, Heart, Share2, Bookmark, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const newsItems = [
  {
    title: "SECMUN 2025: Transition of Leadership Confirmed",
    excerpt: "The executive board has officially announced the new secretariat structure for the upcoming academic year.",
    category: "Official",
    date: "Feb 15, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    title: "New Policy on Portfolio Selection",
    excerpt: "A more transparent and meritocratic approach to delegate allocations has been finalized.",
    category: "Policy",
    date: "Feb 12, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Financial Integrity Report Q1",
    excerpt: "The first quarterly audit show 100% compliance with institutional standards.",
    category: "Finance",
    date: "Feb 10, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function NewsPage() {
  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-12">
        <header>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-blue-400/10" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                    SECMUN Gazette
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                    Staging / Mock Data
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Internal Communications
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Your official source for institutional updates, policy changes, and community highlights.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Featured News */}
        {newsItems.filter(n => n.featured).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white shadow-2xl shadow-blue-500/10 dark:border-white/5 dark:bg-zinc-900/40"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-[16/9] lg:aspect-auto h-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8 lg:p-12 space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="rounded-full font-black uppercase tracking-widest text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                      {item.category}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Clock className="w-3 h-3" /> {item.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-lg font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{item.date}</span>
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-50 transition-colors"><Bookmark className="w-5 h-5" /></button>
                    <button className="p-2 rounded-full hover:bg-slate-50 transition-colors"><Share2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* News Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {newsItems.filter(n => !n.featured).map((news, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -5 }}
              className="group cursor-pointer space-y-6"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-[2rem] border border-blue-200/60 shadow-lg shadow-blue-500/5 dark:border-white/5">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full font-black uppercase tracking-widest text-[9px] px-2 py-0 border-slate-200 text-slate-500">
                    {news.category}
                  </Badge>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{news.date}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 line-clamp-2">
                  {news.excerpt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
