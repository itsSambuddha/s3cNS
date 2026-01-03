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
    <div className="space-y-8">
      {/* Preamble */}
      <BounceSection id="const-preamble" icon={<ScrollTextIcon />}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Constitution
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Preamble</h2>
        <div className="mt-1 space-y-3 text-sm text-slate-700">
          <p>
            We, the members of the SECMUN (St. Edmund&apos;s College Model United Nations) Club,
            Recalling the club&apos;s founding in 2014 and recognizing its heritage in fostering
            academic excellence, global discourse, and diplomatic practice;
          </p>
          <p>
            <em>Acknowledging </em>, the leadership and visionary direction of the 2025 Senior Secretariat
            constituting of the President and Secretary-General in revitalizing
            the club’s mandate toward national recognition;
          </p>
          <p>
            <em>Affirming </em>, our collective commitment to cultivate articulate, ethical, and globally-minded
            individuals through structured MUN experiences, training programs, and intellectual forums;
          </p>
          <p>
            <em>Emphasizing </em>, the importance of professionalism, inclusivity, academic integrity, and service
            to both the institution and the international MUN community;
          </p>
          <p>
            <em>Recognizing </em>, the continued guidance of our esteemed Teacher-in-Charge and the need for
            institutional accountability;
          </p>
          <p className="font-semibold">
            Do hereby establish and adopt this Constitution as the supreme governing document of the
            SECMUN club, to regulate its organization, responsibilities, code of conduct, and future
            development.
          </p>
        </div>
      </BounceSection>

      {/* Article 1 */}
      <BounceSection id="const-1" icon={<GavelIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">
          Article 1: Name and Purpose
        </h3>
        <div className="mt-2 space-y-2 text-sm text-slate-700">
          <p><strong>1.1 Name:</strong> The club shall be known as SECMUN (St. Edmund&apos;s College Model United Nations).</p>
          <p><strong>1.2 Purpose:</strong> To organize MUN conferences, workshops, and training sessions; to represent SECMUN at external MUN events; to provide members with platforms to develop diplomacy, public speaking, writing, research, and negotiation skills; and to make SECMUN a nationally recognized student body.</p>
        </div>
      </BounceSection>

      {/* Article 2 */}
      <BounceSection id="const-2" icon={<UsersIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">Article 2: Membership</h3>
        <div className="mt-2 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Eligibility & Rights</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li><strong>2.1 Eligibility:</strong> Membership is open to all enrolled students of the college.</li>
              <li><strong>2.2 Rights:</strong> Members have the right to participate in all club activities, vote in elections, and apply for official positions.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Duties & Discipline</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li><strong>2.3 Duties:</strong> Members must uphold the values of the club, comply with the code of conduct, and actively engage in organized events.</li>
              <li>
                <strong>2.4 Disciplinary Clause:</strong> Any form of misconduct, including but not limited to harassment, academic dishonesty, financial misappropriation, unauthorized representation, or breach of the code of conduct (as laid out in Article 11), shall result in disciplinary action up to suspension or expulsion. Illegal activities within or outside SECMUN that damage its reputation will result in immediate expulsion and be reported to college authorities. The Teacher-in-Charge and core leadership shall jointly preside over all disciplinary hearings.
              </li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Article 3 */}
      <BounceSection id="const-3" icon={<NetworkIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">Article 3: Secretariat Structure</h3>
        <div className="mt-2 space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold">3.1 Senior Secretariat:</p>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li><strong>President:</strong> Principal authority and external representative of the club.</li>
              <li><strong>Secretary-General:</strong> Chief coordinator of administrative and operational activities.</li>
              <li><strong>General Secretary:</strong> Custodian of official documentation and internal communication. Supervises the Junior Secretariat and liaises across offices.</li>
              <li><strong>Faculty Advisor / Teacher-in-Charge:</strong> Provides institutional oversight, ensures academic and disciplinary integrity, and approves structural and financial decisions.</li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold">3.2 Offices Under Secretary General (1 Head + Deputies):</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
              <span>Delegate Affairs (1+2)</span>
              <span>IT Office (1+2)</span>
              <span>PR Office (1+1)</span>
              <span>Marketing (1+1)</span>
              <span>Finance (1+1)</span>
              <span>Sponsorship (1+1)</span>
              <span>Logistics (1+1)</span>
              <span>Conference Mgmt (1)</span>
            </div>
          </div>
          
          {/* <p><strong>3.3 Junior Secretariat:</strong> Under General Secretary. Assists all Offices and functions as a preparatory cohort for future leadership.</p> */}
        </div>
      </BounceSection>

      {/* Articles 4-5 */}
      <BounceSection id="const-4" icon={<LayersIcon />}>
        <h3 className="text-sm font-semibold text-slate-900">Articles 4–5: Roles & Hierarchy</h3>
        <div className="mt-2 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Article 4: Roles and Responsibilities</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>All office-bearers shall receive a role description document outlining specific functions, expectations, and reporting duties.</li>
              <li>Office-bearers must adhere to a professional standard in conduct and performance, in accordance with Article 11 (Code of Conduct).</li>
              <li>The Teacher-in-Charge shall retain the right to oversee and audit club activities at any time.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Article 5: Reporting Hierarchy</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>Deputies → Office Heads → Secretary-General → President</li>
              {/* <li>Junior Secretariat/Deputies → General Secretary → Secretary-General</li> */}
              <li>All senior leadership reports operational updates to the Teacher-in-Charge / College administration if and when required.</li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Article 6 */}
      <BounceSection id="const-6" icon={<CalendarClock className="h-4 w-4" />}>
        <h3 className="text-sm font-semibold text-slate-900">Article 6: Tenure and Selection</h3>
        <div className="mt-3 space-y-3 text-xs text-slate-700">
          <p><strong>6.1 Tenure:</strong> All office-bearers shall serve a one-year term aligned with the operational calendar of SECMUN, commencing from the date of their official appointment. This term shall not extend beyond the academic year in which the appointment was made.</p>
          
          <p className="font-semibold">Academic Eligibility:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>President/Secretary-General:</strong> Senior-most semester after 6th Semester (typically Semester 4).</li>
            {/* <li><strong>Junior Secretariat:</strong> Junior-most semester (typically Semester 1 or 2).</li> */}
            <li><strong>Other roles:</strong> Open to all enrolled members meeting role requirements.</li>
          </ul>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/80 p-3">
              <p className="font-semibold text-slate-900 text-xs">6.2 Selection Process</p>
              <ul className="mt-1 list-disc pl-4 text-xs">
                <li><em>Most positions:</em> Open applications → Core Panel selection → Teacher-in-Charge ratification</li>
                <li><em>President/SecGen/GenSec:</em> Club election/nomination → Teacher-in-Charge approval</li>
                {/* <li><em>Junior Sec:</em> Performance-based screening + recommendations</li> */}
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-50/80 p-3">
              <p className="font-semibold text-slate-900 text-xs">6.3-6.4 Vacancies/Termination</p>
              <ul className="mt-1 list-disc pl-4 text-xs">
                <li>Mid-term: Acting Officer → Replacement within 15 days</li>
                <li>Termination: Gross misconduct, negligence, or protocol violations via formal inquiry</li>
              </ul>
            </div>
          </div>
        </div>
      </BounceSection>

      {/* Articles 7-9 */}
      <BounceSection id="const-7" icon={<FileText className="h-4 w-4" />}>
        <h3 className="text-sm font-semibold text-slate-900">Articles 7–9: Operations</h3>
        <div className="mt-2 grid gap-4 text-xs text-slate-700 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900 mb-2">Article 7: Meetings</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Quarterly meetings for progress assessment</li>
              <li>Emergency meetings by President/SecGen/Teacher-in-Charge</li>
              <li>Quorum: 50%+1 of office-bearers</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900 mb-2">Article 8: Events</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Workshops, training, mock MUNs, conferences</li>
              <li>Delegation to regional/national/international MUNs</li>
              <li>All events under Teacher-in-Charge knowledge</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900 mb-2">Article 9: Finance</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Finance + Sponsorship Offices manage budgeting</li>
              <li>Transparent financial records required</li>
              <li>Annual budgets submitted to Teacher-in-Charge</li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Articles 10-11 */}
      <BounceSection id="const-10" icon={<ShieldCheck className="h-4 w-4" />}>
        <h3 className="text-sm font-semibold text-slate-900">Articles 10–11: Governance</h3>
        <div className="mt-2 grid gap-4 text-xs text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Article 10: Feedback & Amendments</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>Feedback system for members&apos; concerns/suggestions</li>
              <li>Amendments: ⅔ majority of office-bearers + Teacher-in-Charge ratification</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Article 11: Code of Conduct</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>All members addressed as &quot;Sir/Madam&quot; during formal operations</li>
              <li>Professional etiquette, non-discrimination, punctuality mandatory</li>
              <li>Misconduct → formal inquiry by Teacher-in-Charge</li>
            </ul>
          </div>
        </div>
      </BounceSection>

      {/* Article 12 */}
      <BounceSection id="const-12" icon={<Award className="h-4 w-4" />}>
        <h3 className="text-sm font-semibold text-slate-900">Article 12: Certification</h3>
        <div className="mt-2 space-y-3 text-sm text-slate-700">
          <p><strong>12.1 Certification of Service:</strong> Issued to all Secretariat members upon term completion, stating designation, tenure, and responsibilities.</p>
          <p><strong>12.2 Recognition:</strong> Distinguished contributions acknowledged in assemblies/documentation.</p>
          <p><strong>12.3 Documentation:</strong> All certificates recorded in central archive by General Secretary.</p>
        </div>
      </BounceSection>

      {/* Article 13 */}
      <BounceSection id="const-13" icon={<Gavel className="h-4 w-4" />}>
        <h3 className="text-sm font-semibold text-slate-900 ">Article 13: Dissolution</h3>
        <p className="mt-1 text-sm text-slate-600">
          The club may only be dissolved upon unanimous agreement of the President, Secretary-General, and General Secretary, and with formal consent from the Teacher-in-Charge.
        </p>
      </BounceSection>
      <br/>
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
