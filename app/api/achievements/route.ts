// app/api/achievements/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { OutboundConference } from '@/lib/db/models/OutboundConference'

const awardLabel: Record<string, string> = {
  BEST_DELEGATE: 'Best Delegate',
  HIGH_COMMENDATION: 'High Commendation',
  SPECIAL_MENTION: 'Special Mention',
  VERBAL_MENTION: 'Verbal Mention',
}

export interface AchievementEntry {
  title: string
  category: string
  description: string
  conferenceId: string
  delegateId?: string
  isTeamAward: boolean
  awardKey?: string
}

export interface ConferenceAchievementGroup {
  conferenceId: string
  conferenceName: string
  venue: string
  rawDate: string
  dateLabel: string
  teamPhotoUrl: string
  teamAward: string
  achievements: AchievementEntry[]
}

export async function GET() {
  try {
    await connectToDatabase()
    const conferences = await OutboundConference.find({}).lean()

    const groups: ConferenceAchievementGroup[] = []

    for (const conf of conferences) {
      const achievements: AchievementEntry[] = []
      const rawDate = conf.dates?.[0] ?? conf.createdAt?.toISOString() ?? ''
      const dateLabel = rawDate
        ? new Date(rawDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : ''

      // Team award entry
      if (conf.teamAward) {
        achievements.push({
          title: conf.teamAward,
          category: 'Team Award',
          description: `The SECMUN delegation was awarded as a team at ${conf.name}.`,
          conferenceId: String(conf._id),
          isTeamAward: true,
        })
      }

      // Individual awards
      const processedPairs = new Set<string>()
      for (const delegate of conf.delegates) {
        if (delegate.award && delegate.status === 'APPROVED') {
          const doubleId = (delegate as any).doubleDelegateId
          
          if (doubleId) {
            if (processedPairs.has(doubleId)) continue
            processedPairs.add(doubleId)
            
            // Group the pair
            const pair = conf.delegates.filter((d: any) => d.doubleDelegateId === doubleId)
            const names = pair.map(p => p.fullName.trim()).join(' & ')
            
            achievements.push({
              title: awardLabel[delegate.award] ?? delegate.award,
              category: 'Individual',
              description: [
                names,
                delegate.committeeReceived?.trim() && `Committee: ${delegate.committeeReceived.trim()}`,
                delegate.portfolioReceived?.trim() && `Portfolio: ${delegate.portfolioReceived.trim()}`,
              ].filter(Boolean).join(' · '),
              conferenceId: String(conf._id),
              isTeamAward: false,
              awardKey: delegate.award,
            })
          } else {
            // Normal individual
            achievements.push({
              title: awardLabel[delegate.award] ?? delegate.award,
              category: 'Individual',
              description: [
                delegate.fullName.trim(),
                delegate.committeeReceived?.trim() && `Committee: ${delegate.committeeReceived.trim()}`,
                delegate.portfolioReceived?.trim() && `Portfolio: ${delegate.portfolioReceived.trim()}`,
              ].filter(Boolean).join(' · '),
              conferenceId: String(conf._id),
              delegateId: String(delegate._id),
              isTeamAward: false,
              awardKey: delegate.award,
            })
          }
        }
      }

      // Only include conferences that have at least one award OR a team photo
      if (achievements.length > 0 || conf.teamPhotoUrl) {
        groups.push({
          conferenceId: String(conf._id),
          conferenceName: conf.name,
          venue: conf.venue ?? '',
          rawDate,
          dateLabel,
          teamPhotoUrl: conf.teamPhotoUrl ?? '',
          teamAward: conf.teamAward ?? '',
          achievements,
        })
      }
    }

    // Sort conferences ascending by first date
    groups.sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())

    return NextResponse.json(groups)
  } catch (err) {
    console.error('[achievements GET]', err)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}
