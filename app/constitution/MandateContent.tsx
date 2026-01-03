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
    <div className="space-y-8">
      {/* 1. Structure of the Secretariat */}
      <BounceSection id="mandate-overview" icon={<BuildingIcon />}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Mandate & Secretariat
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          The SECMUN Secretariat in brief
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          The Secretariat is the operational nucleus of SECMUN, a
          multi‑departmental body designed for precision and synergy, with each
          department commanded by an Under‑Secretary‑General responsible for
          both strategic direction and day‑to‑day execution.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Departments function with semi‑independence during planning but are
          designed to converge seamlessly under Conference Management during the
          event, ensuring that specialised tasks are handled by experts while
          critical decisions remain centrally coordinated.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Clear lines of authority, defined responsibilities, and unwavering
          accountability form the backbone of this structure so that every
          member understands their role and impact on the collective mission.
        </p>
      </BounceSection>

      {/* 2. Senior Secretariat */}
      <BounceSection id="mandate-structure" icon={<CrownIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Senior Secretariat: command and control
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          The Senior Secretariat is the highest tier of leadership, providing
          overarching vision, ensuring inter‑departmental cohesion, and
          representing SECMUN to all external stakeholders.
        </p>

        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-3">
          <MiniRoleCard
            icon={<CrownIcon small />}
            title="President"
            lines={[
              "Principal authority and external representative of the club.",
              "Final arbiter of the Secretariat, bearing ultimate responsibility for conference success and reputation.",
            ]}
          />
          <MiniRoleCard
            icon={<ScrollUserIcon />}
            title="Secretary‑General"
            lines={[
              "Chief coordinator of administrative and operational activities, reporting to the President.",
              "Ceremonial head who presides over key functions, ensures diplomatic protocol, and upholds the academic spirit of the event.",
            ]}
          />
          <MiniRoleCard
            icon={<UserRoundIcon />}
            title="General Secretary"
            lines={[
              "Custodian of official documentation and internal communication.",
              "Supervises the Junior Secretariat and maintains archival records and formal documentation.",
            ]}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50/80 p-4 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">
            Core duties and strategic responsibilities
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>
              Diplomacy and outreach: drafting, approving, and dispatching
              formal agreements and communications, including invitations to
              dignitaries, keynote speakers, Executive Board members, and staff.
            </li>
            <li>
              Protocol and documentation: overseeing preparation, verification,
              and distribution of certificates, awards, and all official
              documents.
            </li>
            <li>
              Dignitary management: handling hospitality, logistics, and
              communication for high‑profile guests to ensure a seamless and
              respectful experience.
            </li>
            <li>
              Crisis management: acting as the primary decision‑making body
              during unforeseen crises to provide calm, decisive leadership.
            </li>
          </ul>
        </div>
      </BounceSection>

      {/* 3. USG Offices / Departments */}
      <BounceSection id="mandate-departments" icon={<NetworkIconBig />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Under‑Secretary‑General offices and operational structure
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Under‑Secretary‑General offices are specialised departments led by a
          Head with Deputies, reporting to the Secretary‑General and managing
          core functional domains such as Delegate Affairs, IT, PR, Marketing,
          Finance, Sponsorship, Logistics, and Conference Management.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <DeptCard
            icon={<UsersIcon />}
            title="Delegate Affairs"
            structure="1 Head, 2 Deputies"
            reporting="Deputies → Head → Secretary‑General"
            mandatePoints={[
              "Handles membership and delegate registration, attendance monitoring, identity verification, and onboarding.",
              "Maintains delegate databases and manages portfolio allocation and on‑site query resolution.",
            ]}
            narrativeTitle="Participant journey"
            narrativePoints={[
              "Guides delegates from registration to feedback with clear communication on portfolios and committee placement.",
              "Collaborates with Conference Management and Logistics on rooming, desk layouts, and movement flows.",
            ]}
          />

          <DeptCard
            icon={<ITIcon />}
            title="Information Technology (IT)"
            structure="1 Head, 2 Deputies"
            reporting="Deputies → Head → Secretary‑General"
            mandatePoints={[
              "Maintains digital infrastructure, backend systems, and registration portals.",
              "Supports visual branding, presentation design, and technical troubleshooting during events.",
            ]}
            narrativeTitle="Digital & creative identity"
            narrativePoints={[
              "Maintains websites, forms, and data integrity across platforms.",
              "Works with PR and design sub‑teams to create a coherent visual and video presence for SECMUN.",
            ]}
          />

          <DeptCard
            icon={<PRIcon />}
            title="Public Relations"
            structure="1 Head, 1 Deputy"
            reporting="Deputy → Head → Secretary‑General"
            mandatePoints={[
              "Manages media communication, public image, and official correspondence.",
              "Acts as primary liaison with student communities and external institutions.",
            ]}
            narrativeTitle="Crafting the narrative"
            narrativePoints={[
              "Creates and disseminates promotional materials across digital and print channels.",
              "Maintains social media, manages media and institutional outreach, and runs the Campus Ambassador Programme.",
              "Supplies copy and messaging support for IT/Design assets.",
            ]}
          />

          <DeptCard
            icon={<MegaphoneIcon />}
            title="Marketing"
            structure="1 Head, 1 Deputy"
            reporting="Deputy → Head → Secretary‑General"
            mandatePoints={[
              "Leads publicity campaigns, poster design, promotional content, and cross‑platform outreach.",
            ]}
            narrativeTitle="Amplifying the brand"
            narrativePoints={[
              "Translates SECMUN’s core narrative into targeted campaigns across campuses and online platforms.",
              "Aligns messaging with PR and Sponsorship to maintain a coherent, professional presence.",
            ]}
          />

          <DeptCard
            icon={<WalletIcon />}
            title="Finance"
            structure="1 Head, 1 Deputy"
            reporting="Deputy → Head → Secretary‑General"
            mandatePoints={[
              "Prepares budgets, tracks expenditure, processes reimbursements, and produces financial reports.",
            ]}
            narrativeTitle="Financial integrity"
            narrativePoints={[
              "Keeps SECMUN audit‑ready with clear documentation of inflows and outflows.",
              "Coordinates with Sponsorship to reconcile sponsorship funds and obligations.",
            ]}
          />

          <DeptCard
            icon={<HandshakeIcon />}
            title="Sponsorship"
            structure="1 Head, 1 Deputy"
            reporting="Deputy → Head → Secretary‑General"
            mandatePoints={[
              "Conducts sponsorship outreach, manages MoUs, and oversees corporate engagement.",
              "Coordinates with Finance to ensure sponsor‑related financial flows are properly recorded.",
            ]}
            narrativeTitle="Strategic partnerships"
            narrativePoints={[
              "Designs sponsorship decks aligned with SECMUN’s value proposition.",
              "Ensures sponsor presence enhances rather than distracts from academic and delegate experience.",
            ]}
          />

          <DeptCard
            icon={<TruckIcon />}
            title="Logistics"
            structure="1 Head, 1 Deputy"
            reporting="Deputy → Head → Secretary‑General"
            mandatePoints={[
              "Oversees event setup, material procurement, seating plans, and operational readiness.",
            ]}
            narrativeTitle="The engine room"
            narrativePoints={[
              "Controls physical assets such as placards, kits, awards, mementoes, and room arrangements.",
              "Coordinates with Conference Management so physical spaces support the planned run‑of‑show.",
            ]}
          />

          <DeptCard
            icon={<ClipboardIcon />}
            title="Conference Management"
            structure="1 Head"
            reporting="Head → Secretary‑General"
            mandatePoints={[
              "Leads end‑to‑end planning and execution of conferences, including portfolio distribution and Dais coordination.",
            ]}
            narrativeTitle="Architects of the experience"
            narrativePoints={[
              "Owns venue management, technical readiness, and the detailed minute‑by‑minute run‑of‑show.",
              "Aligns ceremonies, socials, committee timings, and announcements into a cohesive schedule.",
            ]}
          />
        </div>
      </BounceSection>

      {/* 4. Junior Secretariat */}
      <BounceSection
        id="mandate-junior-secretariat"
        icon={<GraduationCapIcon />}
      >
        <h3 className="text-sm font-semibold text-slate-900">
          Junior Secretariat (under the General Secretary)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          The Junior Secretariat is a foundational unit that supports
          day‑to‑day operations while serving as a leadership incubation
          platform for future Secretariat members, reporting directly to the
          General Secretary.
        </p>
        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Key responsibilities
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Administrative: preparation of placards, attendance
                documentation, and delegate kits.
              </li>
              <li>
                Operational: venue setup, entry and exit regulation, and
                maintaining decorum during sessions.
              </li>
              <li>
                Documentation: drafting minutes, generating reports, and
                assisting with records.
              </li>
              <li>
                Delegate assistance: on‑site support, guidance, and material
                distribution.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Purpose & selection
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Identifies and grooms potential future leaders of the
                Secretariat.
              </li>
              <li>
                Selection is merit‑based, focusing on discipline,
                responsibility, and demonstrated commitment.
              </li>
              <li>
                May operate under guidance of Office Heads during events while
                retaining a clear reporting line to the General Secretary.
              </li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* 5. Tenure, Selection & Promotion */}
      <BounceSection id="mandate-tenure" icon={<CalendarIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Tenure, selection, and promotion protocol
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          The Mandate sets standard durations of office, eligibility criteria,
          and procedures for selection, promotion, and removal to ensure
          continuity, fairness, and institutional compliance.
        </p>
        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Standard tenure</p>
            <p className="mt-1">
              Office‑bearers usually serve for a defined academic session, with
              clearly notified start and end dates consistent with college
              calendars.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Selection & eligibility
            </p>
            <p className="mt-1">
              Selection takes into account academic standing, prior performance,
              discipline, and demonstrated competence in relevant domains, using
              processes outlined by the Secretariat and faculty.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Promotion & removal
            </p>
            <p className="mt-1">
              Members may be promoted, reassigned, or removed based on
              performance and conduct, with all such decisions recorded and
              subject to review under the Constitution and Code of Conduct.
            </p>
          </div>
        </div>
      </BounceSection>

      {/* 6. Executive Board */}
      <BounceSection id="mandate-eb" icon={<GavelIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          The Executive Board (Dias)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          The Executive Board is the intellectual and procedural core of each
          committee, typically comprising a Chair, Vice‑Chair, and Rapporteur,
          responsible for moderation, academic depth, and accurate
          documentation.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
          <li>
            Prepares background guides and ensures research depth and thematic
            coherence for each committee.
          </li>
          <li>
            Moderates debate impartially and evaluates delegate performance
            against academic and procedural standards.
          </li>
          <li>
            Records key decisions, signatories, and evidence for awards and
            post‑conference reports.
          </li>
        </ul>
      </BounceSection>

      {/* 7. Conducting a Conference */}
      <BounceSection id="mandate-playbook" icon={<ClipboardIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Conducting a conference: operational blueprint
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Conducting a SECMUN conference is treated as a structured project,
          moving from pre‑event planning and technical readiness to live
          execution and post‑event documentation under a unified run‑of‑show.
        </p>
        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-4">
          <TimelineColumn
            label="Pre‑planning"
            items={[
              "Confirm Secretariat, Executive Board, and departmental structures.",
              "Draft initial budgets, sponsorship plans, and outreach strategy.",
            ]}
          />
          <TimelineColumn
            label="T‑4 to T‑2 weeks"
            items={[
              "Release background guides, portfolios, and core communication to delegates and institutions.",
              "Lock venues, vendors, and broad logistics for ceremonies and committees.",
            ]}
          />
          <TimelineColumn
            label="T‑1 week to T‑1 day"
            items={[
              "Finalise registrations, room allocations, seating charts, and printed material.",
              "Conduct full technical rehearsals and dry runs with Senior Secretariat and EB.",
            ]}
          />
          <TimelineColumn
            label="Conference days"
            items={[
              "Execute the run‑of‑show with Conference Management as central command.",
              "Maintain decorum, manage crises, and ensure thorough documentation for reports and certificates.",
            ]}
          />
        </div>
      </BounceSection>
      <br/>
    </div>
  )
}

/* ---------- Reusable animated wrappers ---------- */

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
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className="rounded-3xl border border-slate-200 bg-white/95 p-5 sm:p-6 backdrop-blur"
    >
      {icon && (
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {icon}
          </div>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
      )}
      {children}
    </motion.section>
  )
}

