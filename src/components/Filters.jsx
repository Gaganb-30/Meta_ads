import { useState, useMemo } from 'react'

const Filters = ({ ads, onFilter, view, onViewChange, totalCount }) => {
    const [textFilter, setTextFilter] = useState('')
    const [platformFilter, setPlatformFilter] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    // Extract unique platforms from results
    const platforms = useMemo(() => {
        const set = new Set()
        ads.forEach(ad => {
            (ad.publisher_platforms || []).forEach(p => set.add(p))
        })
        return Array.from(set)
    }, [ads])

    const applyFilters = (text, platform, sort) => {
        let filtered = [...ads]

        // Text filter
        if (text) {
            const q = text.toLowerCase()
            filtered = filtered.filter(ad => {
                const body = Array.isArray(ad.ad_creative_bodies)
                    ? ad.ad_creative_bodies[0]
                    : ad.ad_creative_bodies || ad.ad_creative_body || ''
                const pageName = ad.page_name || ''
                const linkTitle = Array.isArray(ad.ad_creative_link_titles)
                    ? ad.ad_creative_link_titles[0]
                    : ad.ad_creative_link_titles || ''
                return body.toLowerCase().includes(q) ||
                    pageName.toLowerCase().includes(q) ||
                    linkTitle.toLowerCase().includes(q)
            })
        }

        // Platform filter
        if (platform) {
            filtered = filtered.filter(ad =>
                (ad.publisher_platforms || []).includes(platform)
            )
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sort) {
                case 'newest':
                    return new Date(b.ad_delivery_start_time || 0) - new Date(a.ad_delivery_start_time || 0)
                case 'oldest':
                    return new Date(a.ad_delivery_start_time || 0) - new Date(b.ad_delivery_start_time || 0)
                case 'page_name':
                    return (a.page_name || '').localeCompare(b.page_name || '')
                default:
                    return 0
            }
        })

        onFilter(filtered)
    }

    const handleTextChange = (val) => {
        setTextFilter(val)
        applyFilters(val, platformFilter, sortBy)
    }

    const handlePlatformChange = (val) => {
        setPlatformFilter(val)
        applyFilters(textFilter, val, sortBy)
    }

    const handleSortChange = (val) => {
        setSortBy(val)
        applyFilters(textFilter, platformFilter, val)
    }

    return (
        <>
            <div className="results-header">
                <div className="results-count">
                    Showing <strong>{totalCount}</strong> ads
                </div>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="input-field"
                    placeholder="🔎 Filter results by name, text..."
                    value={textFilter}
                    onChange={(e) => handleTextChange(e.target.value)}
                />

                <div className="filter-group">
                    <span className="filter-label">Platform:</span>
                    <select
                        className="input-field sort-select"
                        value={platformFilter}
                        onChange={(e) => handlePlatformChange(e.target.value)}
                    >
                        <option value="">All</option>
                        {platforms.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Sort:</span>
                    <select
                        className="input-field sort-select"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="page_name">Page Name</option>
                    </select>
                </div>

                <div className="view-toggle">
                    <button
                        className={view === 'cards' ? 'active' : ''}
                        onClick={() => onViewChange('cards')}
                    >
                        ▦ Cards
                    </button>
                    <button
                        className={view === 'table' ? 'active' : ''}
                        onClick={() => onViewChange('table')}
                    >
                        ☰ Table
                    </button>
                </div>
            </div>
        </>
    )
}

export default Filters
