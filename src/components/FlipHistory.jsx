import React from 'react';

const FlipHistory = ({ 
  history, 
  loading, 
  onRefresh, 
  formatTimestamp 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="mt-2 text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🎲</div>
        <p>No flip history yet!</p>
        <p className="text-sm">Start flipping coins to see your history here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Flip History</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
        >
          {loading ? '🔄' : '🔄 Refresh'}
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((flip, index) => (
          <div
            key={flip._id || index}
            className="flex justify-between items-center bg-white p-3 rounded border"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {flip.result === 'Heads' ? '👑' : '⚪'}
              </span>
              <div>
                <span className={`font-semibold ${
                  flip.result === 'Heads' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {flip.result}
                </span>
                {flip.quantum && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                    ⚛️ Quantum
                  </span>
                )}
                {flip.privacyPreserved && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    🔒 Private
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{formatTimestamp(flip.timestamp)}</div>
              {flip.batchId && (
                <div className="text-xs">Batch: {flip.batchId.substring(0, 8)}...</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlipHistory;
