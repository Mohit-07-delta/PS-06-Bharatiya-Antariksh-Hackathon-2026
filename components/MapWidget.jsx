import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

export default function MapWidget({ onFarmSelect }) {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    // Fetch the mock farms from your FastAPI backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/farms`)
      .then(res => res.json())
      .then(data => setFarms(data))
      .catch(err => console.error("API not running yet:", err));
  }, []);

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
            eventHandlers={{
              click: () => onFarmSelect(farm.id), // Passes farm ID up to the Dashboard
            }}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-lg">{farm.name}</strong><br/>
                <span className="text-gray-600">Crop: {farm.crop}</span><br/>
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
