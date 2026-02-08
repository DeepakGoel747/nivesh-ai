'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { stocksAPI, predictionsAPI, type StockDetail, type PredictionSummary, type PriceData } from '@/lib/api';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import StockChart from '@/components/StockChart';
import PredictionPanel from '@/components/PredictionPanel';

export default function StockPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;

  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [predictions, setPredictions] = useState<PredictionSummary | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStockData();
  }, [ticker]);

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stock details
      const detail = await stocksAPI.getDetail(ticker);
      setStockDetail(detail);

      // Load predictions
      try {
        const preds = await predictionsAPI.get(ticker);
        setPredictions(preds);
      } catch (predError) {
        console.log('No predictions yet for', ticker);
      }

      // Load price history
      const history = await stocksAPI.getHistory(ticker, 180);
      setPriceHistory(history);

    } catch (err: any) {
      console.error('Error loading stock data:', err);
      setError(err.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      await predictionsAPI.generate(ticker);
      // Reload predictions
      const preds = await predictionsAPI.get(ticker);
      setPredictions(preds);
    } catch (err) {
      console.error('Error generating prediction:', err);
      alert('Failed to generate prediction. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error || !stockDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Stock</h2>
          <p className="text-slate-400 mb-4">{error || 'Stock not found'}</p>
          <Link href="/" className="text-emerald-500 hover:text-emerald-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{stockDetail.stock.ticker}</h1>
              <p className="text-slate-400 text-sm">{stockDetail.stock.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Price Info */}
        {stockDetail.latest_price && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-400 text-sm">Current Price</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ₹{stockDetail.latest_price.close.toFixed(2)}
                </p>
              </div>

              {stockDetail.price_change_1d !== null && (
                <div>
                  <p className="text-slate-400 text-sm">1 Day Change</p>
                  <div className="flex items-center mt-1">
                    {stockDetail.price_change_1d > 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <p className={`text-2xl font-bold ${stockDetail.price_change_1d > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stockDetail.price_change_1d > 0 ? '+' : ''}{stockDetail.price_change_1d.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}

              {stockDetail.price_change_5d !== null && (
                <div>
                  <p className="text-slate-400 text-sm">5 Day Change</p>
                  <p className={`text-2xl font-bold mt-1 ${stockDetail.price_change_5d > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stockDetail.price_change_5d > 0 ? '+' : ''}{stockDetail.price_change_5d.toFixed(2)}%
                  </p>
                </div>
              )}

              {stockDetail.price_change_20d !== null && (
                <div>
                  <p className="text-slate-400 text-sm">20 Day Change</p>
                  <p className={`text-2xl font-bold mt-1 ${stockDetail.price_change_20d > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stockDetail.price_change_20d > 0 ? '+' : ''}{stockDetail.price_change_20d.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chart */}
        {priceHistory.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Price History</h2>
            <StockChart data={priceHistory} />
          </div>
        )}

        {/* Predictions */}
        {predictions ? (
          <PredictionPanel predictions={predictions} currentPrice={stockDetail.latest_price?.close || 0} />
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
            <p className="text-slate-400 mb-4">No predictions available for this stock yet.</p>
            <button
              onClick={handleGeneratePrediction}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Generate Predictions
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
