
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

// Human-readable labels for field names
const FIELD_LABELS = {
    id: 'ID',
    ad_creation_time: 'Created',
    ad_creative_bodies: 'Ad Body',
    ad_creative_link_captions: 'Link Captions',
    ad_creative_link_descriptions: 'Link Descriptions',
    ad_creative_link_titles: 'Link Titles',
    ad_delivery_start_time: 'Start Date',
    ad_delivery_stop_time: 'End Date',
    ad_snapshot_url: 'Snapshot',
    bylines: 'Bylines',
    currency: 'Currency',
    delivery_by_region: 'Delivery by Region',
    demographic_distribution: 'Demographics',
    estimated_audience_size: 'Est. Audience',
    impressions: 'Impressions',
    languages: 'Languages',
    page_id: 'Page ID',
    page_name: 'Page Name',
    publisher_platforms: 'Platforms',
    spend: 'Spend',
    target_ages: 'Target Ages',
    target_gender: 'Target Gender',
    target_locations: 'Target Locations',
}

// Icons for meta items
const FIELD_ICONS = {
    ad_creation_time: '🕐',
    ad_delivery_start_time: '📅',
    ad_delivery_stop_time: '🏁',
    spend: '💰',
    impressions: '👁️',
    languages: '🌐',
    currency: '💱',
    estimated_audience_size: '👥',
    target_ages: '🎂',
    target_gender: '⚧',
    target_locations: '📍',
    bylines: '✍️',
    delivery_by_region: '🗺️',
    demographic_distribution: '📊',
}

// Format any field value for display
const formatFieldValue = (field, value) => {
    if (value === null || value === undefined) return '—'

    // Date fields
    if (field.includes('time') || field.includes('creation')) {
        return formatDate(value)
    }

    // Range objects (spend, impressions, estimated_audience_size)
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        if (value.lower_bound !== undefined || value.upper_bound !== undefined) {
            return `${value.lower_bound || '?'} – ${value.upper_bound || '?'}`
        }
        // For other objects, try JSON
        return JSON.stringify(value, null, 1)
    }

    // Arrays
    if (Array.isArray(value)) {
        if (value.length === 0) return '—'
        // If array of objects (demographic_distribution, delivery_by_region, target_locations)
        if (typeof value[0] === 'object') {
            return value.map(item => {
                if (item.region) return `${item.region}: ${item.percentage || '?'}%`
                if (item.age) return `${item.gender || ''} ${item.age}: ${item.percentage || '?'}%`
                if (item.country) return item.country
                if (item.name) return item.name
                return JSON.stringify(item)
            }).join(', ')
        }
        return value.join(', ')
    }

    // URLs — render as links
    if (typeof value === 'string' && value.startsWith('http')) {
        return value // will be rendered as link in JSX
    }

    return String(value)
}

// Fields that get special header/footer treatment in cards
const HEADER_FIELDS = ['page_name', 'page_id']
const SKIP_IN_META = ['id', 'page_name', 'page_id', 'ad_creative_bodies', 'ad_creative_link_titles',
    'ad_creative_link_captions', 'ad_creative_link_descriptions', 'publisher_platforms', 'ad_snapshot_url']

