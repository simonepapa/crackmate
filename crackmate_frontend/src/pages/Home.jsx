import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { Icon, LatLng } from "leaflet";
import greenMarker from '/img/marker-icon-green.png'
import redMarker from '/img/marker-icon-red.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function Home() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const greenIcon = new Icon({
        iconUrl: greenMarker,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const redIcon = new Icon({
        iconUrl: redMarker,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const centeredBari = [41.117143, 16.871871];

    const fetchData = useCallback(async () => {
        setLoading(true)

        try {
            const response = await fetch(
                `http://127.0.0.1:3000/scans`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);

            } else {
                console.error("Response error", response.status);
            }
        } catch (error) {
            console.error("Request error", error);
        }

        setLoading(false);

    })

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(data)

    return (
        <div className={`relative w-full px-4 xl:px-0 h-screen`}>
            <div className="relative h-full w-full">
                <MapContainer
                    className="h-full w-full"
                    maxBoundsViscosity={1.0}
                    center={centeredBari}
                    zoom={15}
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                    />
                    {data && data.map(scan =>
                        <Marker icon={scan.password ? greenIcon : redIcon} position={new LatLng(scan.lat, scan.lng)}>
                            <Popup>
                                <strong>Name:</strong> {scan.name}<br />
                                <strong>Password:</strong> {scan.password ? scan.password : "Not yet cracked/unable to crack"}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>

        </div>

    );
}
export default Home;
