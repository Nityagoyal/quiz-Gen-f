import React, { useState, useEffect } from 'react';

const QuantumFlipAgent = () => {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [trials, setTrials] = useState(10);
  const [stats, setStats] = useState(null);
  const [agentStatus, setAgentStatus] = useState('idle');

  const runQuantumAgent = async () => {
    setIsRunning(true);
    setAgentStatus('initializing');
    const token = localStorage.getItem('token');

    try {
      setAgentStatus('running_trials');
      
      const res = await fetch('http://localhost:8976/api/Routes/quantum-flip', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trials: trials,
          privacyMode: true 
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to run quantum agent: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.data);
      setAgentStatus('completed');
      
      // Fetch updated statistics
      await fetchQuantumStats();
      
    } catch (error) {
      console.error('Quantum agent error:', error);
      setResult({ error: error.message });
      setAgentStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const fetchQuantumStats = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:8976/api/Routes/quantum-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchQuantumStats();
  }, []);

  const getStatusDisplay = () => {
    switch (agentStatus) {
      case 'initializing': return '🔄 Initializing quantum circuit...';
      case 'running_trials': return '⚛️ Running autonomous trials...';
      case 'completed': return '✅ Quantum trials completed';
      case 'error': return '❌ Agent encountered an error';
      default: return '🤖 Agent ready';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2 text-center text-purple-800">
          🔬 Quantum Coin Flip Agent
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Privacy-preserving quantum randomness with autonomous trial management
        </p>

        {/* Agent Status */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Agent Status</h3>
          <p className="text-sm">{getStatusDisplay()}</p>
        </div>

        {/* Trial Configuration */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Number of Autonomous Trials (1-100)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={trials}
            onChange={(e) => setTrials(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isRunning}
          />
        </div>

        {/* Run Agent Button */}
        <button
          onClick={runQuantumAgent}
          disabled={isRunning}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
          }`}
        >
          {isRunning ? 'Running Quantum Agent...' : '🚀 Launch Quantum Agent'}
        </button>

        {/* Results Display */}
        {result && !result.error && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Quantum Results</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Batch ID:</strong> {result.batchId?.substring(0, 8)}...
              </div>
              <div>
                <strong>Trials Completed:</strong> {result.trials}
              </div>
              <div>
                <strong>Quantum:</strong> {result.quantum ? '⚛️ Yes' : '🎲 Classical'}
              </div>
              <div>
                <strong>Last Result:</strong> {result.lastResult}
              </div>
            </div>
            
            {result.statistics && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <h4 className="font-medium mb-2">Privacy-Preserved Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Heads: ~{Math.round(result.statistics.headsCount)}</div>
                  <div>Tails: ~{Math.round(result.statistics.tailsCount)}</div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  * Statistics include differential privacy noise
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {result?.error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{result.error}</p>
          </div>
        )}

        {/* Global Statistics */}
        {stats && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Privacy-Preserved Global Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Total Quantum Flips:</strong><br />
                ~{Math.round(stats.totalFlips)}
              </div>
              <div>
                <strong>Heads Percentage:</strong><br />
                ~{stats.headsPercentage?.toFixed(1)}%
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600">
                <strong>Quantum Advantage:</strong> {stats.quantumAdvantage}
              </p>
              <p className="text-xs text-blue-600">
                <strong>Privacy Level:</strong> {stats.privacyLevel}
              </p>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🔒 Privacy Protection</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Individual trials are pseudonymized</li>
            <li>• Statistics include differential privacy noise</li>
            <li>• No direct user identification in stored data</li>
            <li>• Quantum randomness ensures unpredictability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuantumFlipAgent;
