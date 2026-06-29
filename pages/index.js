import dynamic from 'next/dynamic';
import { useState } from 'react';
import HistoryChart from '../components/HistoryChart';

// Disables Server-Side Rendering for the Leaflet map component
const MapWidget = dynamic(() => import('../components/MapWidget'), { ssr: false });

export default function Dashboard() {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (farmId) => {
    setSelectedFarm(farmId);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Connects to your live Render API or local backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/analyze/${farmId}`);
      const data = await res.json();
      
      // Simulate satellite processing delay for visual effect during the demo
      setTimeout(() => {
        setAnalysisResult(data);
        setIsAnalyzing(false);
      }, 1200); 
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  // UI Helpers for dynamic color coding
  const getStressColor = (level) => {
    if (level === 'High') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'Medium') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'Low') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 tracking-tight">AgriSense AI Dashboard</h1>
          <p className="text-gray-600 mt-2">Automated Crop Type, Moisture Stress & Irrigation Advisory System</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
              <MapWidget onFarmSelect={handleAnalyze} />
            </div>
            
            {/* Time-Series Visualization (Only show if a farm is selected) */}
            {selectedFarm && !isAnalyzing && analysisResult && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <HistoryChart farmId={selectedFarm} />
              </div>
            )}
          </div>

          {/* Right Column: Analysis Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-green-700 p-4">
              <h2 className="text-xl font-semibold text-white">Field Analysis Report</h2>
            </div>
            
            <div className="p-6 flex-grow">
              {!selectedFarm && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-4 py-12">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                  <p>Select a field marker on the map to begin satellite analysis.</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Processing Multi-Spectral Satellite Imagery...</p>
                </div>
              )}

              {analysisResult && !isAnalyzing && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{analysisResult.farm_id === 'farm_1' ? 'North Field' : 'South Field'}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">ID: {analysisResult.farm_id}</p>
                  </div>

                  {/* 4-Column Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Crop Detected</p>
                      <p className="text-lg font-bold text-gray-900">{analysisResult.crop}</p>
                      <p className="text-xs text-green-600 mt-1">{(analysisResult.confidence * 100).toFixed(0)}% Match</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Growth Stage</p>
                      <p className="text-lg font-bold text-gray-900">{analysisResult.growth_stage}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Water Deficit (ETc)</p>
                      <p className="text-lg font-bold text-gray-900">{analysisResult.water_deficit_mm} mm</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${getStressColor(analysisResult.stress_level)}`}>
                      <p className="text-xs uppercase font-semibold mb-1 opacity-80">Moisture Stress</p>
                      <p className="text-lg font-bold">{analysisResult.stress_level}</p>
                    </div>
                  </div>

                  {/* Recommendation Box */}
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-2">AI Irrigation Advisory</h4>
                    <div className={`p-5 rounded-xl border ${analysisResult.stress_level === 'High' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="font-medium leading-relaxed">{analysisResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
