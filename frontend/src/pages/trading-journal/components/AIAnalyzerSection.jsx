import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiAnalyzerService } from '../../../services/api/journal/aiAnalyzer.service';
import { Button } from '../../../components/trading-journal/Button';

const AIAnalyzerSection = ({ trades }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!trades || trades.length === 0) {
      setError("You don't have any trades to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiAnalyzerService.analyzeTrades(trades);
      if (response.data?.success) {
        setAnalysis(response.data.data);
      } else {
        setError("Failed to get analysis from AI.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred while contacting the AI."
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically run the analyzer when the component loads and trades are available
  useEffect(() => {
    if (trades && trades.length > 0 && !analysis && !loading && !error) {
      handleAnalyze();
    }
  }, [trades]);

  if (!trades || trades.length === 0) return null;

  return (
    <div className="bg-[#121212] border border-dark-border rounded-2xl overflow-hidden shadow-lg flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="text-blue-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Trade Analyzer</h2>
            <p className="text-xs text-gray-400">Powered by OpenRouter AI</p>
          </div>
        </div>
        {analysis && !loading && (
          <Button onClick={handleAnalyze} className="animatedBtn text-xs py-1 px-3">
            <Sparkles size={14} className="mr-1" />
            Refresh Analysis
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {loading && (
          <div className="text-center py-8 space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-r-2 border-purple-500 animate-spin-reverse"></div>
              <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={16} />
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Analyzing Trades...</h3>
              <p className="text-gray-400 text-xs mt-1">This might take a few moments</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <AlertCircle className="mx-auto text-red-400 mb-2" size={24} />
            <p className="text-red-400 text-sm">{error}</p>
            <Button variant="outline" className="mt-3 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleAnalyze}>
              Try Again
            </Button>
          </div>
        )}

        {analysis && !loading && (
          <div className="prose prose-sm prose-invert prose-blue max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyzerSection;
