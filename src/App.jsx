import { useState, useEffect, useCallback } from 'react'
import './index.css'
import TokenInput from './components/TokenInput'
import SearchPanel from './components/SearchPanel'
import ResultsDisplay from './components/ResultsDisplay'
import Filters from './components/Filters'
import Pagination from './components/Pagination'

const API_BASE = 'https://graph.facebook.com/v25.0/ads_archive'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('meta_ads_token') || '')
  const [allAds, setAllAds] = useState([])
  const [filteredAds, setFilteredAds] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const [lastParams, setLastParams] = useState(null)
  const [view, setView] = useState('cards')
  const [hasSearched, setHasSearched] = useState(false)

  const handleTokenSubmit = (newToken) => {
    localStorage.setItem('meta_ads_token', newToken)
    setToken(newToken)
  }

  const handleDisconnect = () => {
    localStorage.removeItem('meta_ads_token')
    setToken('')
    setAllAds([])
    setFilteredAds([])
    setError(null)
    setNextCursor(null)
    setHasSearched(false)
  }

  const buildUrl = (params, cursor) => {
    const url = new URL(API_BASE)
    url.searchParams.set('access_token', token)

    Object.entries(params).forEach(([key, value]) => {
      if (key === 'ad_reached_countries') {
        // API expects JSON array format like ["US","GB"]
        url.searchParams.set(key, JSON.stringify(value))
      } else {
        url.searchParams.set(key, value)
      }
    })

    if (cursor) {
      url.searchParams.set('after', cursor)
    }

    return url.toString()
  }

  const handleSearch = async (params) => {
    setLoading(true)
    setError(null)
    setAllAds([])
    setFilteredAds([])
    setNextCursor(null)
    setLastParams(params)
    setHasSearched(true)

    try {
      const url = buildUrl(params)
      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'API Error')
      }

      const ads = data.data || []
      setAllAds(ads)
      setFilteredAds(ads)

      // Handle pagination
      if (data.paging && data.paging.cursors && data.paging.cursors.after && data.paging.next) {
        setNextCursor(data.paging.cursors.after)
      } else {
        setNextCursor(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!nextCursor || !lastParams) return

    setLoadingMore(true)
    setError(null)

    try {
      const url = buildUrl(lastParams, nextCursor)
      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'API Error')
      }

      const newAds = data.data || []
      const combined = [...allAds, ...newAds]
      setAllAds(combined)
      setFilteredAds(combined)

      if (data.paging && data.paging.cursors && data.paging.cursors.after && data.paging.next) {
        setNextCursor(data.paging.cursors.after)
      } else {
        setNextCursor(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleFilter = useCallback((filtered) => {
    setFilteredAds(filtered)
  }, [])

  // If no token, show token screen
  if (!token) {
    return <TokenInput onTokenSubmit={handleTokenSubmit} />
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">📊</div>
          <span className="app-logo-text">Meta Ads Explorer</span>
          <span className="app-logo-badge">v25.0</span>
        </div>
        <div className="header-actions">
          <div className="token-status">
            <span className="token-status-dot"></span>
            Connected
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      </header>

      {/* Search Panel */}
      <SearchPanel onSearch={handleSearch} loading={loading} />

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-msg">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Fetching ads from Meta Ad Library...</div>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && allAds.length > 0 && (
        <>
          <Filters
            ads={allAds}
            onFilter={handleFilter}
            view={view}
            onViewChange={setView}
            totalCount={filteredAds.length}
          />
          <ResultsDisplay ads={filteredAds} view={view} />
          <Pagination
            hasMore={!!nextCursor}
            loading={loadingMore}
            onLoadMore={handleLoadMore}
            loadedCount={allAds.length}
          />
        </>
      )}

      {/* Empty State after search */}
      {!loading && hasSearched && allAds.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Results Found</h3>
          <p>Try different search terms, broader date ranges, or different countries.</p>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <h3>Ready to Explore</h3>
          <p>Configure your search parameters above and click "Search Ads" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default App
