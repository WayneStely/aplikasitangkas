import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LaporScreen = () => {
	const navigation = useNavigation(); // Menambahkan hook useNavigation

	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.background}
		>
			<View style={styles.container}>
				<View style={styles.messageContainer}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/verified_.png' }}
						style={[styles.icon, styles.iconGreen]} // Menambahkan gaya untuk tintColor
					/>
					<Text style={styles.messageTitle}>Laporan Berhasil di Kirim!</Text>
					<Text style={styles.messageText}>
						Terima Kasih sudah membuat Laporan yang tepat, tetap tenang
					</Text>
					<TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
						<Text style={styles.backToHomeText}>Back to Home</Text>
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
	},
	messageContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	icon: {
		width: 50, // Ukuran icon yang disesuaikan
		height: 50, // Ukuran icon yang disesuaikan
		marginBottom: 10, // Jarak antara icon dan judul
	},
	iconGreen: {
		tintColor: 'green', // Mengubah warna ikon menjadi hijau
	},
	messageTitle: {
		fontSize: 20, // Ukuran font yang lebih besar
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'black',
	},
	messageText: {
		fontSize: 16, // Ukuran font yang lebih besar
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 10,
	},
	backToHomeText: {
		fontSize: 16, // Ukuran font yang lebih besar
		fontWeight: 'bold',
		color: 'blue',
	},
});

export default LaporScreen;
