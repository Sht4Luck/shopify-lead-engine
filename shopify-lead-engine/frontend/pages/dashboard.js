import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [niche, setNiche] = useState('fashion');
  const [maxResults, setMaxResults] = useState(10);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: '' });
  const [filter, setFilter] = useState({ niche: 'all', minScore: 0 });
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    const savedEndpoint = localStorage.getItem('api_endpoint');
    if (savedKey) setApiKey(savedKey);
    if (savedEndpoint) setApiEndpoint(savedEndpoint);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('api_endpoint', apiEndpoint);
    setShowSettings(false);
    alert('Settings saved!');
  };

  const findLeads = async () => {
    if (!apiKey) {
      alert('Please add your OpenAI API key in settings');
      setShowSettings(true);
      return;
    }

    if (!apiEndpoint) {
      alert('Please add your API endpoint in settings');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setLeads([]);
    setProgress({ current: 0, total: 0, stage: 'Searching...' });

    try {
      // Step 1: Search for stores
      setProgress({ current: 0, total: maxResults, stage: 'Searching for stores...' });
      
      const searchResponse = await axios.post(`${apiEndpoint}/search-stores`, {
        niche,
        maxResults
      });

      const stores = searchResponse.data.stores;
      setProgress({ current: 0, total: stores.length, stage: 'Processing stores...' });

      // Step 2: Process each store
      const processedLeads = [];
      
      for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        
        try {
          setProgress({ 
            current: i + 1, 
            total: stores.length, 
            stage: `Processing ${store.url}...` 
          });

          // Scrape store
          const scrapeResponse = await axios.post(`${apiEndpoint}/scrape-store`, {
            url: store.url
          });

          if (!scrapeResponse.data.isShopify) {
            continue;
          }

          const { contactInfo, storeContent } = scrapeResponse.data;

          // Analyze with AI
          const analysisResponse = await axios.post(`${apiEndpoint}/analyze-store`, {
            storeContent,
            apiKey
          });

          const analysis = analysisResponse.data.analysis;

          // Only add if in target niches
          if (['Fashion', 'Beauty', 'Supplements'].includes(analysis.niche)) {
            processedLeads.push({
              id: Date.now() + i,
              url: store.url,
              title: storeContent.title,
              niche: analysis.niche,
              score: analysis.qualityScore,
              scoreReason: analysis.qualityReason,
              email: contactInfo.email,
              contactPage: contactInfo.contactPage,
              instagram: contactInfo.instagram,
              hook: analysis.outreachHook,
              offer: analysis.outreachOffer,
              status: 'Not Contacted',
              timestamp: new Date().toISOString()
            });

            setLeads([...processedLeads]);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`Error processing ${store.url}:`, error.message);
        }
      }

      setProgress({ current: stores.length, total: stores.length, stage: 'Complete!' });
      
    } catch (error) {
      console.error('Search error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No leads to export');
      return;
    }

    const headers = [
      'URL', 'Title', 'Niche', 'Quality Score', 'Email', 
      'Contact Page', 'Instagram', 'Outreach Hook', 'Offer', 
      'Status', 'Timestamp'
    ];

    const rows = filteredLeads.map(lead => [
      lead.url,
      lead.title,
      lead.niche,
      lead.score,
      lead.email || '',
      lead.contactPage || '',
      lead.instagram || '',
      lead.hook,
      lead.offer,
      lead.status,
      lead.timestamp
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopify-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLeads = leads.filter(lead => {
    if (filter.niche !== 'all' && lead.niche !== filter.niche) return false;
    if (lead.score < filter.minScore) return false;
    return true;
  });

  const stats = {
    total: leads.length,
    avgScore: leads.length > 0 ? (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(1) : 0,
    withEmail: leads.filter(l => l.email).length,
    withInstagram: leads.filter(l => l.instagram).length
  };

  return (
    <>
      <Head>
        <title>Dashboard - Shopify Lead Engine</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Shopify Lead Engine
              </Link>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-secondary"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-primary">platform.openai.com</a>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">API Endpoint</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://your-site.netlify.app/.netlify/functions"
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your Netlify Functions URL (after deployment)
                  </p>
                </div>

                <button onClick={saveSettings} className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Search Controls */}
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">Find New Leads</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Niche</label>
                <select 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="input"
                  disabled={loading}
                >
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty & Skincare</option>
                  <option value="supplements">Supplements</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Results</label>
                <input
                  type="number"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="input"
                  disabled={loading}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={findLeads}
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Searching...' : '🔍 Find Leads'}
                </button>
              </div>
            </div>

            {loading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{progress.stage}</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {leads.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-secondary">{stats.avgScore}</div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.withEmail}</div>
                <div className="text-sm text-gray-600">With Email</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-pink-600">{stats.withInstagram}</div>
                <div className="text-sm text-gray-600">With Instagram</div>
              </div>
            </div>
          )}

          {/* Filters & Export */}
          {leads.length > 0 && (
            <div className="card mb-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Filter Niche</label>
                    <select
                      value={filter.niche}
                      onChange={(e) => setFilter({ ...filter, niche: e.target.value })}
                      className="input w-40"
                    >
                      <option value="all">All Niches</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Supplements">Supplements</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Min Score</label>
                    <input
                      type="number"
                      value={filter.minScore}
                      onChange={(e) => setFilter({ ...filter, minScore: parseFloat(e.target.value) })}
                      min="0"
                      max="10"
                      step="0.5"
                      className="input w-24"
                    />
                  </div>
                </div>

                <button onClick={exportToCSV} className="btn btn-secondary">
                  📥 Export CSV ({filteredLeads.length})
                </button>
              </div>
            </div>
          )}

          {/* Leads Table */}
          {filteredLeads.length > 0 ? (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niche</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outreach Hook</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <a 
                            href={lead.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {lead.title}
                          </a>
                          <div className="text-xs text-gray-500 mt-1">
                            {lead.url}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="badge badge-info">{lead.niche}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${
                              lead.score >= 7 ? 'text-green-600' : 
                              lead.score >= 5 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {lead.score}
                            </span>
                            <span className="text-gray-400 ml-1">/10</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {lead.scoreReason.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1 text-sm">
                            {lead.email && (
                              <div className="flex items-center text-gray-700">
                                <span className="mr-2">📧</span>
                                <a href={`mailto:${lead.email}`} className="hover:text-primary">
                                  {lead.email}
                                </a>
                              </div>
                            )}
                            {lead.contactPage && (
                              <div className="flex items-center text-gray-700">
                                <span className="mr-2">📄</span>
                                <a href={lead.contactPage} target="_blank" rel="noopener" className="hover:text-primary">
                                  Contact Page
                                </a>
                              </div>
                            )}
                            {lead.instagram && (
                              <div className="flex items-center text-gray-700">
                                <span className="mr-2">📷</span>
                                <a href={lead.instagram} target="_blank" rel="noopener" className="hover:text-primary">
                                  Instagram
                                </a>
                              </div>
                            )}
                            {!lead.email && !lead.contactPage && !lead.instagram && (
                              <span className="text-gray-400">No contact found</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700 mb-2">
                            "{lead.hook}"
                          </div>
                          <div className="text-xs text-gray-500">
                            Offer: {lead.offer}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className={`text-sm px-2 py-1 rounded ${
                              lead.status === 'Client' ? 'bg-green-100 text-green-800' :
                              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option>Not Contacted</option>
                            <option>Contacted</option>
                            <option>Client</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !loading && (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No leads yet. Click "Find Leads" to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
