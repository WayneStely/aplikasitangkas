//import React from 'react';
import React, { useEffect, useState } from 'react';
//import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = ({ navigation, route }) => {
	// Safely checking if route.params and parsedData exist to prevent errors
	const parsedData = route?.params?.parsedData || [];
	const [location, setLocation] = useState({ latitude: null, longitude: null });

	// handle button emergency
	const handleButtonEmergency = async () => {
		Alert.alert(
			"Confirm Emergency Report",
			"Are you sure want to send an emergency report?",
			[
				{
					text: "No",
					onPress: () => console.log("Emergency report canceled"),
					style: "cancel"
				},
				{
					text: "Yes",
					onPress: async () => {

						console.log("Location Data:", location);

						// create request body with email and password input values
						const requestBody = {
							//'input-users-role': parsedData[0].role,
							'input-longitude': location.longitude,
							'input-latitude': location.latitude,
							'input-fullname': parsedData[0].username,
							'input-alamat-user': parsedData[0].alamat,
							'input-email': parsedData[0].email,
							'input-gender': parsedData[0].gender,
							'input-nik': parsedData[0].nik,
							'input-phone-number': parsedData[0].no_hp,
							'input-status': 'Yes',
							'input-id-users': parsedData[0].id,
						};

						// Time out request data
						const timeoutPromise = new Promise((resolve, reject) => {
							setTimeout(() => {
								reject(new Error('Request timed out'));
							}, 5000); // 5000 (5 detik)
						});


						Promise.race([
							fetch('https://tangkas.web.id/myapp/public/mobile/emergencyButton', {
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
								console.log("action button emergency:\n");
								// handle response data
								console.log(textData);

								try {

									if (textData.includes('EMERGENCY SUCCESS')) {
										// handle empty array case
										Alert.alert('Emergency Success', 'Bantuan Sedang dalam perjalanan, tetap tenang dan tunggu di lokasi aman.');
										navigation.navigate('EmergencyReportScreen', { parsedData });
									} else {

										Alert.alert('Emergency Failed', 'Maaf, laporan anda gagal.');

									}


								} catch (e) {
									Alert.alert('Error Message', 'Sorry, login failed. Please try again.');
									return;
								}



							})
							.catch(error => {
								//console.error(error);
								Alert.alert('Error Message', error.message);
								return;
							});



					}
				}
			],
			{ cancelable: false }
		);


	}

	useEffect(() => {
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
					getLocation();
				} else {
					Alert.alert("Permission Denied", "Location access was denied.");
				}
			} catch (err) {
				console.warn(err);
			}
		};

		const getLocation = () => {
			Geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setLocation({ latitude, longitude });
				},
				(error) => {
					console.log(error.code, error.message);
				},
				{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
			);
		};

		requestLocationPermission();
	}, []);


	// Log data to check if parsedData is correctly passed
	console.log("INI VIEW DATA DARI HOME SCREEN:\n");
	console.log(parsedData);

	return (
		<ImageBackground source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }} style={styles.background}>
			{/* Header section with logo and title */}
			<View style={styles.header}>
				<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/logo_tangkas_2.png' }} style={styles.logo} />
				<View style={styles.headerTextContainer}>
					<Text style={styles.title}>TANGKAS</Text>
					<Text style={styles.subtitle}>Pemerintah Kota Bitung</Text>
				</View>
			</View>

			{/* User info section */}
			<View style={styles.userInfo}>
				<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/logo-profile.png' }} style={styles.userIcon} />
				{/* Display user's full name or a fallback "User" if parsedData is empty */}
				<Text style={styles.userName}>Hai, {parsedData[0]?.full_name || 'User'}</Text>
			</View>

			{/* Information box section */}
			<View style={styles.infoBoxContainer}>
				<View style={styles.infoBox}>
					<View style={styles.infoPanel}>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/infowhite.png' }} style={styles.infoIconInPanel} />
					</View>
					<Text style={styles.infoText}>
						Tangkas bertujuan untuk mempercepat dan mempermudah proses pemantauan secara Real Time
						terhadap Kekerasan Seksual di Kota Bitung.
					</Text>
				</View>
				<View style={styles.locationContainer}>
					<View style={styles.locationBox}>
						<Text style={styles.locationLabel}>Latitude:</Text>
						<Text style={styles.locationValue}>
							{location.latitude ? location.latitude.toFixed(6) : 'Loading...'}
						</Text>
					</View>
					<View style={styles.locationBox}>
						<Text style={styles.locationLabel}>Longitude:</Text>
						<Text style={styles.locationValue}>
							{location.longitude ? location.longitude.toFixed(6) : 'Loading...'}
						</Text>
					</View>
				</View>
			</View>

			{/* Menu section with buttons */}
			<View style={styles.menu}>
				<View style={styles.menuRow}>
					<TouchableOpacity
						style={[styles.menuButton, styles.fastReport]}
						onPress={() => navigation.navigate('FastReportScreen', { parsedData })}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/form.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>Fast Report</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuButton, styles.map]}
						onPress={() => navigation.navigate('MapsScreen', { parsedData })}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/map.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>Geofencing</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuButton, styles.profile]}
						onPress={() => navigation.navigate('ProfileScreen', { parsedData })}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/user.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>Profile</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.menuRow}>
					<TouchableOpacity
						style={[styles.menuButton, styles.changePassword]}
						onPress={() => navigation.navigate('ChangePassword', { parsedData })}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/password2.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>Password</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuButton, styles.history]}
						onPress={() => navigation.navigate('HistoryScreen', { parsedData })}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/history2.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>History</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.menuButton, styles.logout]}
						onPress={() => navigation.navigate('LoginScreen')}
					>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/logout2.png' }} style={styles.menuIcon} />
						<Text style={styles.menuText}>Exit</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Emergency Report button */}
			<TouchableOpacity
				style={styles.emergencyButton}
				onPress={handleButtonEmergency}
			>
				<Text style={styles.emergencyText}>Emergency{"\n"}Report</Text>
			</TouchableOpacity>
		</ImageBackground>
	);
};


