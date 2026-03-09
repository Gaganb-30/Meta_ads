import { useState } from 'react'

const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IN', name: 'India' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'JP', name: 'Japan' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'PL', name: 'Poland' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'UAE' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'PH', name: 'Philippines' },
]

const AVAILABLE_FIELDS = [
    'id',
    'ad_creation_time',
    'ad_creative_bodies',
    'ad_creative_link_captions',
    'ad_creative_link_descriptions',
    'ad_creative_link_titles',
    'ad_delivery_start_time',
    'ad_delivery_stop_time',
    'ad_snapshot_url',
    'bylines',
    'currency',
    'delivery_by_region',
    'demographic_distribution',
    'estimated_audience_size',
    'impressions',
    'languages',
    'page_id',
    'page_name',
    'publisher_platforms',
    'spend',
    'target_ages',
    'target_gender',
    'target_locations',
]

const AD_TYPES = [
    { value: 'ALL', label: 'All Ads' },
    { value: 'POLITICAL_AND_ISSUE_ADS', label: 'Political & Issue Ads' },
    { value: 'CREDIT_ADS', label: 'Credit Ads' },
    { value: 'EMPLOYMENT_ADS', label: 'Employment Ads' },
    { value: 'HOUSING_ADS', label: 'Housing Ads' },
    { value: 'FINANCIAL_PRODUCTS_AND_SERVICES_ADS', label: 'Financial Products' },
]

const AD_STATUS = [
    { value: 'ALL', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

const DEFAULT_FIELDS = [
    'id', 'page_name', 'page_id', 'ad_creative_bodies',
    'ad_delivery_start_time', 'ad_delivery_stop_time',
    'ad_snapshot_url', 'publisher_platforms', 'spend', 'impressions'
]

const SearchPanel = ({ onSearch, loading }) => {
    const [params, setParams] = useState({
        search_terms: '',
        ad_type: 'ALL',
        ad_active_status: 'ALL',
        ad_delivery_date_min: '',
        ad_delivery_date_max: '',
        search_page_ids: '',
        limit: 25,
    })
    const [selectedCountries, setSelectedCountries] = useState([])
    const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS)
    const [countryInput, setCountryInput] = useState('')
    const [showAllFields, setShowAllFields] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const handleChange = (field, value) => {
        setParams(prev => ({ ...prev, [field]: value }))
    }

    const toggleField = (field) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        )
    }

    const addCountry = (code) => {
        if (code && !selectedCountries.includes(code)) {
            setSelectedCountries(prev => [...prev, code])
        }
        setCountryInput('')
    }

    const removeCountry = (code) => {
        setSelectedCountries(prev => prev.filter(c => c !== code))
    }

    const handleSubmit = () => {
        const queryParams = { ...params }

        if (selectedCountries.length > 0) {
            queryParams.ad_reached_countries = selectedCountries
        }

        if (selectedFields.length > 0) {
            queryParams.fields = selectedFields.join(',')
        }

        // Clean empty values
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === '' || queryParams[key] === undefined) {
                delete queryParams[key]
            }
        })

        onSearch(queryParams, selectedFields)
    }

    const handleReset = () => {
        setParams({
            search_terms: '',
            ad_type: 'ALL',
            ad_active_status: 'ALL',
            ad_delivery_date_min: '',
            ad_delivery_date_max: '',
            search_page_ids: '',
            limit: 25,
        })
        setSelectedCountries([])
        setSelectedFields(DEFAULT_FIELDS)
    }

    const filteredCountries = COUNTRIES.filter(c =>
        !selectedCountries.includes(c.code) &&
        (c.name.toLowerCase().includes(countryInput.toLowerCase()) || c.code.toLowerCase().includes(countryInput.toLowerCase()))
    )

    return (
        <div className="search-panel">
            <div className="search-panel-header">
                <div className="collapsible-header" onClick={() => setCollapsed(!collapsed)} style={{ flex: 1 }}>
                    <span className="search-panel-title">
                        🔍 Search Parameters
                    </span>
                    <span className={`collapsible-arrow ${!collapsed ? 'open' : ''}`}>▼</span>
                </div>
            </div>

            {!collapsed && (
                <>
                    {/* Main Parameters Grid */}
                    <div className="param-grid">
                        <div className="input-group">
                            <label className="input-label">Search Terms</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. shoes, coffee, AI..."
                                value={params.search_terms}
                                onChange={(e) => handleChange('search_terms', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Ad Type</label>
                            <select
                                className="input-field"
                                value={params.ad_type}
                                onChange={(e) => handleChange('ad_type', e.target.value)}
                            >
                                {AD_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Ad Status</label>
                            <select
                                className="input-field"
                                value={params.ad_active_status}
                                onChange={(e) => handleChange('ad_active_status', e.target.value)}
                            >
                                {AD_STATUS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Delivery Date From</label>
                            <input
                                type="date"
                                className="input-field"
                                value={params.ad_delivery_date_min}
                                onChange={(e) => handleChange('ad_delivery_date_min', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Delivery Date To</label>
                            <input
                                type="date"
                                className="input-field"
                                value={params.ad_delivery_date_max}
                                onChange={(e) => handleChange('ad_delivery_date_max', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Page IDs (comma-separated)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. 123456789,987654321"
                                value={params.search_page_ids}
                                onChange={(e) => handleChange('search_page_ids', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Limit (1–500)</label>
                            <input
                                type="number"
                                className="input-field"
                                min="1"
                                max="500"
                                value={params.limit}
                                onChange={(e) => handleChange('limit', Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                            />
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label className="input-label">Reached Countries</label>
                        <div className="country-selector">
                            {selectedCountries.length > 0 && (
                                <div className="country-chips">
                                    {selectedCountries.map(code => {
                                        const country = COUNTRIES.find(c => c.code === code)
                                        return (
                                            <span key={code} className="chip active">
                                                {country ? country.name : code}
                                                <span className="chip-remove" onClick={() => removeCountry(code)}>×</span>
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                            <div className="country-input-row">
                                <select
                                    className="input-field"
                                    value={countryInput}
                                    onChange={(e) => {
                                        if (e.target.value) addCountry(e.target.value)
                                    }}
                                >
                                    <option value="">Select a country...</option>
                                    {filteredCountries.map(c => (
                                        <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="fields-section">
                        <div className="collapsible-header" onClick={() => setShowAllFields(!showAllFields)}>
                            <span className="fields-section-title" style={{ margin: 0 }}>
                                Response Fields ({selectedFields.length} selected)
                            </span>
                            <span className={`collapsible-arrow ${showAllFields ? 'open' : ''}`}>▼</span>
                        </div>
                        {showAllFields && (
                            <div className="fields-grid" style={{ marginTop: '12px' }}>
                                {AVAILABLE_FIELDS.map(field => (
                                    <label
                                        key={field}
                                        className={`field-checkbox ${selectedFields.includes(field) ? 'checked' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFields.includes(field)}
                                            onChange={() => toggleField(field)}
                                        />
                                        {field}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="search-actions">
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {selectedCountries.length > 0 && `${selectedCountries.length} countries · `}
                            {selectedFields.length} fields selected
                        </span>
                        <div className="search-actions-right">
                            <button className="btn btn-secondary" onClick={handleReset}>
                                ↺ Reset
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading || (!params.search_terms && !params.search_page_ids)}
                            >
                                {loading ? '⏳ Searching...' : '🔍 Search Ads'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SearchPanel