function MiniRoleCard({
  icon,
  title,
  lines,
}: {
  icon?: React.ReactNode
  title: string
  lines: string[]
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 230,
        damping: 20,
      }}
      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-white text-blue-600">
            {icon}
          </div>
        )}
        <p className="text-[11px] font-semibold text-slate-900">{title}</p>
      </div>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-700">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </motion.article>
  )
}

interface DeptCardProps {
  icon?: React.ReactNode
  title: string
  structure: string
  reporting: string
  mandatePoints: string[]
  narrativeTitle: string
  narrativePoints: string[]
}

function DeptCard({
  icon,
  title,
  structure,
  reporting,
  mandatePoints,
  narrativeTitle,
  narrativePoints,
}: DeptCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 230,
        damping: 20,
      }}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 text-xs shadow-sm backdrop-blur"
    >
      <div className="flex items-start gap-2">
        {icon && (
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-[11px] text-slate-600">
            Structure: {structure}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">{reporting}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-slate-900">
          Mandate & key functions
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          {mandatePoints.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-50/80 p-3">
        <p className="text-[11px] font-semibold text-slate-900">
          {narrativeTitle}
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          {narrativePoints.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

function TimelineColumn({
  label,
  items,
}: {
  label: string
  items: string[]
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        {items.map((i) => (
          <li key={i} className="text-[11px] text-slate-700">
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Icon helper components ---------- */

function BuildingIcon() {
  return <Building2 className="h-4 w-4" />
}

function CrownIcon({ small }: { small?: boolean }) {
  return <Crown className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
}

function ScrollUserIcon() {
  return <ScrollText className="h-3.5 w-3.5" />
}

function UserRoundIcon() {
  return <UserRound className="h-3.5 w-3.5" />
}

function UsersIcon() {
  return <Users className="h-4 w-4" />
}

function NetworkIconBig() {
  return <Network className="h-4 w-4" />
}

function PRIcon() {
  return <Megaphone className="h-4 w-4" />
}

function ITIcon() {
  return <Palette className="h-4 w-4" />
}

function MegaphoneIcon() {
  return <Megaphone className="h-4 w-4" />
}

function WalletIcon() {
  return <Wallet className="h-4 w-4" />
}

function HandshakeIcon() {
  return <Handshake className="h-4 w-4" />
}

function TruckIcon() {
  return <Truck className="h-4 w-4" />
}

function ClipboardIcon() {
  return <ClipboardList className="h-4 w-4" />
}

function GraduationCapIcon() {
  return <GraduationCap className="h-4 w-4" />
}

function CalendarIcon() {
  return <CalendarClock className="h-4 w-4" />
}

function GavelIcon() {
  return <ShieldCheck className="h-4 w-4 rotate-12" />
}
