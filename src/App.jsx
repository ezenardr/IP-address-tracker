import { useState, useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Styles from './App.module.css';

const fetchData = async (api) => {
    const res = await fetch(api);
    const json = await res.json();
    return json;
};
const App = () => {
    const [location, setLocation] = useState(null);
    const [search, setSearch] = useState('');
    useEffect(() => {
        fetchData(
            'https://geo.ipify.org/api/v2/country,city?apiKey=at_ywehIVtFVxwkmx0ZH6Dtqi2bx9lU1&ipAddress='
        ).then((data) => setLocation(data));
    }, []);
    const submitHandler = (e) => {
        e.preventDefault();
        const ipTest =
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
        if (ipTest.test(search)) {
            fetchData(
                `https://geo.ipify.org/api/v2/country,city?apiKey=at_ywehIVtFVxwkmx0ZH6Dtqi2bx9lU1&ipAddress=${search}`
            ).then((data) => setLocation(data));
        } else {
            fetchData(
                `https://geo.ipify.org/api/v2/country,city?apiKey=at_ywehIVtFVxwkmx0ZH6Dtqi2bx9lU1&domain=${search}`
            ).then((data) => setLocation(data));
        }
        setSearch('');
    };
    return (
        <>
            <header>
                <h1 className={Styles.title}>IP Address Tracker</h1>
                <form onSubmit={submitHandler}>
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for any IP address or domain"
                        value={search}
                    />
                    <IoIosArrowForward
                        onClick={submitHandler}
                        className={Styles.icon}
                    />
                </form>
                {location && (
                    <div className={Styles.data}>
                        <div
                            className={`${Styles.dataBox} ${Styles.borderRight}`}
                        >
                            <p className={Styles.dataBoxTitle}>IP address</p>
                            <p className={Styles.dataData}>{location.ip}</p>
                        </div>
                        <div
                            className={`${Styles.dataBox} ${Styles.borderRight}`}
                        >
                            <p className={Styles.dataBoxTitle}>location</p>
                            <p className={Styles.dataData}>
                                {location.location.region}
                            </p>
                        </div>
                        <div
                            className={`${Styles.dataBox} ${Styles.borderRight}`}
                        >
                            <p className={Styles.dataBoxTitle}>timezone</p>
                            <p className={Styles.dataData}>
                                UTC {` ${location.location.timezone}`}
                            </p>
                        </div>
                        <div className={`${Styles.dataBox}`}>
                            <p className={Styles.dataBoxTitle}>isp</p>
                            <p className={Styles.dataData}>{location.isp}</p>
                        </div>
                    </div>
                )}
            </header>
            {location && (
                <div className={Styles.map}>
                    <MapContainer
                        center={[location.location.lat, location.location.lng]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ width: '100vw', height: '100vh' }}
                    >
                        <TileLayer
                            noWrap={true}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={[
                                location.location.lat,
                                location.location.lng,
                            ]}
                        >
                            <Popup>{location.location.city}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </>
    );
};

export default App;
