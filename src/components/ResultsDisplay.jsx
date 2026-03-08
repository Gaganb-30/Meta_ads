const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AdCard = ({ ad }) => {
    const body = Array.isArray(ad.ad_creative_bodies)
        ? ad.ad_creative_bodies[0]
        : ad.ad_creative_bodies || ad.ad_creative_body || ''

    const linkTitle = Array.isArray(ad.ad_creative_link_titles)
        ? ad.ad_creative_link_titles[0]
        : ad.ad_creative_link_titles || ad.ad_creative_link_title || ''

    const isActive = ad.ad_delivery_stop_time ? false : true
    const platforms = ad.publisher_platforms || []

    return (
        <div className="ad-card">
            <div className="ad-card-header">
                <div className="ad-page-info">
                    <div className="ad-page-avatar">
                        {getInitials(ad.page_name)}
                    </div>
                    <div>
                        <div className="ad-page-name">{ad.page_name || 'Unknown Page'}</div>
                        {ad.page_id && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                ID: {ad.page_id}
                            </div>
                        )}
                    </div>
                </div>
                <span className={`ad-status ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Active' : 'Ended'}
                </span>
            </div>

            {linkTitle && (
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {linkTitle}
                </div>
            )}

            {body && (
                <div className="ad-body">{body}</div>
            )}

            <div className="ad-meta">
                {ad.ad_delivery_start_time && (
                    <span className="ad-meta-item">
                        <span className="meta-icon">📅</span>
                        {formatDate(ad.ad_delivery_start_time)}
                    </span>
                )}
                {ad.ad_delivery_stop_time && (
                    <span className="ad-meta-item">
                        <span className="meta-icon">🏁</span>
                        {formatDate(ad.ad_delivery_stop_time)}
                    </span>
                )}
                {ad.spend && (
                    <span className="ad-meta-item">
                        <span className="meta-icon">💰</span>
                        {typeof ad.spend === 'object'
                            ? `${ad.spend.lower_bound || '?'} – ${ad.spend.upper_bound || '?'}`
                            : ad.spend}
                    </span>
                )}
                {ad.impressions && (
                    <span className="ad-meta-item">
                        <span className="meta-icon">👁️</span>
                        {typeof ad.impressions === 'object'
                            ? `${ad.impressions.lower_bound || '?'} – ${ad.impressions.upper_bound || '?'}`
                            : ad.impressions}
                    </span>
                )}
                {ad.languages && ad.languages.length > 0 && (
                    <span className="ad-meta-item">
                        <span className="meta-icon">🌐</span>
                        {ad.languages.join(', ')}
                    </span>
                )}
            </div>

            <div className="ad-card-footer">
                <div className="ad-platforms">
                    {platforms.map(p => (
                        <span key={p} className="platform-badge">{p}</span>
                    ))}
                </div>
                {ad.ad_snapshot_url && (
                    <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer" className="ad-snapshot-link">
                        View Snapshot →
                    </a>
                )}
            </div>
        </div>
    )
}

const AdTableRow = ({ ad }) => {
    const body = Array.isArray(ad.ad_creative_bodies)
        ? ad.ad_creative_bodies[0]
        : ad.ad_creative_bodies || ad.ad_creative_body || ''

    return (
        <tr>
            <td>{ad.page_name || '—'}</td>
            <td title={body}>{body ? body.substring(0, 80) + (body.length > 80 ? '…' : '') : '—'}</td>
            <td>{formatDate(ad.ad_delivery_start_time)}</td>
            <td>{formatDate(ad.ad_delivery_stop_time)}</td>
            <td>
                {(ad.publisher_platforms || []).map(p => (
                    <span key={p} className="platform-badge" style={{ marginRight: '4px' }}>{p}</span>
                ))}
            </td>
            <td>
                {ad.spend ? (
                    typeof ad.spend === 'object'
                        ? `${ad.spend.lower_bound || '?'} – ${ad.spend.upper_bound || '?'}`
                        : ad.spend
                ) : '—'}
            </td>
            <td>
                {ad.ad_snapshot_url ? (
                    <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer" className="ad-snapshot-link">
                        View →
                    </a>
                ) : '—'}
            </td>
        </tr>
    )
}

const ResultsDisplay = ({ ads, view }) => {
    if (ads.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No Ads Found</h3>
                <p>Try adjusting your search parameters or broadening your filters.</p>
            </div>
        )
    }

    if (view === 'table') {
        return (
            <div className="results-table-wrapper">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Page Name</th>
                            <th>Ad Body</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Platforms</th>
                            <th>Spend</th>
                            <th>Snapshot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ads.map((ad, idx) => (
                            <AdTableRow key={ad.id || idx} ad={ad} />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="results-grid">
            {ads.map((ad, idx) => (
                <AdCard key={ad.id || idx} ad={ad} />
            ))}
        </div>
    )
}

export default ResultsDisplay
