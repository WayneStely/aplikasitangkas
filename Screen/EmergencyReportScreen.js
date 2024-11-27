import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

// URL untuk gambar latar belakang
const backgroundImage = { uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' };

// URL untuk gambar ikon
const iconUrl = 'https://tangkas.web.id/tangkas/images/verified_.png';

const EmergencyReportScreen = ({ navigation, route }) => {
	const parsedData = route?.params?.parsedData || [];

	console.log("INI VIEW DATA DARI EmergencyReportScreen:\n");
	console.log(parsedData);

	return (
		<ImageBackground source={backgroundImage} style={styles.background}>
			<View style={styles.container}>
				<View style={styles.messageBox}>
					<View style={styles.iconContainer}>
						<Image source={{ uri: iconUrl }} style={styles.icon} />
					</View>
					<Text style={styles.title}>Laporan Berhasil di Kirim!</Text>
					<Text style={styles.message}>
						Bantuan sedang dalam perjalanan. Tetap tenang dan tunggu di lokasi aman
					</Text>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { parsedData })}>
						<Text style={styles.buttonText}>Back to Home</Text>
					</TouchableOpacity>
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
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	messageBox: {
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	},
	iconContainer: {
		marginBottom: 10,
	},
	icon: {
		width: 40,
		height: 40,
		tintColor: 'green', // Mengubah warna ikon jika mendukung tint
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	message: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
	},
	button: {
		backgroundColor: '#0066cc',
		padding: 10,
		borderRadius: 5,
		marginVertical: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
	},
});

export default EmergencyReportScreen;
