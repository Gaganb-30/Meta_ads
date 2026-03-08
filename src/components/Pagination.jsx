const Pagination = ({ hasMore, loading, onLoadMore, loadedCount }) => {
    if (!hasMore && loadedCount === 0) return null

    return (
        <div className="pagination-section">
            <span className="pagination-info">
                {loadedCount} ads loaded
            </span>
            {hasMore && (
                <button
                    className="btn btn-secondary"
                    onClick={onLoadMore}
                    disabled={loading}
                >
                    {loading ? '⏳ Loading More...' : '📥 Load More'}
                </button>
            )}
            {!hasMore && loadedCount > 0 && (
                <span className="pagination-info" style={{ color: 'var(--text-muted)' }}>
                    — End of results —
                </span>
            )}
        </div>
    )
}

export default Pagination
