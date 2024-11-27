import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';

const FastReportScreen = ({ navigation, route }) => {
	const parsedData = route?.params?.parsedData || [];

	console.log("INI VIEW DATA DARI FASTREPORT:\n");
	console.log(parsedData);


	// State for all input fields
	// State for all input fields
	const [judul, setjudul] = useState('');
	const [deskripsi, setDeskripsi] = useState('');
	const [lokasi, setLokasi] = useState('');
	const [tanggalKejadian, setTanggalKejadian] = useState(null);
	const [waktuKejadian, setWaktuKejadian] = useState(null);
	const [laporPihak, setLaporPihak] = useState('');
	const [statusPelapor, setStatusPelapor] = useState('');
	const [longitude, setLongitude] = useState('');
	const [latitude, setLatitude] = useState('');

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
	const [showOptions, setShowOptions] = useState(false);


	// Check location on component mount or when parsedData changes
	useEffect(() => {
		if (parsedData.length > 0 && parsedData[0].location) {
			const locationData = parsedData[0].location;
			setLokasi(locationData.place);
			setLongitude(locationData.longitude.toString());
			setLatitude(locationData.latitude.toString());
		} else {
			// Set default values if no location is found
			setLokasi('');
			setLongitude('');
			setLatitude('');
		}
	}, [parsedData]);

	// Date picker functions
	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleDateConfirm = (selectedDate) => {
		setTanggalKejadian(selectedDate);
		hideDatePicker();
	};

	// Time picker functions
	const showTimePicker = () => {
		setTimePickerVisibility(true);
	};

	const hideTimePicker = () => {
		setTimePickerVisibility(false);
	};

	const handleTimeConfirm = (selectedTime) => {
		setWaktuKejadian(selectedTime);
		hideTimePicker();
	};

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// Function to handle fastreport submission
	const handleFastReport = async () => {
		// Alert.alert('judul', "" + judul.trim());
		// Alert.alert('deksripsi', "" + deskripsi.trim());
		// Alert.alert('lokasi', "" + lokasi.trim());
		// Alert.alert('tanggalKejadian', "" + tanggalKejadian.trim());
		// Alert.alert('waktuKejadian', "" + waktuKejadian);
		// Alert.alert('laporPihak', "" + laporPihak);
		// Alert.alert('statusPelapor', "" + statusPelapor);
		// Alert.alert('fullname', "" + parsedData[0].full_name);
		// Alert.alert('id', "" + parsedData[0].id);

		const data_judul = "" + judul.trim();
		const data_longitude = "" + longitude.trim();
		const data_latitude = "" + latitude.trim();
		const data_deksripsi = "" + "" + deskripsi.trim();
		const data_lokasi = "" + lokasi.trim();
		const data_tanggalKejadian = "" + tanggalKejadian;
		const data_waktuKejadian = "" + waktuKejadian;
		const data_laporPihak = "" + laporPihak;
		const data_statusPelapor = "" + statusPelapor;
		const data_fullname = "" + parsedData[0].full_name;
		const data_id = "" + parsedData[0].id;

		// Validate fields
		if (!data_judul || !data_deksripsi || !data_lokasi || !data_tanggalKejadian || !data_waktuKejadian || !data_laporPihak || !data_statusPelapor || !data_longitude || !data_latitude) {
			Alert.alert('Error', 'All fields must be filled.');
			return;
		}

		// Prepare request body
		const requestBody = {
			'input-fullname': data_fullname,
			'input-judul': data_judul,
			'input-deskripsi': data_deksripsi,
			'input-lokasi-bencana': data_lokasi,
			'tanggal-kejadian': data_tanggalKejadian,
			'waktu-kejadian': data_waktuKejadian,
			'input-lapor-pihak': data_laporPihak,
			// 'input-foto': foto,
			'input-status-pelapor': data_statusPelapor,
			'input-id-users': data_id,
			'input-longitude': data_longitude,
			'input-latitude': data_latitude,
		};

		// Timeout function for the request
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, 5000);
		});

		try {
			const response = await Promise.race([
				fetch('https://tangkas.web.id/myapp/public/mobile/fastreport', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: Object.keys(requestBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestBody[key])}`).join('&')
				}),
				timeoutPromise
			]);

			const result = await response.text();
			console.log(result);

			// Handle response
			if (result === 'FASTREPORT SUCCESS') {
				Alert.alert('Success', 'Your report has been submitted successfully.');
				navigation.navigate('HomeScreen', { parsedData });

			}
			if (result === 'FASTREPORT FAILED') {
				Alert.alert('FAILED', 'Sorry, your report failed.');

			}
			if (result === 'INVALID REQUEST METHOD') {
				Alert.alert('WRONG REQUEST', 'Sorry, you cannot request using this method.');

			}

		} catch (error) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			keyboardShouldPersistTaps="handled"
			keyboardDismissMode="on-drag"
		>
			<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }} style={styles.backgroundImage} />

			{/* Back Button */}
			<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
				<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/back.png' }} style={styles.backIcon} />
			</TouchableOpacity>
			<View style={styles.titleContainer}>
				<Text style={styles.headerText}>FAST REPORT</Text>
			</View>

			<View style={styles.content}>
				<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/bentuk_kekerasan.png' }} style={styles.image} />


				<View style={styles.panel}>
					<Text style={styles.panelTitle}>Sampaikan, Kami Bertindak !!!</Text>
				</View>


				<Picker
					selectedValue={judul}
					style={styles.input}
					onValueChange={(itemValue) => setjudul(itemValue)}
				>
					<Picker.Item label="judul" value="" />
					<Picker.Item label="Pelecehan Seksual Fisik" value="Pelecehan Seksual Fisik" />
					<Picker.Item label="Pelecehan Seksual Verbal" value="Pelecehan Seksual Verbal" />
					<Picker.Item label="Pelecehan Seksual No Fisik" value="Pelecehan Seksual No Fisik" />
					<Picker.Item label="Pelecehan Seksual Daring atau Melalui Teknologi Informasi dan Komunikasi" value="Pelecehan Seksual Daring atau Melalui Teknologi Informasi dan Komunikasi" />
				</Picker>

				{/* <TextInput
					style={styles.input}
					placeholder="deskripsi"
					value={deskripsi}
					onChangeText={setdeskripsi}
				/> */}

				<TextInput
					style={styles.input}
					placeholder="deskripsi"
					value={deskripsi}
					onChangeText={setDeskripsi}
				/>

				{/* Location Input with Icon */}
				<View style={styles.iconTextContainer}>
					<TextInput
						style={styles.inputWithIcon}
						placeholder="lokasi"
						value={lokasi}
						onChangeText={setLokasi}
						editable={false}
					/>
					<TouchableOpacity style={styles.touchableIcon} onPress={() => navigation.navigate('SelectLocationScreen', { parsedData })}>
						<Image
							source={{ uri: 'https://tangkas.web.id/tangkas/images/map.png' }}
							style={styles.iconRight}
						/>
					</TouchableOpacity>
				</View>

				<TextInput
					style={styles.input}
					placeholder="longitude"
					value={longitude}
					onChangeText={setLongitude}
					editable={false}
				/>
				<TextInput
					style={styles.input}
					placeholder="latitude"
					value={latitude}
					onChangeText={setLatitude}
					editable={false}
				/>

				{/* Date Input */}
				<View style={styles.iconTextContainer}>
					<TextInput
						style={styles.inputWithIcon}
						placeholder="tanggal Kejadian"
						value={tanggalKejadian ? tanggalKejadian.toLocaleDateString() : ""}
						editable={false}
					/>
					<TouchableOpacity onPress={showDatePicker} style={styles.touchableIcon}>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/CALENDAR.png' }} style={styles.iconRight} />
					</TouchableOpacity>
					<DatePicker
						modal
						open={isDatePickerVisible}
						date={tanggalKejadian || new Date()}
						mode="date"
						onConfirm={handleDateConfirm}
						onCancel={hideDatePicker}
					/>
				</View>

				{/* Time Input */}
				<View style={styles.iconTextContainer}>
					<TextInput
						style={styles.inputWithIcon}
						placeholder="Waktu Kejadian"
						value={waktuKejadian ? waktuKejadian.toLocaleTimeString() : ""}
						editable={false}
					/>
					<TouchableOpacity onPress={showTimePicker} style={styles.touchableIcon}>
						<Image source={{ uri: 'https://tangkas.web.id/tangkas/images/CLOCK%20(2).png' }} style={styles.iconRightCentered} />
					</TouchableOpacity>
					<DatePicker
						modal
						open={isTimePickerVisible}
						date={waktuKejadian || new Date()}
						mode="time"
						onConfirm={handleTimeConfirm}
						onCancel={hideTimePicker}
					/>
				</View>

				<TouchableOpacity onPress={toggleOptions} style={styles.input}>
					<Text style={styles.optionText}>{laporPihak || "Lapor ke Pihak Terkait?"}</Text>
				</TouchableOpacity>

				{showOptions && (
					<View style={styles.optionsContainer}>
						<TouchableOpacity
							style={[styles.optionButton, laporPihak === 'Ya' && styles.selectedOption]}
							onPress={() => { setLaporPihak('Ya'); setShowOptions(false); }}
						>
							<Text style={styles.optionText}>Ya</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.optionButton, laporPihak === 'Tidak' && styles.selectedOption]}
							onPress={() => { setLaporPihak('Tidak'); setShowOptions(false); }}
						>
							<Text style={styles.optionText}>Tidak</Text>
						</TouchableOpacity>
					</View>
				)}

				<TextInput
					style={styles.input}
					placeholder="Hubungan Pelapor dengan Korban"
					value={statusPelapor}
					onChangeText={setStatusPelapor}
				/>

				<View style={styles.buttonContainer}>
					<Button title="Lapor Kejadian" onPress={handleFastReport} />
				</View>
			</View>
		</ScrollView>
	);
};

// Add styles here


const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'transparent',
		paddingBottom: 0,

	},
	backgroundImage: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	backButton: {
		position: 'absolute',
		top: 40,
		left: 20,
		zIndex: 10,
	},
	backIcon: {
		width: 30,
		height: 30,
	},
	titleContainer: {
		//flex: 1,
		alignItems: 'center', // Memastikan teks terpusat dalam container ini
		paddingTop: 47,
	},
	headerText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center', // Menyelaraskan teks ke tengah
	},
	content: {
		width: '90%',
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		marginTop: 20,
		marginBottom: 20,
	},
	image: {
		width: '100%',
		height: 200,
		resizeMode: 'contain',
	},
	panel: {
		backgroundColor: 'blue',
		padding: 15,
		borderRadius: 5,
		marginBottom: 20,
	},
	panelTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
	input: {
		width: '100%',
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		paddingLeft: 10,
	},
	iconTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		position: 'relative',
	},
	inputWithIcon: {
		flex: 1,
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingLeft: 10,
		paddingRight: 30,
	},
	iconRight: {
		width: 20,
		height: 20,
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [{ translateY: -10 }],
		tintColor: 'blue',
	},
	iconRightCentered: {
		width: 20,
		height: 20,
		tintColor: 'blue',
		alignSelf: 'center',
	},
	touchableIcon: {
		position: 'absolute',
		right: 0,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		width: 40,
	},
	optionText: {
		fontSize: 14,
	},
	optionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 10,
	},
	optionButton: {
		padding: 10,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		width: '45%',
		alignItems: 'center',
	},
	selectedOption: {
		backgroundColor: '#cce7ff',
	},
	buttonContainer: {
		marginTop: 20,
	},
});

export default FastReportScreen;
