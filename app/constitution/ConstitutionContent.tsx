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
} from "lucide-react"

/**
 * ConstitutionContent
 *
 * Full Constitution view:
 * - Preamble
 * - Articles 1–13 (grouped where logical)
 *
 * Sections have ids that match the NAV_ITEMS used in page.tsx.
 */

export function ConstitutionContent() {
  return (
    <div className="space-y-8">
      {/* Preamble */}
      <BounceSection id="const-preamble" icon={<ScrollTextIcon />}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Constitution
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          Preamble
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          This Constitution is the foundational charter of SECMUN. It recalls
          the club’s origin and legacy at St. Edmund’s College, recognises the
          role of faculty and administration, and records the mandate entrusted
          to the Secretariat and general body.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          The document exists to codify structure, responsibilities,
          accountability, and procedures in a manner that is transparent,
          consistent, and aligned with institutional expectations. All members,
          office‑bearers, and bodies constituted under SECMUN are bound by the
          provisions set out herein.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          In affirming this Constitution, SECMUN commits itself to
          professionalism, inclusivity, academic integrity, and service to the
          wider student and Model United Nations community.
        </p>
      </BounceSection>

      {/* Article 1 */}
      <BounceSection id="const-1" icon={<GavelIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 1 – Name and Nature
        </h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            The name of the body shall be “SECMUN” (St. Edmund&apos;s College
            Model United Nations), hereafter referred to as “the Club” or
            “SECMUN Secretariat” where applicable.
          </li>
          <li>
            SECMUN is recognised as an institutional, student‑led academic body
            functioning under the administrative oversight of St. Edmund’s
            College through the Teacher‑in‑Charge/Faculty Coordinator and
            relevant authorities.
          </li>
          <li>
            This Constitution, together with the Mandate, is the official
            governance framework for SECMUN and supersedes all informal
            understandings that conflict with its provisions.
          </li>
        </ul>
      </BounceSection>

      {/* Article 2 */}
      <BounceSection id="const-2" icon={<UsersIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 2 – Membership
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Membership provisions define who may be part of SECMUN, what rights
          and duties they hold, and how they may cease to be members.
        </p>
        <div className="mt-2 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Eligibility</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Membership is generally open to students currently enrolled at
                St. Edmund’s College, subject to institutional rules.
              </li>
              <li>
                Categories such as core members, associate members, and Junior
                Secretariat members may be defined in supplemental regulations.
              </li>
              <li>
                Members must accept this Constitution and Code of Conduct as a
                condition of entry and continued participation.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Rights, duties, and cessation
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Rights may include participation in SECMUN activities, access
                to training, eligibility for Secretariat positions, and voting
                in internal processes where specified.
              </li>
              <li>
                Duties include maintaining decorum, upholding SECMUN&apos;s
                reputation, adhering to academic and ethical standards, and
                complying with directions of the Secretariat issued under this
                Constitution.
              </li>
              <li>
                Membership may be suspended or terminated for misconduct,
                persistent non‑performance, or violation of the Code of Conduct,
                following the procedures laid down in later Articles.
              </li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Article 3 */}
      <BounceSection id="const-3" icon={<NetworkIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 3 – Secretariat Structure
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          This Article establishes the internal architecture of SECMUN and
          identifies principal offices, bodies, and reporting lines.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            The Secretariat shall consist of:
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
              <li>
                Senior Secretariat (President, Secretary‑General, General
                Secretary, and any other roles defined in the Mandate).
              </li>
              <li>
                Under‑Secretary‑General offices and other operational
                departments as described in the Mandate.
              </li>
              <li>
                Junior Secretariat functioning under the General Secretary.
              </li>
              <li>
                Executive Board (Dias) for each conference committee.
              </li>
            </ul>
          </li>
          <li>
            A Teacher‑in‑Charge/Faculty Coordinator shall be appointed by the
            College to provide academic and administrative oversight, and to act
            as the primary liaison between SECMUN and the institution.
          </li>
          <li>
            Any modification to the Secretariat structure must be proposed in
            writing, justified with operational need, and ratified in accordance
            with the amendment procedures outlined in this Constitution.
          </li>
        </ul>
      </BounceSection>

      {/* Articles 4–6 */}
      <BounceSection id="const-4" icon={<LayersIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Articles 4–6 – Roles, Hierarchy, and Tenure
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          These Articles translate Secretariat positions into clear,
          enforceable roles and timelines, defining how authority and
          responsibility flow within SECMUN.
        </p>

        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Article 4 – Roles and responsibilities
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Each office‑bearer shall have a defined mandate, including key
                tasks, decision‑making limits, and expected standards of
                performance, as elaborated in the Mandate.
              </li>
              <li>
                Office‑bearers must exercise their powers in good faith and in
                alignment with SECMUN’s objectives and institutional norms.
              </li>
              <li>
                Failure to meet role expectations may trigger review, guidance,
                or removal as provided under subsequent Articles.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Article 5 – Reporting hierarchy
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Deputies report to their respective Heads, who in turn report to
                the Secretary‑General; the Secretary‑General reports to the
                President and the Teacher‑in‑Charge where required.
              </li>
              <li>
                The General Secretary oversees documentation, records, and the
                Junior Secretariat, and coordinates with other offices for
                information flow.
              </li>
              <li>
                The Executive Board of each committee remains academically
                autonomous in moderation but accountable to the Senior
                Secretariat for adherence to conference‑wide policies.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Article 6 – Tenure and vacancies
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                The default tenure of Secretariat positions shall be one
                academic session or as otherwise notified in writing.
              </li>
              <li>
                Eligibility for specific roles may include semester standing,
                prior experience, merit, and conduct, as determined through
                defined selection processes.
              </li>
              <li>
                Vacancies created by resignation, removal, or other causes shall
                be filled through an interim appointment or special selection,
                recorded and communicated to the membership.
              </li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Articles 7–10 */}
      <BounceSection id="const-5" icon={<CalendarIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Articles 7–10 – Meetings, Activities, Finance, and Amendments
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          These Articles govern how SECMUN deliberates, what activities it may
          undertake, how finances are managed, and how this Constitution may be
          improved over time.
        </p>

        <div className="mt-3 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Article 7 – Meetings and quorum
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Ordinary meetings of the Secretariat shall be held at intervals
                determined by the Senior Secretariat, with reasonable notice to
                members.
              </li>
              <li>
                Emergency meetings may be convened for urgent matters, with
                shortened notice periods as circumstances require.
              </li>
              <li>
                Quorum for meetings that take binding decisions shall be a
                proportion of voting members specified in internal regulations;
                absence of quorum limits such meetings to discussion only.
              </li>
            </ul>

            <p className="mt-3 font-semibold text-slate-900">
              Article 8 – Events and activities
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                SECMUN may organise conferences, workshops, training sessions,
                mock simulations, outreach events, and delegations to external
                MUNs, subject to institutional approval.
              </li>
              <li>
                All events must comply with college policies on finance,
                security, publicity, and use of premises.
              </li>
              <li>
                The Secretariat shall ensure that academic quality and decorum
                remain central to every activity conducted under the SECMUN
                name.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">
              Article 9 – Finance
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                All financial inflows and outflows relating to SECMUN shall be
                recorded accurately, with supporting documentation retained for
                audit and review.
              </li>
              <li>
                Budgets must be prepared in advance for major events and
                submitted for approval to the appropriate institutional
                authority.
              </li>
              <li>
                No office‑bearer may incur expenditure or enter into financial
                commitments in SECMUN&apos;s name beyond limits or processes
                approved by this Constitution and college rules.
              </li>
            </ul>

            <p className="mt-3 font-semibold text-slate-900">
              Article 10 – Feedback and amendments
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Members may provide feedback on the functioning of the
                Secretariat and the adequacy of this Constitution through
                channels notified by the Senior Secretariat.
              </li>
              <li>
                Proposed amendments shall be circulated in writing, debated in a
                properly convened meeting, and adopted by a qualified majority
                specified in internal amendment rules.
              </li>
              <li>
                Amendments that alter fundamental structure or institutional
                commitments require concurrence of the Teacher‑in‑Charge and
                other authorities designated by the College.
              </li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Article 11 */}
      <BounceSection id="const-6" icon={<ShieldIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 11 – Code of Conduct
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          This Article codifies the behavioural and professional expectations
          applicable to all members, delegates, and office‑bearers.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Members shall uphold standards of respect, non‑discrimination,
            academic honesty, and professional conduct in all SECMUN activities.
          </li>
          <li>
            Misuse of authority, harassment, discrimination, intimidation,
            deliberate misinformation, or breach of confidentiality are
            prohibited and may attract disciplinary action.
          </li>
          <li>
            Complaints of misconduct shall be handled through a structured
            process, ensuring fairness, the right to be heard, and appropriate
            sanctions where violations are established.
          </li>
        </ul>
      </BounceSection>

      {/* Article 12 */}
      <BounceSection id="const-12" icon={<AwardIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 12 – Certification and Recognition
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          This Article governs how SECMUN formally acknowledges service and
          contribution.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Certificates of service may be issued to Secretariat members,
            office‑bearers, and contributors who have satisfactorily completed
            their tenure or assignment.
          </li>
          <li>
            The Senior Secretariat may recommend special recognition, awards, or
            commendations for exceptional work, subject to institutional norms.
          </li>
          <li>
            No certificate or recognition may be issued that misrepresents
            actual responsibilities or performance.
          </li>
        </ul>
      </BounceSection>

      {/* Article 13 */}
      <BounceSection id="const-13" icon={<GavelIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 13 – Dissolution
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          This Article specifies how and under whose authority SECMUN may be
          dissolved.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            SECMUN may be dissolved only with the approval of the College
            authorities designated for this purpose, acting on a formal proposal
            that sets out reasons and implications.
          </li>
          <li>
            In the event of dissolution, all records, funds, and properties held
            in SECMUN&apos;s name shall be handed over to the institution in
            accordance with its rules.
          </li>
          <li>
            Dissolution shall be treated as a measure of last resort, to be
            considered only after reasonable alternatives to reform or
            restructure have been examined.
          </li>
        </ul>
      </BounceSection>
    </div>
  )
}

/* ---------- Reusable animated section wrapper ---------- */

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

/* ---------- Icon wrappers (for clarity) ---------- */

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
