import { useEffect, useRef } from 'react'
import './CircularProgress.css'

export default function CircularProgress({ score, label, color }) {
  const circleRef = useRef(null)

  useEffect(() => {
    if (circleRef.current) {
      const circumference = 2 * Math.PI * 54
      const offset = circumference - (score / 100) * circumference
      circleRef.current.style.strokeDashoffset = offset
    }
  }, [score])

  return (
    <div className="circular-progress-container">
      <div className="circular-progress-wrapper">
        <svg className="circular-svg" viewBox="0 0 120 120" width="160" height="160">
          {/* Background track */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Glow layer */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 - (score / 100) * 2 * Math.PI * 54}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            opacity="0.3"
            filter="blur(4px)"
          />
          {/* Main progress arc */}
          <circle
            ref={circleRef}
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', stroke: color }}
          />
        </svg>
        <div className="circular-center">
          <span className="circular-score" style={{ color }}>{score}</span>
          <span className="circular-label">{label}</span>
        </div>
      </div>
      <p className="circular-subtitle" style={{ color }}>Money Health Score</p>
    </div>
  )
}
