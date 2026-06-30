import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

export default function MapWidget({ onFarmSelect }) {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    // Fetch the mock farms from your FastAPI backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/farms`)
      .then(res => res.json())
      .then(data => {
        // The backend now returns stress_level and crop directly in the payload!
        setFarms(data);
      })
      .catch(err => console.error("API not running yet:", err));
  }, []);

  const getMarkerIcon = (stressLevel) => {
    let color = 'gray';
    if (stressLevel === 'Healthy') color = '#22c55e'; // green
    else if (stressLevel === 'Low') color = '#eab308'; // yellow
    else if (stressLevel === 'Medium') color = '#f97316'; // orange
    else if (stressLevel === 'High') color = '#ef4444'; // red

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Center coordinates set roughly between the two mock farms */}
      <MapContainer center={[23.28, 77.44]} zoom={11} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {farms.map(farm => (
          <Marker 
            key={farm.id} 
            position={[farm.lat, farm.lng]}
            icon={getMarkerIcon(farm.stress_level)}
            eventHandlers={{
              click: () => onFarmSelect(farm.id), // Passes farm ID up to the Dashboard
            }}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-lg">{farm.name}</strong><br/>
                <span className="text-gray-600">Crop: {farm.crop}</span><br/>
                <span className="text-gray-600 font-semibold mt-1 block">Stress: {farm.stress_level || 'Loading...'}</span>
                <button 
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => onFarmSelect(farm.id)}
                >
                  Analyze Field
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
