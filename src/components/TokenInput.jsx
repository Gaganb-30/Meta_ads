import { useState } from 'react'

const TokenInput = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (token.trim()) {
      onTokenSubmit(token.trim())
    }
  }

  return (
    <div className="token-screen">
      <div className="token-card">
        <div className="token-card-icon">🔑</div>
        <h1>Meta Ads Explorer</h1>
        <p>
          Enter your Meta Graph API access token to start exploring the Ad Library.
          Your token is stored locally and never sent to any third-party server.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="token-input-wrapper">
            <input
              type={showToken ? 'text' : 'password'}
              className="input-field"
              placeholder="Paste your access token here…"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', justifyContent: 'flex-start' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={showToken}
                onChange={(e) => setShowToken(e.target.checked)}
                style={{ accentColor: 'var(--accent-violet)' }}
              />
              Show token
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={!token.trim()}>
            🚀 Connect & Start Exploring
          </button>
        </form>
        <p className="helper-text">
          Get your token from{' '}
          <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-violet)' }}>
            Meta Graph API Explorer
          </a>
        </p>
      </div>
    </div>
  )
}

export default TokenInput
