import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const LocationAccessScreen = ({ navigation }) => {
	const handleEnableLocation = () => {
		// Here you would typically request location permissions
		// and enable location services. This is a placeholder for that logic.
		// After enabling location, navigate to HomeScreen.
		navigation.navigate('HomeScreen');
	};

	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.backgroundImage}
		>
			<View style={styles.container}>
				<View style={styles.panel}>
					<Text style={styles.title}>Location Access</Text>
					<Text style={styles.description}>
						Untuk menerima peringatan keselamatan dan mengirim laporan darurat dengan lokasi yang akurat,
						aktifkan layanan lokasi di pengaturan perangkat anda. Privasi anda adalah prioritas kami, dan
						informasi lokasi anda hanya akan digunakan untuk tujuan ini.
					</Text>
					<TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
						<Text style={styles.buttonText}>Enable Location</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	panel: {
		width: '80%',
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#173A66',
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		color: '#173A66',
		textAlign: 'center',
		marginBottom: 20,
	},
	button: {
		width: '100%',
		backgroundColor: '#173A66',
		borderRadius: 5,
		padding: 15,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default LocationAccessScreen;
