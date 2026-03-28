import { useState, useEffect, useRef } from 'react'
import './ChatAssistant.css'

const BOT_RESPONSES = {
  greeting: [
    "Hi! I'm your AI Money Mentor 👋 I'm here to help you build a better financial future. What would you like to know?",
    "Hello! Ready to talk money? 💰 Ask me anything about savings, investments, budgeting, or goals!"
  ],
  savings: [
    "Great question! The golden rule is to save at least 20% of your income. Start by automating transfers to a separate savings account on payday — you'll never miss what you don't see! 🏦",
    "For savings, try the 50/30/20 rule: 50% needs, 30% wants, 20% savings & investments. Even small, consistent savings compound into huge amounts over time! 📈"
  ],
  investment: [
    "For investing, I recommend starting with index funds — they're low-cost, diversified, and beat most active funds over the long run. For beginners, SIPs in Nifty 50 index funds are a great start! 📊",
    "Index funds, PPF, and NPS are excellent for beginners. As you get comfortable, explore mid/small-cap funds based on your risk appetite. Remember: time in the market beats timing the market! ⏰"
  ],
  budget: [
    "The 50/30/20 budget method works brilliantly: 50% on necessities (rent, food, utilities), 30% on wants (dining, entertainment), and 20% on savings + debt repayment. Want me to break this down for your income? 💡",
    "Start by tracking every expense for a month — most people are shocked to see where their money goes! Apps like Splitwise or a simple spreadsheet work great for this."
  ],
  debt: [
    "For clearing debt, use the Avalanche method: pay minimums on all debts, then put extra money toward the highest-interest debt first. This saves the most money overall! 💪",
    "The Snowball method (paying off smallest debts first) gives quick psychological wins and momentum. Either way, avoid taking on new high-interest debt while paying off existing ones."
  ],
  emergency: [
    "An emergency fund should cover 3-6 months of your monthly expenses. Keep it in a liquid account (FD or liquid mutual fund) — easily accessible but separate from daily spending. Start with just 1 month as a goal! 🛡️",
    "Emergency funds are your financial safety net. Target 6 months of expenses if your job is unstable, 3 months if you have stable employment. Build it before investing!"
  ],
  goal: [
    "For any financial goal, SMART planning works: Specific amount, Measurable milestones, Achievable monthly savings, Realistic timeline, Time-bound target. Use our Goal Planner above to calculate exactly what you need! 🎯",
    "Break big goals into monthly targets. For a ₹10L goal in 5 years, you need about ₹16,666/month (with 8% growth). The Goal Planner feature shows you the exact numbers!"
  ],
  sip: [
    "SIP (Systematic Investment Plan) is one of the best wealth-building tools! Even ₹5,000/month in a good equity fund can grow to ₹50+ lakhs over 20 years thanks to compounding. Start small, increase by 10% each year! 🚀",
    "SIPs work best when started early. ₹10,000/month at 12% returns = ₹1 Crore in just 20 years! The key is consistency — never stop your SIPs, even during market downturns."
  ],
  tax: [
    "Great tax-saving options in India: Section 80C (₹1.5L limit) via PPF, ELSS, life insurance. NPS gives additional ₹50K deduction under 80CCD. Don't forget HRA, medical insurance deductions! 📋",
    "ELSS funds give both tax savings AND equity market returns — they have just 3-year lock-in (lowest among 80C options). Invest early in the financial year, don't wait till March! 📅"
  ],
  default: [
    "That's an interesting question! 🤔 Could you be more specific? I can help with: savings strategies, investment options, budgeting, debt management, emergency funds, tax planning, SIPs, and financial goals.",
    "I'm here to help! You can ask me about:\n💰 Savings tips\n📈 Investment strategies\n🏦 Budgeting\n🛡️ Emergency fund\n🎯 Goal planning\n📋 Tax saving",
    "Great topic! For personalized advice, also try filling in your financial details in the dashboard above — it'll generate a custom financial plan just for you! 📊"
  ]
}

function getBotResponse(message) {
  const msg = message.toLowerCase()
  if (msg.match(/hi|hello|hey|good|morning|evening/)) return rand(BOT_RESPONSES.greeting)
  if (msg.match(/sav/)) return rand(BOT_RESPONSES.savings)
  if (msg.match(/invest|stock|equity|fund|nifty|sensex/)) return rand(BOT_RESPONSES.investment)
  if (msg.match(/budget|50.30.20|expense|spend|track/)) return rand(BOT_RESPONSES.budget)
  if (msg.match(/debt|loan|emi|credit|borrow/)) return rand(BOT_RESPONSES.debt)
  if (msg.match(/emergency|urgent|liquid|contingency/)) return rand(BOT_RESPONSES.emergency)
  if (msg.match(/goal|target|dream|house|car|vacation|retire/)) return rand(BOT_RESPONSES.goal)
  if (msg.match(/sip|systematic|mutual|monthly.*invest/)) return rand(BOT_RESPONSES.sip)
  if (msg.match(/tax|80c|deduct|elss|nps|ppf/)) return rand(BOT_RESPONSES.tax)
  return rand(BOT_RESPONSES.default)
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const QUICK_QUESTIONS = [
  'How do I start saving?',
  'Best investment for beginners?',
  'What is the 50/30/20 rule?',
  'How to build an emergency fund?',
  'How do SIPs work?',
]

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "👋 Hi! I'm your AI Money Mentor. Ask me anything about savings, investments, budgeting, or financial goals!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: getBotResponse(msg),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setIsTyping(false)
      setMessages(prev => [...prev, botMsg])
    }, 1000 + Math.random() * 1000)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`chat-fab ${isOpen ? 'open' : ''}`}
        onClick={() => { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 300) }}
        aria-label="Open AI chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      <div className={`chat-panel ${isOpen ? 'visible' : ''}`}>
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div>
            <div className="chat-title">AI Money Mentor</div>
            <div className="chat-status">
              <span className="status-dot" />
              Always online
            </div>
          </div>
        </div>

        {/* Quick questions */}
        <div className="quick-questions">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} className="quick-chip" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-wrap ${msg.role}`}>
              {msg.role === 'bot' && <div className="bubble-avatar">🤖</div>}
              <div className={`chat-bubble ${msg.role}`}>
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                <span className="msg-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrap bot">
              <div className="bubble-avatar">🤖</div>
              <div className="chat-bubble bot typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about money..."
            aria-label="Chat input"
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  )
}
