import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground } from 'react-native';

const HistoryScreen = ({ navigation, route }) => {
	const parsedData = route?.params?.parsedData || [];
	const [reports, setReports] = useState([]);

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = async () => {
		try {
			const response = await fetch('https://tangkas.web.id/myapp/public/mobile/userHistory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					full_name: '' + parsedData[0].full_name,
					judul_laporan: '---',
					tanggal_melapor: '---',
					tbl_id_users: '' + parsedData[0].id
				}).toString(),
			});
			const data = await response.json();
			setReports(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = (id) => {
		Alert.alert(
			"Hapus Laporan",
			"Apakah Anda yakin ingin menghapus laporan ini?",
			[
				{ text: "Batal", style: "cancel" },
				{
					text: "Hapus",
					onPress: async () => {
						try {
							const response = await fetch('https://tangkas.web.id/myapp/public/mobile/deleteHistoryUser', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
								body: new URLSearchParams({
									id_laporan: id
								}).toString(),
							});

							const result = await response.text();


							if (result === 'DELETE SUCCESS') {
								// Remove the deleted report from the local state
								setReports(reports.filter(report => report.id_laporan !== id));
							} else {
								Alert.alert("Gagal", "Laporan tidak dapat dihapus.");
							}
						} catch (error) {
							console.error(error);
							Alert.alert("Error", "Terjadi kesalahan saat menghapus laporan.");
						}
					},
				},
			]
		);
	};

	const renderReport = ({ item }) => {
		// Parse the time and date from API data
		const formattedTime = new Date(item.waktu_kejadian).toLocaleString("en-US", {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});

		const date = new Date(item.tanggal_kejadian);
		const formattedDate = date.toLocaleDateString("id-ID", {
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		// Determine title color based on the title content
		const titleStyle = [
			styles.reportTitle,
			item.judul === "EMERGENCY REPORT" && { color: 'red' }
		];

		return (
			<View style={styles.reportContainer}>
				<View style={styles.reportDetails}>
					<Text style={titleStyle}>{item.judul}</Text>
					<Text style={styles.reportDate}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/date_.png' }}
							style={styles.iconstelyatha}
						/>{" "}
						{formattedDate}
					</Text>
					<Text style={styles.reportDate}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/time.png' }}
							style={styles.iconstelyatha}
						/>{" "}
						{formattedTime}
					</Text>
					<Text style={styles.reportLocation}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/pin.png' }}
							style={styles.iconstelyatha}
						/>{" "}
						{item.lokasi}
					</Text>
					<Text style={styles.reportLocation}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/status.png' }}
							style={styles.iconstelyatha}
						/>{" "}
						{item.status_laporan}
					</Text>
				</View>
				<View style={styles.iconContainer}>
					<TouchableOpacity onPress={() => handleDelete(item.id_laporan)}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/delete%20(2).png' }}
							style={styles.icon}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};


	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.background}
		>
			{/* Tombol Back dan Teks "HISTORY TANGKAS" */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/back.png' }}
						style={styles.backIcon}
					/>
				</TouchableOpacity>
				<View style={styles.titleContainer}>
					<Text style={styles.headerText}>HISTORY TANGKAS</Text>
				</View>
			</View>
			<FlatList
				data={reports}
				keyExtractor={(item) => item.id_laporan}
				renderItem={renderReport}
				contentContainerStyle={[styles.flatListContent, { paddingBottom: 100 }]}
				ListEmptyComponent={
					<View style={styles.reportContainerFlat}>
						<Text>Maaf, tidak ada laporan tersedia.</Text>
					</View>
				}
			/>

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
		position: 'absolute',
		top: 50,
		left: 20,
		right: 20, // Tambahkan ini untuk membuat judul lebih mudah dipusatkan
		zIndex: 10,
	},
	backButton: {
		marginRight: 10,
	},
	backIcon: {
		width: 30,
		height: 30,
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center', // Memastikan teks terpusat dalam container ini
	},
	headerText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center', // Menyelaraskan teks ke tengah
	},
	flatListContent: {
		marginTop: 90,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	reportContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 15,
		marginVertical: 5,
		borderRadius: 10,
		elevation: 2,

	},
	reportContainerFlat: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 15,
		marginVertical: 5,
		borderRadius: 10,
		elevation: 2,


	},
	reportDetails: {
		flex: 1,
	},
	reportTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	reportDate: {
		fontSize: 14,
		color: '#555',
		marginVertical: 2,
	},
	reportLocation: {
		fontSize: 14,
		color: '#777',
	},
	iconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 35,
		height: 35,
		marginLeft: 10,
	},
	iconstelyatha: {
		width: 20,
		height: 20,
		marginLeft: 10,
		marginRight: 10,
	},
});

export default HistoryScreen;
