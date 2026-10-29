import { useEffect, useId, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const markerIcon = L.icon({
    iconUrl: markerIconUrl,
    iconRetinaUrl: markerIconRetinaUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const parseCoordinate = (value, limit) => {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (typeof value === 'string' && !value.trim()) return null;

    const number = Number(value);
    return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
};

export default function TeacherMap({ teacher }) {
    const [visible, setVisible] = useState(false);
    const containerRef = useRef(null);
    const mapId = useId();
    const latitude = parseCoordinate(teacher.coordinates?.latitude, 90);
    const longitude = parseCoordinate(teacher.coordinates?.longitude, 180);
    const name = teacher.full_name || 'Unknown teacher';

    useEffect(() => {
        if (!visible || latitude === null || longitude === null) return;

        const map = L.map(containerRef.current).setView([latitude, longitude], 10);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const popup = document.createElement('span');
        popup.textContent = name;
        L.marker([latitude, longitude], { icon: markerIcon, title: name, alt: `Location of ${name}` })
            .addTo(map)
            .bindPopup(popup);

        return () => map.remove();
    }, [visible, latitude, longitude, name]);

    if (latitude === null || longitude === null) {
        return <p className="map-unavailable">Location coordinates are unavailable.</p>;
    }

    return (
        <div className="teacher-location">
            <button
                type="button"
                className="toggle-map"
                aria-expanded={visible}
                aria-controls={mapId}
                onClick={() => setVisible(current => !current)}
            >{visible ? 'Hide map' : 'Show map'}</button>
            {visible && (
                <div
                    id={mapId}
                    ref={containerRef}
                    className="teacher-map"
                    role="region"
                    aria-label={`Location of ${name}`}
                />
            )}
        </div>
    );
}
