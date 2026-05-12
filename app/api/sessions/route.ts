import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/prisma'

export async function GET() {
  try {
    const sessions = await db.pomodoroSession.findMany({
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { duration, notes } = await request.json()

    if (!duration || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Duration is required and must be a number' },
        { status: 400 }
      )
    }

    const session = await db.pomodoroSession.create({
      data: {
        duration,
        notes: notes || null
      }
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
