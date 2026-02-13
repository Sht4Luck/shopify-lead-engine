import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Shopify Lead Engine - Find & Qualify Shopify Stores</title>
        <meta name="description" content="Ethical lead generation for copywriters targeting Shopify stores" />
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">Shopify Lead Engine</h1>
              <Link href="/dashboard" className="btn btn-primary">
                Launch Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Find High-Quality Shopify Leads
                <span className="block text-primary mt-2">In Minutes, Not Hours</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered lead generation for copywriters. Discover Shopify stores in Fashion, Beauty, 
                and Supplements that need better product copy.
              </p>
              <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-3 inline-block">
                Start Finding Leads
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">1. Discover Stores</h4>
                <p className="text-gray-600">
                  Automatically find Shopify stores in your target niches using ethical web search.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">2. AI Analysis</h4>
                <p className="text-gray-600">
                  Get quality scores and personalized outreach hooks based on each store's copy weaknesses.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">3. Export & Reach Out</h4>
                <p className="text-gray-600">
                  Download leads as CSV or push to Google Sheets. Reach out manually with personalized pitches.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Built for Ethical Growth</h3>
                <ul className="space-y-4">
                  {[
                    'No spam automation - manual outreach only',
                    'Public data only - fully compliant',
                    'AI-powered niche classification',
                    'Quality scoring (1-10 scale)',
                    'Contact info extraction',
                    'Instagram discovery',
                    'Personalized outreach hooks',
                    'CSV & Google Sheets export'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-6 h-6 text-secondary mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card bg-white">
                <h4 className="text-xl font-semibold mb-4">Perfect For</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">Freelance Copywriters</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">Marketing Agencies</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">Solo Entrepreneurs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">Growth Hackers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Build Your Pipeline?</h3>
            <p className="text-xl text-gray-600 mb-8">
              Start discovering qualified Shopify leads in your niche today.
            </p>
            <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-3 inline-block">
              Open Dashboard
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="mb-2">Shopify Lead Engine - Ethical lead generation for growth-focused professionals</p>
            <p className="text-sm">
              This tool is for manual outreach only. Automated spam is prohibited.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
