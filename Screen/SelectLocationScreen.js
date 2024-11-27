import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const SelectLocationScreen = ({ navigation, route }) => {
	let parsedData = route?.params?.parsedData || [];
	console.log("INI VIEW DATA DARI SelectLocationScreen SCREEN:\n", parsedData);

	const [markerPosition, setMarkerPosition] = useState([1.451877, 125.188682]);
	const [selectedLocation, setSelectedLocation] = useState(null);

	const injectedJavaScript = `
    var map = L.map('map', {
        zoomControl: false,
        gestureHandling: true,
        maxBounds: [[1.35, 125.0], [1.55, 125.3]],
        maxBoundsViscosity: 1.0
    }).setView([${markerPosition[0]}, ${markerPosition[1]}], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 10,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add zoom control only at the bottom position
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    var clickMarker;

    map.on('click', async function(e) {
        const { lat, lng } = e.latlng;
        const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}\`);
        const data = await response.json();
        const locationInfo = data.display_name || 'Unknown Location';

        if (clickMarker) {
            clickMarker.setLatLng(e.latlng);
            clickMarker.setPopupContent(\`<b>Location:</b> \${locationInfo}<br><b>Latitude:</b> \${lat}<br><b>Longitude:</b> \${lng}\`);
        } else {
            clickMarker = L.marker([lat, lng], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(map);
            clickMarker.bindPopup(\`<b>Location:</b> \${locationInfo}<br><b>Latitude:</b> \${lat}<br><b>Longitude:</b> \${lng}\`).openPopup();
        }

        clickMarker.openPopup();
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng, locationInfo }));
        window.ReactNativeWebView.postMessage(JSON.stringify({ selectedLocation: { lat, lng, locationInfo } }));
    });
`;

	// Fungsi untuk memperbarui parsedData dengan lokasi
	const updateParsedDataWithLocation = (info, lat, lng) => {
		parsedData = parsedData.map(item => ({
			...item,
			location: {
				place: info,
				latitude: lat,
				longitude: lng,
			}
		}));
	};

	const handleLocationSubmit = () => {
		if (selectedLocation) {
			const { lat, lng, locationInfo } = selectedLocation;
			Alert.alert(
				"Confirm Location",
				`Apakah anda yakin ingin memilih lokasi ini: \n\nLocation: ${locationInfo}\nLatitude: ${lat}\nLongitude: ${lng}`,
				[
					{
						text: "Cancel",
						style: "cancel"
					},
					{
						text: "OK",
						onPress: () => {
							// Update parsedData dengan lokasi
							updateParsedDataWithLocation(locationInfo, lat, lng);
							//Alert.alert("Location Submitted", `Location: ${locationInfo}\nLatitude: ${lat}\nLongitude: ${lng}`);

							navigation.navigate('FastReportScreen', { parsedData });
							//navigation.navigate('FastReportScreen', updatedParsedData);
						}
					}
				]
			);
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
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/back.png' }}
						style={styles.backIcon}
					/>
				</TouchableOpacity>
				<View style={styles.titleContainer}>
					<Text style={styles.headerText}>SEARCH & SELECT LOCATION</Text>
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

				{/* Panel at the bottom */}
				<View style={styles.bottomPanel}>
					<Text style={styles.panelText}>MY SELECTED LOCATION</Text>
					<View style={styles.legend}>
						<View style={styles.legendItem}>
							<Text style={styles.legendText}>Location: </Text>
							<Text style={styles.legendTextStandard}>{selectedLocation?.locationInfo || "No location selected"}</Text>
						</View>
						<View style={styles.legendItem}>
							<Text style={styles.legendText}>Longitude: </Text>
							<Text style={styles.legendTextStandard}>{selectedLocation?.lng || "N/A"}</Text>
						</View>
						<View style={styles.legendItem}>
							<Text style={styles.legendText}>Latitude: </Text>
							<Text style={styles.legendTextStandard}>{selectedLocation?.lat || "N/A"}</Text>
						</View>
						<View style={styles.submitContainer}>
							<Button title="Choose Selected Location" onPress={handleLocationSubmit} disabled={!selectedLocation} />
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
		//flex: 1,
		alignItems: 'center', // Memastikan teks terpusat dalam container ini
		paddingTop: 22,
	},
	headerText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center', // Menyelaraskan teks ke tengah
	},
	mapContainer: {
		flex: 1,
		marginTop: 20,
	},
	map: {
		flex: 1,
	},
	submitContainer: {
		padding: 10,
	},
	bottomPanel: {
		backgroundColor: 'white',
		padding: 10,
		//borderTopLeftRadius: 20,
		//borderTopRightRadius: 20,
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
	legendText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: 'black',
		marginLeft: 10,
	},
	legendTextStandard: {
		fontSize: 12,
		color: 'black',
		marginLeft: 10,
	},
});

export default SelectLocationScreen;
