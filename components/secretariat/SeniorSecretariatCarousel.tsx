"use client";

import {
  Carousel,
  Card as AppleCard,
} from "@/components/ui/apple-cards-carousel";
import {
  leadershipMembers,
  type LeadershipMember,
} from "@/lib/secretariat/data";

const DEFAULT_AVATAR = "https://avatars.githubusercontent.com/u/9919?v=4";

function roleLabel(role: string) {
  switch (role) {
    case "PRESIDENT":
      return "President";
    case "SECRETARY_GENERAL":
      return "Secretary General";
    case "DIRECTOR_GENERAL":
      return "Director General";
    case "TEACHER":
      return "Teacher In‑Charge";
    default:
      return role;
  }
}

function toAppleCard(member: LeadershipMember) {
  return {
    src: member.photoUrl || DEFAULT_AVATAR,
    title: member.name,
    category: roleLabel(member.role),
    content: (
      <div className="space-y-2 text-sm text-neutral-800">
        <p className="font-semibold">{member.name}</p>
        <p className="text-xs font-medium text-sky-700">
          {roleLabel(member.role)}
        </p>
        <p className="text-[11px] text-neutral-500">
          {(member.academicDepartment || "Department") +
            (member.year ? ` · ${member.year}` : "")}
        </p>
        {member.tagline && (
          <p className="pt-2 text-[11px] text-neutral-600">
            {member.tagline}
          </p>
        )}
        <div className="space-y-1 pt-3 text-[11px] text-neutral-600">
          <p>{member.email}</p>
          {member.phone && <p>{member.phone}</p>}
        </div>
      </div>
    ),
  };
}

export function SeniorSecretariatCarousel() {
  const cards = leadershipMembers.map(toAppleCard);
  const currenDate = new Date();
  const currentYear = currenDate.getFullYear();
  const nextYear = currentYear + 1;

  return (
    <section className="rounded-3xl border bg-slate-50/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-[30px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          SECMUN Senior Secretariat
        </p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Meet the Senior Secretariat of SEC-MUN of {currentYear}-{nextYear}
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          President, Secretary General, Director General, and Teachers in
          Charge.
        </p>
      </header>

      <div className="w-full">
        <Carousel
          items={cards.map((card, index) => (
            <AppleCard key={card.title + index} card={card} index={index} />
          ))}
        />
      </div>
    </section>
  );
}