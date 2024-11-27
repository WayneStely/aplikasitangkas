import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert, PermissionsAndroid, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

const MapsScreen = ({ navigation, route }) => {
	const parsedData = route?.params?.parsedData || [];
	console.log("INI VIEW DATA DARI MAPS SCREEN:\n", parsedData);

	const [markerPosition, setMarkerPosition] = useState([1.451877, 125.188682]);
	const [location, setLocation] = useState({ latitude: null, longitude: null });
	const [isWithinBitung, setIsWithinBitung] = useState(true);
	let [reportsData, setReportsData] = useState([]);

	console.log("Location Data:", location);

	// Haversine formula to calculate distance between two coordinates in meters
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371000; // Radius of the Earth in meters
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;
		return distance; // Distance in meters
	};

	const sendMessageToWA = async (my_phone_number) => {
		// create request body with email and password input values
		const requestBody = {
			'no-hp': my_phone_number,

		};

		// Time out request data
		const timeoutPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, 5000); // 5000 (5 detik)
		});

		Promise.race([
			fetch('https://tangkas.web.id/myapp/public/mobile/sendTextWA', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: Object.keys(requestBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestBody[key])}`).join('&')
			}),
			timeoutPromise
		])
			.then(response => response.text())
			.then(textData => {
				// handle response data
				console.log(textData);

			})
			.catch(error => {
				//console.error(error);
				Alert.alert('Error Message', error.message);
				return;
			});
	};

	const fetchReportsData = async () => {
		try {
			const response = await fetch('https://tangkas.web.id/myapp/public/mobile/usergeofence');
			const data = await response.json();
			setReportsData(data);

			reportsData = data;

			//console.log(data);

			// Calculate distance to each disaster report and show alert if within 500m
			data.forEach(report => {
				const distance = calculateDistance(location.latitude, location.longitude, parseFloat(report.latitude), parseFloat(report.longitude));

				console.log("Jarak yaitu :" + distance + " Meter.");

				// paling kurang 500 meter dapat alert
				if (distance <= 500) {
					Alert.alert("Warning", "Anda memasuki daerah rawan kekerasan seksual.");

					// kirim juga ke WA
					var getPhone = parsedData[0].no_hp;
					sendMessageToWA(getPhone);
				}
			});

		} catch (error) {
			console.error("Failed to fetch reports data:", error);
		}
	};

	const handleUpdateDataLaporan = () => {
		console.log("Update data laporan: ");
		fetchReportsData();
	};

	// Tambahkan fetchReportsData di dalam useEffect yang memantau perubahan pada location
	useEffect(() => {
		// Jika latitude dan longitude tersedia, ambil data laporan
		if (location.latitude && location.longitude) {
			fetchReportsData();
		}
	}, [location]); // Trigger setiap kali lokasi diperbarui

	useEffect(() => {
		let watchId;

		const requestLocationPermission = async () => {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: "Permission to Access Location",
						message: "This app needs access to your location.",
						buttonNeutral: "Ask Me Later",
						buttonNegative: "Cancel",
						buttonPositive: "OK"
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					watchPosition();
				} else {
					Alert.alert("Permission Denied", "Location access was denied.");
				}
			} catch (err) {
				console.warn(err);
			}
		};

		const watchPosition = () => {
			watchId = Geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setLocation({ latitude, longitude });
					setMarkerPosition([latitude, longitude]);
					setIsWithinBitung(true);

					// update data dulu
					fetchReportsData();

				},
				(error) => {
					console.log(error.code, error.message);
				},
				{ enableHighAccuracy: true, distanceFilter: 1, interval: 2000, fastestInterval: 2000 }
			);
		};


		requestLocationPermission();

		return () => {
			if (watchId != null) {
				Geolocation.clearWatch(watchId);
			}
		};
	}, []);

	const injectedJavaScript = `
	var map = L.map('map', {
		zoomControl: false,
		gestureHandling: true,
		maxBounds: [[1.35, 125.0], [1.55, 125.3]],
		maxBoundsViscosity: 1.0
	}).setView([${markerPosition[0]}, ${markerPosition[1]}], ${isWithinBitung ? 10 : 5});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		minZoom: 10,
		attribution: '© OpenStreetMap'
	}).addTo(map);

	// Add zoom control only at the bottom position
	L.control.zoom({ position: 'bottomright' }).addTo(map);

	// Marker for current location
	var currentLocationMarker = L.marker([${markerPosition[0]}, ${markerPosition[1]}], {
		icon: L.icon({
			iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		})
	}).addTo(map).bindPopup('You are here').openPopup();

	// Add markers for each report data from API
	const reportsData = ${JSON.stringify(reportsData)};

	reportsData.forEach(function(report) {
		L.marker([report.latitude, report.longitude], {
			icon: L.icon({
				iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			})
		})
		.addTo(map)
		.bindPopup(\`
			<div style="font-weight:bold;color:red;">\${report.judul}</div>
			<div>📅 \${report.tanggal_kejadian}</div>
			<div>⏰ \${report.waktu_kejadian}</div>
			<div style="font-weight:bold;">Deskripsi:</div>
			<div>\${report.lokasi}</div>
		\`);
	});
`;


	const handleLocationSubmit = () => {
		if (selectedLocation) {
			const { lat, lng, locationInfo } = selectedLocation;
			Alert.alert("Location Submitted", `Location: ${locationInfo}\nLatitude: ${lat}\nLongitude: ${lng}`);
		} else {
			Alert.alert("Error", "Please select a location first.");
		}
	};

	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.background}
		>
			<View style={styles.container}>
				{/* Back Icon */}
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/back.png' }}
						style={styles.backIcon}
					/>
				</TouchableOpacity>
				<View style={styles.titleContainer}>
					<Text style={styles.headerText}>PEMBATASAN AREA</Text>
				</View>

				{/* OpenStreetMap */}
				<View style={styles.mapContainer}>
					<WebView
						source={{
							html: `
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                                <style> 
                                  #map { height: 100%; width: 100%; } 
                                  body, html { margin: 0; padding: 0; height: 100%; }
                                </style>
                                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gesture-handling/1.2.1/leaflet-gesture-handling.min.js"></script>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gesture-handling/1.2.1/leaflet-gesture-handling.min.css" />
                              </head>
                              <body>
                                <div id="map"></div>
                                <script>
                                  ${injectedJavaScript}
                                </script>
                              </body>
                            </html>
                            `
						}}
						style={styles.map}
						javaScriptEnabled={true}
						scalesPageToFit={true}
						originWhitelist={['*']}
						onMessage={(event) => {
							const data = JSON.parse(event.nativeEvent.data);
							if (data.selectedLocation) {
								setSelectedLocation(data.selectedLocation);
							}
						}}
					/>
				</View>
				<View style={styles.bottomPanel}>
					<Text style={styles.panelText}>Apakah anda ingin mengupdate data laporan?</Text>
					<View style={styles.legend}>
						<View style={styles.submitContainer}>
							<Button title="Update Data Laporan" onPress={handleUpdateDataLaporan} />
						</View>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
	container: {
		flex: 1,
	},
	backButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 1,
	},
	backIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	},
	titleContainer: {
		alignItems: 'center',
		paddingTop: 22,
	},
	headerText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	mapContainer: {
		flex: 1,
		marginTop: 20,
	},
	map: {
		flex: 1,
	},
	bottomPanel: {
		backgroundColor: 'white',
		padding: 10,
		marginBottom: 0,
	},
	panelText: {
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 10,
		color: 'black',
	},
	legend: {
		flexDirection: 'column',
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	legendColor: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	submitContainer: {
		padding: 10,
	},
	legendText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: 'black',
	},
	markerLabel: {
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'black',
		padding: 5,
		backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for better readability
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'gray',
	},
});


export default MapsScreen;
