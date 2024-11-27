import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const backgroundImage = { uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' };

const EmergencyReportScreen = ({ navigation }) => {
	return (
		<ImageBackground source={backgroundImage} style={styles.background}>
			<View style={styles.container}>
				<View style={styles.messageBox}>
					<Text style={styles.title}>Laporan Berhasil di kirim!</Text>
					<Text style={styles.message}>
						Bantuan sedang dalam perjalanan. Tetap tenang dan tunggu di lokasi aman
					</Text>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
						<Text style={styles.buttonText}>Back to Home</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LaporEmergency')}>
						<Text style={styles.buttonText}>Emergency Report</Text>
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
		marginVertical: 5, // Menambahkan jarak vertikal antar tombol
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
	},
});

export default EmergencyReportScreen;