const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
		marginLeft: 20,
	},
	logo: {
		width: 40,
		height: 40,
	},
	headerTextContainer: {
		marginLeft: 10,
		marginTop: -5,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FF6F61',
	},
	subtitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFD700',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
		marginLeft: 20,

	},
	userIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	userName: {
		marginLeft: 10,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFF',
	},
	infoBoxContainer: {
		paddingHorizontal: 20,
		marginTop: 30,
		marginBottom: 30,

	},
	infoBox: {
		backgroundColor: '#FFF',
		padding: 10,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'flex-start',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		overflow: 'hidden',
		position: 'relative',
	},
	infoPanel: {
		width: 90,
		height: 85,
		backgroundColor: '#F57C00',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
	},
	infoIconInPanel: {
		width: 60,
		height: 60,
		tintColor: '#FFF',
		marginTop: 0,
	},
	infoText: {
		flex: 1,
		color: '#000',
		fontSize: 16,
		marginLeft: 100,
	},
	menu: {
		paddingHorizontal: 0,
		marginTop: -30,
	},
	menuRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 10,
	},
	menuButton: {
		width: 110,
		height: 110,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: '#CCC',
		elevation: 4,
		// Bayangan untuk iOS
		shadowColor: '#000000',
		shadowOffset: { width: 50, height: 20 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		// Bayangan untuk Android
		elevation: 25,
	},
	fastReport: {
		backgroundColor: '#0056A0',
	},
	map: {
		backgroundColor: '#004d00',
	},
	profile: {
		backgroundColor: '#FE9900',
	},
	changePassword: {
		backgroundColor: '#060270',
	},
	history: {
		backgroundColor: '#C71585',
	},
	logout: {
		backgroundColor: '#CC6CE7',
	},
	menuIcon: {
		width: 40,
		height: 40,
		tintColor: '#FFF',
	},
	menuText: {
		color: '#FFF',
		fontSize: 16,
		textAlign: 'center',
		marginTop: 5,
	},
	emergencyButton: {
		backgroundColor: '#FF0000',
		width: 170,
		height: 170,
		borderRadius: 85,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 10,
		marginTop: 35,
		// Bayangan untuk iOS
		shadowColor: '#000000',
		shadowOffset: { width: 50, height: 20 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		// Bayangan untuk Android
		elevation: 25,
	},

	emergencyText: {
		color: '#FFFFFF',
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 10, // Jarak antara button dan teks
	},
	locationContainer: {
		flexDirection: 'row',
		justifyContent: 'center', // Mengubah space-between menjadi center agar lebih ke tengah
		alignItems: 'center', // Memastikan item berada di tengah vertikal
		paddingHorizontal: 20,
		width: '100%',
		marginBottom: 10, // Memberikan jarak dari bawah layar
	},
	locationBox: {
		padding: 10,
		borderRadius: 8,
		width: '30%', // Sedikit lebih lebar agar terlihat lebih proporsional di tengah
		alignItems: 'center', // Menempatkan teks di tengah dalam box
	},
	locationLabel: {
		color: '#FFD700',
		fontSize: 10,
		fontWeight: 'bold',
		marginBottom: 2,
		textAlign: 'center', // Menyesuaikan teks label di tengah
	},
	locationValue: {
		color: '#FFF',
		fontSize: 12,
		textAlign: 'center', // Menyesuaikan teks nilai di tengah
	},
});

export default HomeScreen;