const AdCard = ({ ad, fields }) => {
    const body = Array.isArray(ad.ad_creative_bodies)
        ? ad.ad_creative_bodies[0]
        : ad.ad_creative_bodies || ad.ad_creative_body || ''

    const linkTitle = Array.isArray(ad.ad_creative_link_titles)
        ? ad.ad_creative_link_titles[0]
        : ad.ad_creative_link_titles || ad.ad_creative_link_title || ''

    const linkCaption = Array.isArray(ad.ad_creative_link_captions)
        ? ad.ad_creative_link_captions[0]
        : ad.ad_creative_link_captions || ''

    const linkDescription = Array.isArray(ad.ad_creative_link_descriptions)
        ? ad.ad_creative_link_descriptions[0]
        : ad.ad_creative_link_descriptions || ''

    const isActive = ad.ad_delivery_stop_time ? false : true
    const platforms = ad.publisher_platforms || []
    const showPlatforms = fields.includes('publisher_platforms')
    const showSnapshot = fields.includes('ad_snapshot_url')

    // Determine which fields to show in the meta/details area
    const metaFields = fields.filter(f => !SKIP_IN_META.includes(f) && ad[f] !== undefined && ad[f] !== null)

    return (
        <div className="ad-card">
            {/* Header — always show page info if selected */}
            {(fields.includes('page_name') || fields.includes('page_id')) && (
                <div className="ad-card-header">
                    <div className="ad-page-info">
                        <div className="ad-page-avatar">
                            {getInitials(ad.page_name)}
                        </div>
                        <div>
                            {fields.includes('page_name') && (
                                <div className="ad-page-name">{ad.page_name || 'Unknown Page'}</div>
                            )}
                            {fields.includes('page_id') && ad.page_id && (
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
            )}

            {/* Link title */}
            {fields.includes('ad_creative_link_titles') && linkTitle && (
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {linkTitle}
                </div>
            )}

            {/* Link caption */}
            {fields.includes('ad_creative_link_captions') && linkCaption && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {linkCaption}
                </div>
            )}

            {/* Ad body */}
            {fields.includes('ad_creative_bodies') && body && (
                <div className="ad-body">{body}</div>
            )}

            {/* Link description */}
            {fields.includes('ad_creative_link_descriptions') && linkDescription && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {linkDescription}
                </div>
            )}

            {/* Dynamic meta fields */}
            {metaFields.length > 0 && (
                <div className="ad-meta">
                    {metaFields.map(field => (
                        <span key={field} className="ad-meta-item">
                            <span className="meta-icon">{FIELD_ICONS[field] || '�'}</span>
                            <span className="meta-label">{FIELD_LABELS[field] || field}:</span>
                            {' '}
                            {formatFieldValue(field, ad[field])}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer with platforms + snapshot */}
            {(showPlatforms || showSnapshot) && (
                <div className="ad-card-footer">
                    <div className="ad-platforms">
                        {showPlatforms && platforms.map(p => (
                            <span key={p} className="platform-badge">{p}</span>
                        ))}
                    </div>
                    {showSnapshot && ad.ad_snapshot_url && (
                        <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer" className="ad-snapshot-btn">
                            View Snapshot ↗
                        </a>
                    )}
                </div>
            )}

            {/* Show ID at bottom if selected */}
            {fields.includes('id') && ad.id && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    ID: {ad.id}
                </div>
            )}
        </div>
    )
}

const AdTableRow = ({ ad, fields }) => {
    return (
        <tr>
            {fields.map(field => {
                const val = ad[field]
                // Special rendering for certain fields
                if (field === 'ad_snapshot_url') {
                    return (
                        <td key={field}>
                            {val ? (
                                <a href={val} target="_blank" rel="noopener noreferrer" className="ad-snapshot-link">
                                    View ↗
                                </a>
                            ) : '—'}
                        </td>
                    )
                }
                if (field === 'publisher_platforms') {
                    return (
                        <td key={field}>
                            {(val || []).map(p => (
                                <span key={p} className="platform-badge" style={{ marginRight: '4px' }}>{p}</span>
                            ))}
                            {(!val || val.length === 0) && '—'}
                        </td>
                    )
                }
                if (field === 'ad_creative_bodies') {
                    const body = Array.isArray(val) ? val[0] : val || ''
                    return (
                        <td key={field} title={body}>
                            {body ? body.substring(0, 80) + (body.length > 80 ? '…' : '') : '—'}
                        </td>
                    )
                }
                // Generic rendering
                return (
                    <td key={field} title={typeof formatFieldValue(field, val) === 'string' ? formatFieldValue(field, val) : ''}>
                        {formatFieldValue(field, val)}
                    </td>
                )
            })}
        </tr>
    )
}

const ResultsDisplay = ({ ads, view, fields = [] }) => {
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
                            {fields.map(field => (
                                <th key={field}>{FIELD_LABELS[field] || field}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ads.map((ad, idx) => (
                            <AdTableRow key={ad.id || idx} ad={ad} fields={fields} />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="results-grid">
            {ads.map((ad, idx) => (
                <AdCard key={ad.id || idx} ad={ad} fields={fields} />
            ))}
        </div>
    )
}

export default ResultsDisplay
