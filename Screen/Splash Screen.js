import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		setTimeout(() => {
			navigation.navigate('LoginScreen');
		}, 3000); // 3 detik
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Image
				source={{ uri: 'http://103.31.38.246/tangkas/images/logo_tangkas_2.png' }}
				style={styles.logo}
			/>
			<Text style={styles.logoText}>TANGKAS</Text>
			<Text style={styles.tagline}>Tangkap Kekerasan Seksual</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#173A66',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: 150,
		height: 150,
		resizeMode: 'contain',
		marginBottom: 20,
	},
	logoText: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	tagline: {
		color: '#fff',
		fontSize: 18,
		textAlign: 'center',
	},
});

export default SplashScreen;
