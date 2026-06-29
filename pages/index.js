import dynamic from 'next/dynamic';
import { useState } from 'react';
import HistoryChart from '../components/HistoryChart';

// Disables SSR for the map component
const MapWidget = dynamic(() => import('../components/MapWidget'), { ssr: false });

export default function Dashboard() {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async (farmId) => {
    setSelectedFarm(farmId);
    // Fetch mock ML data from FastAPI
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/analyze/${farmId}`);
    const data = await res.json();
    setAnalysisResult(data);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-green-700">AgriSense AI Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MapWidget onFarmSelect={handleAnalyze} />
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Field Analysis</h2>
          {analysisResult ? (
            <div className="space-y-4">
              <p><strong>Crop:</strong> {analysisResult.crop} ({(analysisResult.confidence * 100).toFixed(0)}%)</p>
              <p><strong>Growth Stage:</strong> {analysisResult.growth_stage}</p>
              <p>
                <strong>Stress Level:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white ${analysisResult.stress_level === 'High' ? 'bg-red-500' : analysisResult.stress_level === 'Medium' ? 'bg-orange-500' : analysisResult.stress_level === 'Low' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {analysisResult.stress_level}
                </span>
              </p>
              <p><strong>Water Deficit (FAO-56):</strong> {analysisResult.water_deficit_mm} mm</p>
              <div className="mt-4 p-4 bg-blue-100 rounded-lg text-blue-900 border border-blue-200">
                <strong>AI Recommendation:</strong><br/>
                {analysisResult.recommendation}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Select a farm on the map to view analysis.</p>
          )}
        </div>
      </div>
      
      {/* Time-Series Visualization */}
      {selectedFarm && (
        <div className="mt-8">
          <HistoryChart farmId={selectedFarm} />
        </div>
      )}
    </div>
  );
}
