// // src/components/Home.jsx
// import React, { useState, useEffect } from 'react';

// const Home = () => {
//   const [result, setResult] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [flipHistory, setFlipHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(false);

//   // Logout function
//   const handleLogout = () => {
//     // Clear all stored tokens
//     localStorage.clear();
    
//     // Redirect to login/home page
//     window.location.href = '/';
//   };

//   // Get user profile from token on component mount with token expiration check
//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       try {
//         // Decode JWT payload to get user info
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const currentTime = Math.floor(Date.now() / 1000);
        
//         // Check if token is expired
//         if (payload.exp && payload.exp < currentTime) {
//           console.log('Token expired, redirecting to login...');
//           localStorage.clear();
//           window.location.href = '/';
//           return;
//         }
        
//         setUserProfile({
//           name: payload.name,
//           email: payload.email,
//           id: payload.id
//         });
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         localStorage.clear();
//         window.location.href = '/';
//       }
//     }
//   }, []);

//   // Enhanced fetchFlipHistory with debugging
//   const fetchFlipHistory = async () => {
//     setHistoryLoading(true);
//     const token = localStorage.getItem('token');

//     try {
//       // Decode token to see user info
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       console.log('🔍 Fetching history for user:', payload.id, payload.name);
      
//       const res = await fetch('http://localhost:8976/api/Routes/history', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log('📊 History response:', data);
//         console.log(`✅ Loaded ${data.data?.length || 0} flips for user ${data.userId}`);
//         setFlipHistory(data.data || []);
//       } else {
//         console.error('Failed to fetch history:', res.status);
//       }
//     } catch (error) {
//       console.error('Error fetching history:', error);
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   // Handle regular coin flip
//   const handleFlip = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
    
//     const flipResult = Math.random() < 0.5 ? "Heads" : "Tails";

//     try {
//       const res = await fetch('http://localhost:8976/api/Routes/flip', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ result: flipResult })
//       });

//       if (res.ok) {
//         setResult(flipResult);
//         // Refresh history after new flip
//         if (showHistory) {
//           fetchFlipHistory();
//         }
//       } else {
//         setResult('Error flipping the coin');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setResult('Error flipping the coin');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle quantum coin flip
//   const handleQuantumFlip = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');

//     try {
//       const res = await fetch('http://localhost:8976/api/Routes/quantum-flip', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           trials: 1,
//           privacyMode: true 
//         })
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setResult(data.data.lastResult);
//         // Refresh history after new flip
//         if (showHistory) {
//           fetchFlipHistory();
//         }
//       } else {
//         setResult('Error with quantum flip');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setResult('Error with quantum flip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle history display
//   const toggleHistory = () => {
//     setShowHistory(!showHistory);
//     if (!showHistory) {
//       fetchFlipHistory();
//     }
//   };

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     return new Date(timestamp).toLocaleString();
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
//         {/* Header with user profile and logout button */}
//         {userProfile && (
//           <div className="bg-blue-50 rounded-lg p-4 mb-6 flex justify-between items-center">
//             <div>
//               <h2 className="text-lg font-semibold text-blue-800">Welcome back!</h2>
//               <p className="text-blue-600">{userProfile.name} ({userProfile.email})</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               🚪 Logout
//             </button>
//           </div>
//         )}

//         <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Quantum Coin Flip</h1>

//         {/* Coin flip buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <button
//             onClick={handleFlip}
//             disabled={loading}
//             className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
//             }`}
//           >
//             {loading ? 'Flipping...' : '🎲 Classical Flip'}
//           </button>

//           <button
//             onClick={handleQuantumFlip}
//             disabled={loading}
//             className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
//             }`}
//           >
//             {loading ? 'Computing...' : '⚛️ Quantum Flip'}
//           </button>
//         </div>

