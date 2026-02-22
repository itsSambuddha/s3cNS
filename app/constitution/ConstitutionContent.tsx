// app/constitution/ConstitutionContent.tsx
"use client"

import { motion } from "motion/react"
import {
  ScrollText,
  Gavel,
  Users,
  Network,
  Layers,
  CalendarClock,
  ShieldCheck,
  Award,
  FileText,
  DollarSign,
} from "lucide-react"

/**
 * ConstitutionContent
 *
 * Full Constitution view accurately reflecting the official SECMUN Constitution:
 * - Preamble (verbatim adaptation)
 * - Articles 1–13 with precise structure, eligibility rules, office details, and procedures
 *
 * Sections have ids that match the NAV_ITEMS used in page.tsx.
 */

export function ConstitutionContent() {
  return (
    <div className="space-y-12">
      {/* Preamble */}
      <BounceSection id="const-preamble" icon={<ScrollText />}>
        <div className="text-center space-y-8 max-w-3xl mx-auto py-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-zinc-500">
            Formal Preamble
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white sm:text-5xl">Preamble</h2>
          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed font-medium text-justify dark:text-zinc-400">
            <p>
              We, the members of the SECMUN (St. Edmund&apos;s College Model United Nations) Club,
              Recalling the club&apos;s founding in 2014 and recognizing its heritage in fostering
              academic excellence, global discourse, and diplomatic practice;
            </p>
            <p>
              <span className="italic">Acknowledging </span> the leadership and visionary direction of the 2025 Senior Secretariat
              constituting of the President and Secretary-General in revitalizing
              the club’s mandate toward national recognition;
            </p>
            <p>
              <span className="italic">Affirming </span> our collective commitment to cultivate articulate, ethical, and globally-minded
              individuals through structured MUN experiences, training programs, and intellectual forums;
            </p>
            <p>
              <span className="italic">Emphasizing </span> the importance of professionalism, inclusivity, academic integrity, and service
              to both the institution and the international MUN community;
            </p>
            <p>
              <span className="italic">Recognizing </span> the continued guidance of our esteemed Teacher-in-Charge and the need for institutional accountability;
            </p>
            <p className="font-black text-slate-900 dark:text-white text-center pt-8 border-t border-slate-100 dark:border-white/5">
              Do hereby establish and adopt this Constitution as the supreme governing document of the
              SECMUN club, to regulate its organization, responsibilities, code of conduct, and future
              development.
            </p>
          </div>
        </div>
      </BounceSection>

      <DocumentDivider />

      {/* Article 1 */}
      <ArticleSection id="const-1" icon={<Gavel />} numeral="01" title="Name & Purpose" label="Article One">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 space-y-2 dark:bg-white/5 dark:border-white/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5">
            <p className="text-[11px] font-black uppercase tracking-wider text-blue-600">1.1 Designation</p>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">The club shall be known as <span className="text-slate-900 font-bold dark:text-white">SECMUN</span> (St. Edmund&apos;s College Model United Nations).</p>
          </div>
          <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 space-y-2 dark:bg-white/5 dark:border-white/5 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5">
            <p className="text-[11px] font-black uppercase tracking-wider text-blue-600">1.2 Core Mandate</p>
            <p className="text-sm font-medium text-slate-600 leading-relaxed dark:text-zinc-400">To organize MUN conferences, workshops, and training sessions; to represent SECMUN at external MUN events; to provide members with platforms to develop diplomacy, public speaking, writing, research, and negotiation skills; and to make SECMUN a nationally recognized student body.</p>
          </div>
        </div>
      </ArticleSection>

      {/* Article 2 */}
      <ArticleSection id="const-2" icon={<Users />} numeral="02" title="Membership" label="Article Two">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardWrapper title="2.1 Eligibility" desc="Membership is open to all enrolled students of the college." />
          <CardWrapper title="2.2 Rights" desc="Members have the right to participate in all club activities, vote in elections, and apply for official positions." />
          <CardWrapper title="2.3 Duties" desc="Members must uphold the values of the club, comply with the code of conduct, and actively engage in organized events." />
        </div>
        <div className="mt-6 group relative overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-slate-950 p-8 transition-all duration-500 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/30">
          <div className="absolute -right-4 -top-4 opacity-5 transition-all duration-700 group-hover:opacity-40 group-hover:scale-110 group-hover:text-red-600 group-hover:drop-shadow-[0_0_40px_rgba(220,38,38,0.8)]">
            <ShieldCheck className="w-40 h-40" />
          </div>
          <p className="relative z-10 text-[11px] font-black uppercase tracking-widest text-red-500 mb-4 font-mono">2.4 Disciplinary Protocol</p>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <p className="text-sm font-bold leading-relaxed text-slate-300">
              Any form of misconduct, including but not limited to harassment, academic dishonesty, financial misappropriation, unauthorized representation, or breach of the code of conduct, shall result in disciplinary action up to suspension or expulsion. <span className="text-red-500 font-black">Illegal activities will result in immediate expulsion and institutional reporting.</span>
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* Article 3 */}
      <ArticleSection id="const-3" icon={<Network />} numeral="03" title="Secretariat Structure" label="Article Three">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { role: "President", desc: "Principal Authority" },
            { role: "Sec-Gen", desc: "Chief Coordinator" },
            { role: "Gen-Sec", desc: "Documentation Lead" },
            { role: "Faculty Advisor", desc: "Institutional Oversight" }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center dark:bg-white/5 dark:border-white/5 transition-all hover:bg-white hover:-translate-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">{item.desc}</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{item.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-8 dark:bg-black/20 dark:border-white/5">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 font-mono">3.2 Functional Offices (1 Head + Deputies)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Delegate Affairs", "IT Office", "PR Office", "Marketing",
              "Finance", "Sponsorship", "Logistics", "Conference Mgmt"
            ].map((office) => (
              <div key={office} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-400">{office}</span>
              </div>
            ))}
          </div>
        </div>
      </ArticleSection>

      {/* Articles 4 & 5 */}
      <ArticleSection id="const-4" icon={<Layers />} numeral="04" title="Roles & Hierarchy" label="Article Four & Five">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 dark:bg-zinc-800/40 dark:border-white/5">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 font-mono">4. Responsibilities</h4>
            <ul className="space-y-4">
              {[
                "Role description documents outline specific functions.",
                "Adherence to a professional standard is mandatory.",
                "The Teacher-in-Charge retains audit rights at any time."
              ].map((text, i) => (
                <li key={i} className="flex gap-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
                  <span className="text-blue-500 font-bold">0{i + 1}.</span> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-8 font-mono">5. Reporting Hierarchy</h4>
            <div className="space-y-4">
              {[
                "Deputies → Office Heads",
                "Office Heads → Secretary-General",
                "Secretary-General → President",
                "Leadership → Teacher-in-Charge"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[10px] font-black group-hover:bg-blue-600 transition-colors">{i + 1}</div>
                  <p className="text-sm font-bold tracking-tight">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ArticleSection>

      <DocumentDivider />

      {/* Articles 6-13 */}
      <div className="grid gap-8 md:grid-cols-2">
        <ArticleSection id="const-6" icon={<CalendarClock />} numeral="06" title="Selection & Tenure" label="Article Six">
          <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <p><strong>6.1 Tenure:</strong> One-year terms aligned with the SECMUN academic calendar.</p>
            <p><strong>6.2 Eligibility:</strong> President/SecGen roles require 6th Semester seniority.</p>
            <p><strong>6.3 Process:</strong> Applications → Core Panel → Faculty Ratification.</p>
          </div>
        </ArticleSection>

        <ArticleSection id="const-7" icon={<FileText />} numeral="07" title="Meetings & Operations" label="Article Seven–Nine">
          <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <p><strong>7. Quorum:</strong> 50% + 1 of active office-bearers required for formal session.</p>
            <p><strong>8. Events:</strong> All workshops and mock MUNs require faculty knowledge.</p>
            <p><strong>9. Finance:</strong> Sponsorship and budgets managed with transparent institutional audit.</p>
          </div>
        </ArticleSection>

        <ArticleSection id="const-10" icon={<ShieldCheck />} numeral="10" title="Ethics & Amendments" label="Article Ten & Eleven">
          <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <p><strong>10. Amendments:</strong> 2/3 majority and Teacher-in-Charge ratification required.</p>
            <p><strong>11. Code of Conduct:</strong> Formal address ("Sir/Madam") and diplomatic etiquette are strictly mandatory.</p>
          </div>
        </ArticleSection>

        <ArticleSection id="const-12" icon={<Award />} numeral="12" title="Certification" label="Article Twelve & Thirteen">
          <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <p><strong>12. Certification:</strong> Official Service Certificates issued upon term completion.</p>
            <p><strong>13. Dissolution:</strong> Unanimous leadership agreement and clear faculty consent required.</p>
          </div>
        </ArticleSection>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 font-mono italic">Finis Constitutionis</p>
      </div>
    </div>
  )
}

function DocumentDivider() {
  return (
    <div className="relative py-12 flex items-center justify-center">
      <div className="absolute left-0 right-0 h-px bg-slate-100 dark:bg-white/5" />
      <div className="relative px-6 bg-white dark:bg-[#0c0c0c] flex gap-4">
        <div className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm dark:bg-zinc-900 dark:border-white/5">
          <Gavel className="w-4 h-4 text-blue-600" />
        </div>
        <div className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm dark:bg-zinc-900 dark:border-white/5">
          <ScrollText className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

function ArticleSection({
  id,
  icon,
  numeral,
  title,
  label,
  children
}: {
  id: string
  icon: React.ReactNode
  numeral: string
  title: string
  label: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[3rem] border border-blue-200/40 bg-white p-10 shadow-2xl shadow-blue-500/[0.02] dark:border-white/5 dark:bg-zinc-900/60"
    >
      <div className="absolute top-0 right-0 p-8">
        <span className="text-8xl font-black text-slate-100 dark:text-white/5 pointer-events-none select-none">{numeral}</span>
      </div>
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-slate-950 text-white shadow-xl dark:bg-white dark:text-black">
            {icon}
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mt-1">{label}</p>
          </div>
        </div>
        {children}
      </div>
    </motion.section>
  )
}

function CardWrapper({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:bg-zinc-800/40 dark:border-white/5 transition-all hover:border-blue-500/20 group">
      <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 mb-2">{title}</p>
      <p className="text-sm font-medium text-slate-600 leading-relaxed dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {desc}
      </p>
    </div>
  )
}

function BounceSection({
  id,
  icon,
  children,
}: {
  id: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[3rem] border border-blue-200/40 bg-white p-10 shadow-2xl shadow-blue-500/[0.02] dark:border-white/5 dark:bg-zinc-900/60"
    >
      <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 blur-[80px]" />
      {icon && (
        <div className="mb-10 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-slate-950 text-white shadow-xl dark:bg-white dark:text-black">
            {icon}
          </div>
        </div>
      )}
      {children}
    </motion.section>
  )
}

/* ---------- Icon wrappers ---------- */

function ScrollTextIcon() {
  return <ScrollText className="h-4 w-4" />
}

function GavelIcon() {
  return <Gavel className="h-4 w-4" />
}

function UsersIcon() {
  return <Users className="h-4 w-4" />
}

function NetworkIcon() {
  return <Network className="h-4 w-4" />
}

function LayersIcon() {
  return <Layers className="h-4 w-4" />
}

function CalendarIcon() {
  return <CalendarClock className="h-4 w-4" />
}

function ShieldIcon() {
  return <ShieldCheck className="h-4 w-4" />
}

function AwardIcon() {
  return <Award className="h-4 w-4" />
}
