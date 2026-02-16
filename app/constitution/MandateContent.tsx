// app/constitution/MandateContent.tsx
"use client"

import { motion } from "motion/react"
import {
  Building2,
  Crown,
  UserRound,
  Users,
  Network,
  Megaphone,
  Palette,
  Wallet,
  Handshake,
  Truck,
  ClipboardList,
  GraduationCap,
  CalendarClock,
  ShieldCheck,
  ScrollText,
  ChevronRight,
} from "lucide-react"

/**
 * MandateContent
 *
 * Combines:
 * - SECMUN Secretariat Mandate Document (structure, USG offices,
 *   Junior Secretariat, tenure, etc.)
 * - The SECMUN Secretariat In Brief (narratives per office)
 */

export function MandateContent() {
  return (
    <div className="space-y-12">
      {/* 1. Structure of the Secretariat */}
      <BounceSection id="mandate-overview" icon={<Building2 />}>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20">
              Institutional Framework
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white sm:text-5xl leading-[0.9]">
              The Secretariat <br /> <span className="text-blue-600">Operational Nucleus.</span>
            </h2>
            <div className="space-y-4 text-base font-medium text-slate-600 leading-relaxed dark:text-zinc-400">
              <p>
                The Secretariat is the operational nucleus of SECMUN, a
                multi‑departmental body designed for precision and synergy, with each
                department commanded by an Under‑Secretary‑General responsible for
                both strategic direction and day‑to‑day execution.
              </p>
              <p>
                Departments function with semi‑independence during planning but are
                designed to converge seamlessly under Conference Management during the
                event, ensuring that specialised tasks are handled by experts while
                critical decisions remain centrally coordinated.
              </p>
            </div>
          </div>
          <div className="w-full md:w-72 p-6 rounded-[2.5rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 font-mono">Service Protocol</p>
            <p className="text-sm font-medium leading-relaxed text-slate-400 relative z-10">
              &quot;SECMUN operates under a strict meritocratic hierarchy where responsibility is the currency of authority.&quot;
            </p>
          </div>
        </div>
      </BounceSection>

      {/* 2. Senior Secretariat */}
      <BounceSection id="mandate-structure" icon={<Crown />}>
        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Senior Secretariat Command</h3>
            <p className="mt-2 text-base font-medium text-slate-600 dark:text-zinc-400">
              The highest tier of leadership, providing overarching vision and institutional representing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <MiniRoleCard
              icon={<Crown className="w-5 h-5" />}
              title="President"
              lines={[
                "Principal authority and external representative of the club.",
                "Final arbiter of the Secretariat, bearing ultimate responsibility for conference success."
              ]}
              accent="blue"
            />
            <MiniRoleCard
              icon={<ScrollText className="w-5 h-5" />}
              title="Secretary-General"
              lines={[
                "Chief coordinator of administrative and operational activities.",
                "Presides over key functions, ensures diplomatic protocol, and upholds academic spirit."
              ]}
              accent="blue"
            />
            <MiniRoleCard
              icon={<UserRound className="w-5 h-5" />}
              title="General Secretary"
              lines={[
                "Custodian of official documentation and internal communication.",
                "Supervises the Junior Secretariat and maintains archival records."
              ]}
              accent="slate"
            />
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-10 dark:bg-white/5 dark:border-white/5">
            <h4 className="text-base font-black text-slate-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              Core Strategic Responsibilities
            </h4>
            <div className="grid gap-8 md:grid-cols-2">
              <ul className="space-y-4">
                <li className="flex gap-4 group">
                  <div className="mt-1 h-5 w-5 rounded-md border border-slate-200 bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">01</div>
                  <p className="text-sm font-medium text-slate-600 dark:text-zinc-400"><span className="text-slate-900 font-bold dark:text-white">Diplomacy:</span> Drafting and dispatching formal agreements and invitations.</p>
                </li>
                <li className="flex gap-4 group">
                  <div className="mt-1 h-5 w-5 rounded-md border border-slate-200 bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">02</div>
                  <p className="text-sm font-medium text-slate-600 dark:text-zinc-400"><span className="text-slate-900 font-bold dark:text-white">Protocol:</span> Overseeing preparation of certificates and official awards.</p>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-4 group">
                  <div className="mt-1 h-5 w-5 rounded-md border border-slate-200 bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">03</div>
                  <p className="text-sm font-medium text-slate-600 dark:text-zinc-400"><span className="text-slate-900 font-bold dark:text-white">Hospitality:</span> Handling high-profile guest management and logistics.</p>
                </li>
                <li className="flex gap-4 group">
                  <div className="mt-1 h-5 w-5 rounded-md border border-slate-200 bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">04</div>
                  <p className="text-sm font-medium text-slate-600 dark:text-zinc-400"><span className="text-slate-900 font-bold dark:text-white">Crisis:</span> Primary decision-making body during unforeseen operational crises.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </BounceSection>

      {/* 3. USG Offices / Departments */}
      <BounceSection id="mandate-departments" icon={<Network />}>
        <div className="space-y-10">
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Operational Structure</h3>
            <p className="mt-2 text-base font-medium text-slate-600 dark:text-zinc-400 max-w-2xl">
              Under-Secretary-General offices are specialised departments managing core functional domains.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <DeptCard
              icon={<Users />}
              title="Delegate Affairs"
              structure="1 Head, 2 Deputies"
              mandatePoints={[
                "Membership and delegate registration protocols.",
                "Attendance monitoring and identity verification.",
                "Strategic portfolio allocation and query resolution."
              ]}
              narrativeTitle="Participant Journey"
              narrativePoints={[
                "Guides delegates from registration to feedback cycles.",
                "Coordinates seating and movement flows with Logistics."
              ]}
            />

            <DeptCard
              icon={<Palette />}
              title="Information Technology"
              structure="1 Head, 2 Deputies"
              mandatePoints={[
                "Maintaining digital infrastructure and backend systems.",
                "Registration portal management and data integrity.",
                "Visual branding and presentation design support."
              ]}
              narrativeTitle="Digital Identity"
              narrativePoints={[
                "Creating a coherent video and visual presence.",
                "Ensuring high-security data management practices."
              ]}
            />

            <DeptCard
              icon={<Megaphone />}
              title="Public Relations"
              structure="1 Head, 1 Deputy"
              mandatePoints={[
                "Media communication and external public image.",
                "Primary liaison for student communities and institutions.",
                "Campus Ambassador Program management."
              ]}
              narrativeTitle="The SECMUN Voice"
              narrativePoints={[
                "Disseminating promotional materials and messaging.",
                "Crafting high-impact institutional narratives."
              ]}
            />

            <DeptCard
              icon={<Network />}
              title="Marketing"
              structure="1 Head, 1 Deputy"
              mandatePoints={[
                "Publicity campaign leads and cross-platform outreach.",
                "Poster production and promotional content strategy.",
                "Brand alignment across all departmental assets."
              ]}
              narrativeTitle="Institutional Growth"
              narrativePoints={[
                "Translating core narratives into targeted campaigns.",
                "Sponsorship-integrated marketing solutions."
              ]}
            />

            <DeptCard
              icon={<Wallet />}
              title="Finance"
              structure="1 Head, 1 Deputy"
              mandatePoints={[
                "Budgeting, tracking expenditure, and reporting.",
                "Processing reimbursements and reconciling inflows.",
                "Institutional financial accountability."
              ]}
              narrativeTitle="Financial Integrity"
              narrativePoints={[
                "Audit-ready documentation of all transactions.",
                "Coordination with Sponsorship for reconciliation."
              ]}
            />

            <DeptCard
              icon={<Handshake />}
              title="Sponsorship"
              structure="1 Head, 1 Deputy"
              mandatePoints={[
                "Sponsorship outreach and MoU management.",
                "Corporate engagement and strategic partnerships.",
                "Value proposition design for brand partners."
              ]}
              narrativeTitle="External Funding"
              narrativePoints={[
                "Ensuring partner presence enhances delegate experience.",
                "Managing long-term institutional relationships."
              ]}
            />

            <DeptCard
              icon={<Truck />}
              title="Logistics"
              structure="1 Head, 1 Deputy"
              mandatePoints={[
                "Event setup and physical material procurement.",
                "Seating plans and venue operational readiness.",
                "Management of physical club assets and awards."
              ]}
              narrativeTitle="Movement & Readiness"
              narrativePoints={[
                "Executing the physical blueprint of the conference.",
                "Commanding on-site material distribution."
              ]}
            />

            <DeptCard
              icon={<ClipboardList />}
              title="Conference Management"
              structure="1 Head"
              mandatePoints={[
                "End-to-end conference planning and execution.",
                "Portfolio distribution and Executive Board coordination.",
                "Master run-of-show and ceremony management."
              ]}
              narrativeTitle="Mission Command"
              narrativePoints={[
                "Architecting the minute-by-minute attendee flow.",
                "Ensuring central command over all operational nodes."
              ]}
            />
          </div>
        </div>
      </BounceSection>

      {/* 4. Junior Secretariat */}
      <BounceSection id="mandate-junior-secretariat" icon={<GraduationCap />}>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Junior Secretariat</h3>
            <p className="text-base font-medium text-slate-600 dark:text-zinc-400">
              The foundational unit that supports day‑to‑day operations while serving as a leadership incubation platform.
            </p>
            <div className="rounded-[2rem] border border-blue-100 bg-blue-50/30 p-8 dark:bg-white/5 dark:border-white/5">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-6 font-mono">Operational Focus</p>
              <ul className="space-y-4">
                {[
                  "Preparation of placards and delegate kits.",
                  "Venue entry and exit regulation.",
                  "Drafting minutes and assisting with records.",
                  "Direct delegate movement and support."
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 text-sm font-medium text-slate-700 dark:text-zinc-400">
                    <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative rounded-[3rem] bg-slate-950 p-10 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <GraduationCap className="w-40 h-40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 font-mono">Incubation Mandate</p>
            <div className="space-y-8 relative z-10">
              <div>
                <h4 className="text-xl font-bold mb-2">Leadership Pipeline</h4>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  Identifies and grooms future Secretariat leaders. Selection is merit-based, focusing on discipline and commitment.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Command Hierarchy</h4>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  Operates under Office Heads during events while retaining a direct reporting line to the General Secretary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </BounceSection>

      {/* 5. Tenure, Selection & Promotion */}
      <BounceSection id="mandate-tenure" icon={<CalendarClock />}>
        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Selection & Tenure</h3>
            <p className="mt-2 text-base font-medium text-slate-600 dark:text-zinc-400">Standard procedures for appointment, promotion, and removal.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm dark:bg-zinc-800/40 dark:border-white/5 hover:border-blue-500/20 transition-all">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-4 font-mono">Academic Session</p>
              <h4 className="font-black text-slate-900 dark:text-white mb-2 tracking-tight">Standard Tenure</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">Office-bearers serve for a defined academic session, consistent with college calendars.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm dark:bg-zinc-800/40 dark:border-white/5 hover:border-blue-500/20 transition-all">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-4 font-mono">Criteria</p>
              <h4 className="font-black text-slate-900 dark:text-white mb-2 tracking-tight">Eligibility</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">Selection is based on academic standing, performance record, and domain-specific competence.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm dark:bg-zinc-800/40 dark:border-white/5 hover:border-blue-500/20 transition-all">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-4 font-mono">Protocols</p>
              <h4 className="font-black text-slate-900 dark:text-white mb-2 tracking-tight">Promotion & Removal</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">Reassignments are performance-based and subject to review under the institutional code of conduct.</p>
            </div>
          </div>
        </div>
      </BounceSection>

      {/* 6. Executive Board */}
      <BounceSection id="mandate-eb" icon={<ClipboardList />}>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Executive Board (EB)</h3>
            <p className="text-base font-medium text-slate-600 dark:text-zinc-400">
              The intellectual and procedural core of each committee, responsible for academic depth.
            </p>
            <div className="space-y-3">
              {[
                "Prepares committee background guides.",
                "Moderates debate impartially and evaluates performance.",
                "Records key committee decisions and signatories."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-80 rounded-[3rem] border border-slate-100 p-8 dark:border-white/5 flex flex-col justify-center gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tier A</p>
              <h4 className="text-xl font-black text-slate-950 dark:text-white">Committee Chair</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tier B</p>
              <h4 className="text-xl font-black text-slate-950 dark:text-white">Vice-Chair</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tier C</p>
              <h4 className="text-xl font-black text-slate-950 dark:text-white">Rapporteur</h4>
            </div>
          </div>
        </div>
      </BounceSection>

      {/* 7. Conducting a Conference */}
      <BounceSection id="mandate-playbook" icon={<ScrollText />}>
        <div className="space-y-12">
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Operational Blueprint</h3>
            <p className="mt-2 text-base font-medium text-slate-600 dark:text-zinc-400">The project lifecycle of a SECMUN conference.</p>
          </div>

          <div className="relative pl-8 md:pl-12">
            {/* Continuous Vertical Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 via-blue-400/50 to-transparent" />

            <div className="space-y-16">
              <TimelineItem
                label="Pre-Planning Phase"
                items={[
                  "Confirm Secretariat and EB structures.",
                  "Draft formal budgets and sponsorship outreach."
                ]}
              />
              <TimelineItem
                label="Launch Phase (T-4 Weeks)"
                items={[
                  "Release background guides and portfolios.",
                  "Lock venues and institutional vendor agreements."
                ]}
              />
              <TimelineItem
                label="Readiness Phase (T-1 Week)"
                items={[
                  "Finalize registrations and seating charts.",
                  "Conduct full-scale dry runs and tech rehearsals."
                ]}
              />
              <TimelineItem
                label="Execution (Conference Days)"
                items={[
                  "Central command via Conference Management.",
                  "Crisis monitoring and decorum management."
                ]}
              />
            </div>
          </div>
        </div>
      </BounceSection>
      <div className="text-center pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 font-mono italic">Operational Mandate v2.6</p>
      </div>
    </div>
  )
}

function MiniRoleCard({
  icon,
  title,
  lines,
  accent = "slate"
}: {
  icon?: React.ReactNode
  title: string
  lines: string[]
  accent?: "blue" | "slate"
}) {
  return (
    <div className={`group p-6 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-1 ${accent === "blue"
      ? "bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-xl shadow-blue-500/5 dark:from-blue-900/10 dark:to-zinc-900 dark:border-blue-500/20"
      : "bg-white border-slate-100 dark:bg-zinc-800/40 dark:border-white/5"
      }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${accent === "blue" ? "bg-white text-blue-600 dark:bg-blue-600 dark:text-white" : "bg-slate-950 text-white dark:bg-white dark:text-black"
        }`}>
        {icon}
      </div>
      <h4 className={`text-lg font-black mb-3 tracking-tight ${accent === "blue" ? "text-blue-900 dark:text-white" : "text-slate-900 dark:text-white"}`}>
        {title}
      </h4>
      <ul className={`space-y-2 text-xs font-medium leading-relaxed ${accent === "blue" ? "text-blue-700/80 dark:text-zinc-400" : "text-slate-600 dark:text-zinc-400"}`}>
        {lines.map((l, i) => (
          <li key={i} className="flex gap-2">
            <span className={`opacity-50 tracking-tighter ${accent === "blue" ? "text-blue-400" : ""}`}>—</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DeptCard({
  icon,
  title,
  structure,
  mandatePoints,
  narrativeTitle,
  narrativePoints,
}: {
  icon?: React.ReactNode
  title: string
  structure: string
  mandatePoints: string[]
  narrativeTitle: string
  narrativePoints: string[]
}) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:bg-slate-50 hover:shadow-2xl hover:shadow-blue-500/5 dark:bg-zinc-900/60 dark:border-white/5 dark:hover:bg-zinc-800/60">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-slate-950 text-white flex items-center justify-center shadow-xl dark:bg-white dark:text-black transition-transform group-hover:scale-105">
            {icon}
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mt-1">{structure}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">Operations</p>
          <ul className="space-y-3">
            {mandatePoints.map((m, i) => (
              <li key={i} className="text-sm font-medium text-slate-600 leading-relaxed flex gap-3 dark:text-zinc-400">
                <span className="text-blue-500 font-bold">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-6 border-t border-slate-100 dark:border-white/5">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 font-mono">{narrativeTitle}</p>
          <ul className="space-y-3">
            {narrativePoints.map((n, i) => (
              <li key={i} className="text-sm font-bold text-slate-900 leading-relaxed flex gap-3 dark:text-white">
                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="relative group">
      {/* Node Dot */}
      <div className="absolute -left-[27px] md:-left-[31px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-125 dark:border-zinc-900" />

      <p className="text-xs font-black uppercase tracking-widest text-blue-600 font-mono mb-4">{label}</p>
      <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:bg-white/5 dark:border-white/5">
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="text-sm font-medium text-slate-600 leading-relaxed flex gap-4 dark:text-zinc-400">
              <div className="h-px w-4 bg-slate-200 mt-[10px] shrink-0 dark:bg-white/10" />
              {item}
            </li>
          ))}
        </ul>
      </div>
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