//         {/* Result display */}
//         {result && (
//           <div className="text-center mb-6">
//             <div className={`inline-block px-6 py-3 rounded-lg text-xl font-bold ${
//               result.includes('Error') 
//                 ? 'bg-red-100 text-red-800' 
//                 : 'bg-yellow-100 text-yellow-800'
//             }`}>
//               {result.includes('Error') ? result : `You got: ${result}`}
//             </div>
//           </div>
//         )}

//         {/* History toggle button */}
//         <div className="text-center mb-6">
//           <button
//             onClick={toggleHistory}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             {showHistory ? '🔒 Hide History' : '📊 Show Flip History'}
//           </button>
//         </div>

//         {/* History display */}
//         {showHistory && (
//           <div className="bg-gray-50 rounded-lg p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">Your Flip History</h3>
//               <button
//                 onClick={fetchFlipHistory}
//                 disabled={historyLoading}
//                 className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
//               >
//                 {historyLoading ? '🔄' : '🔄 Refresh'}
//               </button>
//             </div>

//             {historyLoading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin text-2xl">⏳</div>
//                 <p className="mt-2 text-gray-600">Loading history...</p>
//               </div>
//             ) : flipHistory.length > 0 ? (
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {flipHistory.map((flip, index) => (
//                   <div
//                     key={flip._id || index}
//                     className="flex justify-between items-center bg-white p-3 rounded border"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <span className="text-2xl">
//                         {flip.result === 'Heads' ? '👑' : '⚪'}
//                       </span>
//                       <div>
//                         <span className={`font-semibold ${
//                           flip.result === 'Heads' ? 'text-yellow-600' : 'text-gray-600'
//                         }`}>
//                           {flip.result}
//                         </span>
//                         {flip.quantum && (
//                           <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
//                             ⚛️ Quantum
//                           </span>
//                         )}
//                         {flip.privacyPreserved && (
//                           <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
//                             🔒 Private
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right text-sm text-gray-500">
//                       <div>{formatTimestamp(flip.timestamp)}</div>
//                       {flip.batchId && (
//                         <div className="text-xs">Batch: {flip.batchId.substring(0, 8)}...</div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <div className="text-4xl mb-2">🎲</div>
//                 <p>No flip history yet!</p>
//                 <p className="text-sm">Start flipping coins to see your history here.</p>
//               </div>
//             )}

//             {/* History statistics */}
//             {flipHistory.length > 0 && (
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <h4 className="font-semibold mb-3">📊 Statistics</h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//                   <div className="bg-white p-3 rounded">
//                     <div className="text-2xl font-bold text-blue-600">
//                       {flipHistory.length}
//                     </div>
//                     <div className="text-sm text-gray-600">Total Flips</div>
//                   </div>
//                   <div className="bg-white p-3 rounded">
//                     <div className="text-2xl font-bold text-yellow-600">
//                       {flipHistory.filter(f => f.result === 'Heads').length}
//                     </div>
//                     <div className="text-sm text-gray-600">Heads</div>
//                   </div>
//                   <div className="bg-white p-3 rounded">
//                     <div className="text-2xl font-bold text-gray-600">
//                       {flipHistory.filter(f => f.result === 'Tails').length}
//                     </div>
//                     <div className="text-sm text-gray-600">Tails</div>
//                   </div>
//                   <div className="bg-white p-3 rounded">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {flipHistory.filter(f => f.quantum).length}
//                     </div>
//                     <div className="text-sm text-gray-600">Quantum</div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Footer */}
//         <div className="text-center mt-6 text-sm text-gray-500">
//           <p>🔒 Your data is privacy-preserved with pseudonymization</p>
//           <p>⚛️ Quantum flips use real Hadamard gate superposition</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import config from '../Config';

const Home = () => {
  const [result, setResult] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [flipHistory, setFlipHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Logout function
  const handleLogout = () => {
    // Clear all stored tokens
    localStorage.clear();
    
    // Redirect to login/home page
    window.location.href = '/';
  };

  // Get user profile from token on component mount with token expiration check
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode JWT payload to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
          console.log('Token expired, redirecting to login...');
          localStorage.clear();
          window.location.href = '/';
          return;
        }
        
        setUserProfile({
          name: payload.name,
          email: payload.email,
          id: payload.id
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.clear();
        window.location.href = '/';
      }
    }
  }, []);

  // Enhanced fetchFlipHistory with debugging
  const fetchFlipHistory = async () => {
    setHistoryLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Decode token to see user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Fetching history for user:', payload.id, payload.name);
      
      const res = await fetch(`${config.API_BASE_URL}/api/Routes/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('📊 History response:', data);
        console.log(`✅ Loaded ${data.data?.length || 0} flips for user ${data.userId}`);
        setFlipHistory(data.data || []);
      } else {
        console.error('Failed to fetch history:', res.status);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle regular coin flip
  const handleFlip = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const flipResult = Math.random() < 0.5 ? "Heads" : "Tails";

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/Routes/flip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result: flipResult })
      });

      if (res.ok) {
        setResult(flipResult);
        // Refresh history after new flip
        if (showHistory) {
          fetchFlipHistory();
        }
      } else {
        setResult('Error flipping the coin');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Error flipping the coin');
    } finally {
      setLoading(false);
    }
  };

  // Handle quantum coin flip
  const handleQuantumFlip = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/Routes/quantum-flip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trials: 1,
          privacyMode: true 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.data.lastResult);
        // Refresh history after new flip
        if (showHistory) {
          fetchFlipHistory();
        }
      } else {
        setResult('Error with quantum flip');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Error with quantum flip');
    } finally {
      setLoading(false);
    }
  };

  // Toggle history display
  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      fetchFlipHistory();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        {/* Header with user profile and logout button */}
        {userProfile && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Welcome back!</h2>
              <p className="text-blue-600">{userProfile.name} ({userProfile.email})</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              🚪 Logout
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Quantum Coin Flip</h1>

        {/* Coin flip buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleFlip}
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
            }`}
          >
            {loading ? 'Flipping...' : '🎲 Classical Flip'}
          </button>

          <button
            onClick={handleQuantumFlip}
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
            }`}
          >
            {loading ? 'Computing...' : '⚛️ Quantum Flip'}
          </button>
        </div>

        {/* Result display */}
        {result && (
          <div className="text-center mb-6">
            <div className={`inline-block px-6 py-3 rounded-lg text-xl font-bold ${
              result.includes('Error') 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {result.includes('Error') ? result : `You got: ${result}`}
            </div>
          </div>
        )}

        {/* History toggle button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleHistory}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showHistory ? '🔒 Hide History' : '📊 Show Flip History'}
          </button>
        </div>

        {/* History display */}
        {showHistory && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Flip History</h3>
              <button
                onClick={fetchFlipHistory}
                disabled={historyLoading}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {historyLoading ? '🔄' : '🔄 Refresh'}
              </button>
            </div>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="mt-2 text-gray-600">Loading history...</p>
              </div>
            ) : flipHistory.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {flipHistory.map((flip, index) => (
                  <div
                    key={flip._id || index}
                    className="flex justify-between items-center bg-white p-3 rounded border hover:shadow-sm transition-shadow"
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎲</div>
                <p>No flip history yet!</p>
                <p className="text-sm">Start flipping coins to see your history here.</p>
              </div>
            )}

            {/* History statistics */}
            {flipHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">📊 Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                      {flipHistory.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Flips</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600">
                      {flipHistory.filter(f => f.result === 'Heads').length}
                    </div>
                    <div className="text-sm text-gray-600">Heads</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-2xl font-bold text-gray-600">
                      {flipHistory.filter(f => f.result === 'Tails').length}
                    </div>
                    <div className="text-sm text-gray-600">Tails</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">
                      {flipHistory.filter(f => f.quantum).length}
                    </div>
                    <div className="text-sm text-gray-600">Quantum</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>🔒 Your data is privacy-preserved with pseudonymization</p>
          <p>⚛️ Quantum flips use real Hadamard gate superposition</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
