import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { Icon, LatLng } from "leaflet";
import greenMarker from '/img/marker-icon-green.png'
import redMarker from '/img/marker-icon-red.png'
import blueMarker from '/img/marker-icon-blue.png'
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

    const blueIcon = new Icon({
        iconUrl: blueMarker,
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

                const map = new Map();

                // Look for duplicate couple of coordinates
                for (const scan of jsonData) {
                    const key = `${scan.lat},${scan.lng}`;
                    if (!map.has(key)) {
                        map.set(key, []);
                    }
                    map.get(key).push(scan);
                }

                setData(Array.from(map.entries()).map(([key, scans]) => {
                    const [lat, lng] = key.split(',').map(Number);
                    return { lat, lng, scans };
                }));

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
        <div className={`relative w-full p-0 h-screen`}>
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
                    {data && data.map((scans, index) => {
                        return <Marker key={index} icon={scans.scans.length > 1 ? blueIcon : scans.scans[0].password ? greenIcon : redIcon} position={new LatLng(scans.lat, scans.lng)}>
                            <Popup>{scans.scans.map((scan, i) => (
                                <div key={i}>
                                    <strong>Name:</strong> {scan.name}<br />
                                    <strong>Password:</strong> {scan.password ?? 'Not yet cracked/unable to crack'}
                                    {i < scans.scans.length - 1 && <hr className="my-1" />}
                                </div>
                            ))}</Popup>
                        </Marker>
                    })
                    }
                </MapContainer>
                <div className="z-[1500] left-1/2 -translate-x-1/2 w-[calc(100%-16px)] sm:w-fit sm:left-[unset] sm:-translate-x-0 p-4 absolute right-2 top-2 bg-white flex flex-col gap-2">
                    <div className="flex gap-2">
                        <img src={greenMarker} alt="green marker" className="w-auto h-8" />
                        <p>1 item found in marker position, password cracked succesfully</p>
                    </div>
                    <div className="flex gap-2">
                        <img src={redMarker} alt="green marker" className="w-auto h-8" />
                        <p>1 item found in marker position, password not yet cracked/not cracked succesfully</p>
                    </div>
                    <div className="flex gap-2">
                        <img src={blueMarker} alt="green marker" className="w-auto h-8" />
                        <p>2+ items found in marker position</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
