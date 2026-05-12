'use client'

import { useState, useEffect, useCallback } from 'react'

interface PomodoroSession {
  id: string
  duration: number
  completedAt: string
  notes?: string
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds for easy testing
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [notes, setNotes] = useState('')
  const [showNotesForm, setShowNotesForm] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      setShowNotesForm(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(20)
    setNotes('')
    setShowNotesForm(false)
  }

  const handleSaveSession = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: 20,
          notes: notes.trim() || null,
        }),
      })

      if (response.ok) {
        setShowNotesForm(false)
        setNotes('')
        handleReset()
        fetchSessions()
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Kadiatou Diallo</h1>
        <p className="text-xl text-gray-600">Pomodoro Timer</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Pause
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {showNotesForm && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Session Complete! Add notes (optional):</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you work on?"
              className="w-full p-3 border rounded-lg mb-3"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveSession}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Session
              </button>
              <button
                onClick={() => setShowNotesForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
        
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet. Complete your first Pomodoro session!</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {new Date(session.completedAt).toLocaleDateString()} at{' '}
                      {new Date(session.completedAt).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {Math.floor(session.duration / 60)} minutes
                    </p>
                    {session.notes && (
                      <p className="text-sm text-gray-700 mt-1">{session.notes}</p>
                    )}
                  </div>
                  <div className="text-green-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
