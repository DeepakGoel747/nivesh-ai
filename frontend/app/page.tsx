'use client';

import { useState, useEffect } from 'react';
import { stocksAPI } from '@/lib/api';
import Link from 'next/link';
import type { Stock } from '@/lib/api';
import { TrendingUp, Search, BarChart3 } from 'lucide-react';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await stocksAPI.getAll(0, 50);
      setStocks(data);
    } catch (error) {
      console.error('Error loading stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Nivesh AI
              </h1>
            </div>
            <div className="text-sm text-slate-400">
              AI-Powered Market Intelligence
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Predict Stock Movements with AI
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get next-day and next-week predictions for Indian stocks powered by machine learning
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stocks by ticker or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Available Stocks</p>
                <p className="text-3xl font-bold text-white mt-1">{stocks.length}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-emerald-500 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Model Accuracy</p>
                <p className="text-3xl font-bold text-white mt-1">68%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-cyan-500 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Predictions Today</p>
                <p className="text-3xl font-bold text-white mt-1">{stocks.length * 2}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Stock Predictions</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400">Loading stocks...</p>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p>No stocks found. Try a different search term.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredStocks.map((stock) => (
                <Link
                  key={stock.id}
                  href={`/stocks/${stock.ticker}`}
                  className="block p-6 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{stock.ticker}</h4>
                      <p className="text-slate-400 text-sm mt-1">{stock.name}</p>
                      {stock.sector && (
                        <p className="text-slate-500 text-xs mt-1">{stock.sector}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-500 text-sm">View Predictions →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Predictions are for educational purposes only. Not financial advice.</p>
        </div>
      </main>
    </div>
  );
}
