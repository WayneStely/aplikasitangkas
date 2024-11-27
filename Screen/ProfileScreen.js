import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Image,
	ScrollView,
	ImageBackground,
	TouchableOpacity,
	Alert
} from 'react-native';

const ProfileScreen = ({ navigation, route }) => {
	const parsedData = route?.params?.parsedData || [];

	console.log("INI VIEW DATA DARI PROFILE:\n");
	console.log(parsedData);

	// Fungsi untuk memperbarui elemen JSON
	updateElement = (key, value) => {
		this.setState({
			parsedData: {
				...this.state.parsedData,  // Spread untuk menjaga data lama
				[key]: value    // Update key yang spesifik
			}
		});
	};

	// State untuk form input
	const [full_name, setfull_name] = useState(parsedData[0]?.full_name || '');
	const [no_hp, setno_hp] = useState(parsedData[0]?.no_hp || '');
	const [email, setEmail] = useState(parsedData[0]?.email || '');
	const [alamat, setAlamat] = useState(parsedData[0]?.alamat || '');
	const [gender, setGender] = useState(parsedData[0]?.gender || '');
	const [nik, setNik] = useState(parsedData[0]?.nik || '');
	const [id, setid] = useState(parsedData[0]?.id || '');

	// Fungsi untuk submit perubahan profil
	const handleProfileUpdate = async () => {
		// Validasi input form
		if (!full_name.trim() || !no_hp.trim() || !email.trim() || !alamat.trim() || !gender.trim() || !nik.trim()) {
			Alert.alert('Error', 'Semua field harus diisi.');
			return;
		}

		// Membuat body request
		const requestBody = {
			'user_name': full_name,
			'user_address': alamat,
			'user_phone': no_hp,
			'user_email': email,
			'user_gender': gender,
			'user_nik': nik,
			'id': id,

			// alamat,
			// created_at: new Date().toISOString(),
			// email,
			// full_name: namaLengkap,
			// gender,
			// id: parsedData[0]?.id,
			// nik,
			// no_hp: nomorTelp,
			// password: parsedData[0]?.password,
			// profile_pict: parsedData[0]?.profile_pict || '',
			// role: parsedData[0]?.role,
			// username: parsedData[0]?.username
		};

		// Timeout function untuk request
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, 5000);
		});

		try {
			const response = await Promise.race([
				fetch('https://tangkas.web.id/myapp/public/mobile/updateProfile', {
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

			// Menangani hasil respon
			if (result === 'SUCCESS UPDATE') {
				Alert.alert('Success', 'Profil berhasil diperbarui.');

				//update data redux
				parsedData[0].full_name = full_name;
				parsedData[0].email = email;
				parsedData[0].nik = nik;
				parsedData[0].no_hp = no_hp;
				parsedData[0].alamat = alamat;
				parsedData[0].gender = gender;
				parsedData[0].alamat = alamat;

				// untuk natigasi
				navigation.navigate('HomeScreen', { parsedData });
			} else {
				Alert.alert('Update Failed', 'Gagal memperbarui profil.');
			}

		} catch (error) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.background}
		>
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				{/* Tombol Back */}
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/back.png' }}
						style={styles.backIcon}
					/>
				</TouchableOpacity>

				{/* Bagian Header */}
				<View style={styles.header}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/logo-profile.png' }}
						style={styles.profileImage}
					/>
					<Text style={styles.profileName}>Hai, {parsedData[0]?.full_name || 'User'}</Text>
				</View>

				{/* Bagian Form */}
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholder="full_name"
						value={full_name}
						onChangeText={setfull_name}
					/>
					<TextInput
						style={styles.input}
						placeholder="no_hp"
						value={no_hp}
						onChangeText={setno_hp}
						keyboardType="phone-pad"
					/>
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
					/>
					<TextInput
						style={styles.input}
						placeholder="Alamat"
						value={alamat}
						onChangeText={setAlamat}
					/>
					<TextInput
						style={styles.input}
						placeholder="Gender"
						value={gender}
						onChangeText={setGender}
					/>
					<TextInput
						style={styles.input}
						placeholder="NIK"
						value={nik}
						onChangeText={setNik}
						keyboardType="number-pad"

					/>
					<TextInput
						style={styles.input}
						placeholder="id"
						value={id}
						onChangeText={setid}
						keyboardType="number-pad"

					/>


					{/* Tombol Submit */}
					<TouchableOpacity style={styles.submitButton} onPress={handleProfileUpdate}>
						<Text style={styles.submitButtonText}>Edit Profile</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
	container: {
		flexGrow: 1,
		padding: 20,
	},
	backButton: {
		position: 'absolute',
		top: 50, // Menyesuaikan posisi sesuai dengan layout
		left: 20,
		zIndex: 10, // Agar tombol back muncul di atas elemen lainnya
	},
	backIcon: {
		width: 30,
		height: 30,
	},
	header: {
		alignItems: 'center',
		marginBottom: 20,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
	},
	profileName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 20,
	},
	form: {
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparansi pada background form
		padding: 20,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	input: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 10,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: '#fff',
	},
	submitButton: {
		backgroundColor: '#007bff', // Warna biru
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default ProfileScreen;
