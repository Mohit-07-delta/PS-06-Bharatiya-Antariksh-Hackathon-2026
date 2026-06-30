import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_farms_returns_lightweight_data():
    """Test that the /api/farms endpoint returns basic geometry without N+1 latency."""
    response = client.get("/api/farms")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    
    # Check that heavy logic is deferred (stress_level is Unknown initially)
    first_farm = data[0]
    assert "id" in first_farm
    assert "lat" in first_farm
    assert "lng" in first_farm
    assert first_farm["stress_level"] == "Unknown"
    assert first_farm["crop"] == "Unknown"

def test_analyze_farm_calculates_stress():
    """Test that the /api/analyze/{farm_id} endpoint executes ML and FAO-56 logic."""
    response = client.get("/api/analyze/farm_2")
    assert response.status_code == 200
    
    data = response.json()
    assert data["farm_id"] == "farm_2"
    assert "crop" in data
    assert "confidence" in data
    assert "moisture_percent" in data
    assert "stress_level" in data
    assert "water_deficit_mm" in data
    assert "recommendation" in data
    
    # Stress level should be calculated, not Unknown
    assert data["stress_level"] in ["Healthy", "Low", "Medium", "High"]
    
def test_invalid_farm_analysis():
    """Test fallback logic when analyzing an unknown farm ID."""
    response = client.get("/api/analyze/invalid_farm_999")
    assert response.status_code == 200
    
    data = response.json()
    # Should still return a valid structure using fallback/dummy logic for resilience
    assert data["farm_id"] == "invalid_farm_999"
    assert data["stress_level"] in ["Healthy", "Low", "Medium", "High"]
