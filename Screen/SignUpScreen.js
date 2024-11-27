import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = ({ navigation }) => {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [nik, setNik] = useState('');
	const [address, setAddress] = useState('');
	const [gender, setGender] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [rePassword, setRePassword] = useState('');

	const handleSignup = async () => {
		if (!fullName.trim() || !email.trim() || !nik.trim() || !address.trim() || !gender || !phoneNumber.trim() || !password.trim() || !rePassword.trim()) {
			Alert.alert('Error', 'All fields must be filled.');
			return;
		}

		if (password !== rePassword) {
			Alert.alert('Error', 'Passwords do not match.');
			return;
		}

		if (nik.length !== 16 || isNaN(nik) || nik.trim() === '') {
			Alert.alert('Error', 'NIK harus terdiri dari 16 karakter angka dan tidak boleh kosong.');
			return;
		}

		if (phoneNumber.length !== 13 || isNaN(phoneNumber) || phoneNumber.trim() === '') {
			Alert.alert('Error', 'Nomor telepon harus terdiri dari 12 digit angka dan tidak boleh kosong.');
			return;
		}

		if (email.trim() === '') {
			Alert.alert('Error', 'Email tidak boleh kosong.');
			return;
		}

		if (fullName.trim() === '') {
			Alert.alert('Error', 'Nama lengkap tidak boleh kosong.');
			return;
		}

		if (!/^[a-zA-Z\s]+$/.test(fullName)) {
			Alert.alert('Error', 'Nama lengkap hanya boleh berisi huruf sesuai KTP atau kartu keluarga.');
			return;
		}



		const requestBody = {
			'input-fullname': fullName,
			'input-email': email,
			'input-nik': nik,
			'input-address': address,
			'input-gender': gender,
			'input-phone-number': phoneNumber,
			'input-password': password,
			'input-retype-password': password,
			'input-role': 'masyarakat'
		};

		try {
			const response = await fetch('https://tangkas.web.id/myapp/public/mobile/regis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: Object.keys(requestBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestBody[key])}`).join('&')
			});

			const statusregist = await response.text();

			switch (statusregist) {
				case 'DUPLICATE USER':
					Alert.alert('Signup Failed', 'This user already exists. Please try with a different email.');
					break;
				case 'REGISTER SUCCESS':
					Alert.alert('Signup Success', 'Your account has been created.');
					navigation.navigate('LoginScreen');
					break;
				case 'REGISTER FAILED':
					Alert.alert('Signup Failed', 'There was a problem creating your account. Please try again.');
					break;
				default:
					Alert.alert('Error', 'An unexpected response was received from the server.');
			}

		} catch (error) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image
				source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
				style={styles.backgroundImage}
			/>
			<Image
				source={{ uri: 'https://tangkas.web.id/tangkas/images/logo_tangkas_2.png' }}
				style={styles.logo}
			/>

			<View style={styles.formContainer}>
				<Text style={styles.title}>Sign Up</Text>

				<TextInput
					style={styles.input}
					placeholder="Full Name"
					placeholderTextColor="#666"
					value={fullName}
					onChangeText={setFullName}
				/>
				<TextInput
					style={styles.input}
					placeholder="Email"
					keyboardType="email-address"
					placeholderTextColor="#666"
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					style={styles.input}
					placeholder="NIK"
					keyboardType="numeric"
					placeholderTextColor="#666"
					value={nik}
					onChangeText={setNik}
				/>
				<TextInput
					style={styles.input}
					placeholder="Address"
					placeholderTextColor="#666"
					value={address}
					onChangeText={setAddress}
				/>

				<View style={styles.pickerContainer}>
					<Picker
						selectedValue={gender}
						onValueChange={(itemValue) => setGender(itemValue)}
						style={styles.picker}
					>
						<Picker.Item label="Female" value="Female" />
						<Picker.Item label="Male" value="Male" />
					</Picker>
				</View>

				<TextInput
					style={styles.input}
					placeholder="Phone Number"
					keyboardType="phone-pad"
					placeholderTextColor="#666"
					value={phoneNumber}
					onChangeText={setPhoneNumber}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					secureTextEntry
					placeholderTextColor="#666"
					value={password}
					onChangeText={setPassword}
				/>
				<TextInput
					style={styles.input}
					placeholder="Re-enter Password"
					secureTextEntry
					placeholderTextColor="#666"
					value={rePassword}
					onChangeText={setRePassword}
				/>

				<TouchableOpacity style={styles.button} onPress={handleSignup}>
					<Text style={styles.buttonText}>Create Account</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
					<Text style={styles.buttonText}>Go back to Login</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 20,
		resizeMode: 'contain',
	},
	formContainer: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		padding: 20,
		borderRadius: 10,
		width: '85%',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
		color: '#000',
	},
	input: {
		height: 50,
		backgroundColor: '#fff',
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 15,
		paddingHorizontal: 10,
	},
	pickerContainer: {
		height: 50,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 15,
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	picker: {
		width: '100%',
	},
	button: {
		backgroundColor: '#002D72',
		paddingVertical: 15,
		borderRadius: 8,
		marginBottom: 15,
	},
	buttonText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 18,
	},
});

export default SignUpScreen;
