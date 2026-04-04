import L from 'leaflet';

export const getIconByStatus = (status: string) => {
    // Create a generic styled div icon instead of default marker
    const color = status === 'Verified' ? 'green' : (status === 'Pending' ? 'orange' : 'red');

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};
