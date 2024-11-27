import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
	const [role, setRole] = useState('Admin'); // Default role is Admin
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// fungsi untuk login proses
	const handleLogin = async () => {

		// check if email and password are not empty or only spaces
		if (!email.trim() && !password.trim()) {
			Alert.alert('Error Message', 'Input email and password fields cannot be empty or contain only spaces.');
			return;
		}

		if (!email.trim()) {
			Alert.alert('Error Message', 'Input email field cannot be empty or contain only spaces.');
			return;
		}

		if (!password.trim()) {
			Alert.alert('Error Message', 'Input password field cannot be empty or contain only spaces.');
			return;
		}

		// create request body with email and password input values
		const requestBody = {
			'input-role': 'Masyarakat',
			'Input-email': email,
			'input-password': password
		};

		// Time out request data
		const timeoutPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, 5000); // 5000 (5 detik)
		});

		Promise.race([
			fetch('https://tangkas.web.id/myapp/public/mobile/login', {
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
				console.log("INI VIEW DATA DARI LOGIN SCREEN:\n");
				// handle response data
				console.log(textData);
				//Alert.alert('Login Success', 'Login proses berhasil.');

				// check if textData contains "ERROR"
				try {
					const parsedData = JSON.parse(textData);
					if (Array.isArray(parsedData) && parsedData.length === 0) {
						// handle empty array case
						Alert.alert('Login Failed', 'Maaf, proses login anda gagal. Coba lagi.');
						return;
					} else {
						console.log(parsedData);

						Alert.alert('Login Success', 'Welcome to tangkap kekerasan seksual system.');

						// redirect to HomeScreen on successful login and pass textData as parameter
						navigation.navigate('HomeScreen', { parsedData });
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
	};


	return (
		<ImageBackground
			source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }}
			style={styles.backgroundImage}
		>
			<View style={styles.logoContainer}>
				<Image
					source={{ uri: 'https://tangkas.web.id/tangkas/images/logo_tangkas_2.png' }}
					style={styles.logo}
				/>
			</View>
			<View style={styles.loginContainer}>
				<Text style={styles.welcomeText}>Welcome</Text>
				<View style={styles.inputContainer}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/user.png' }}
						style={styles.icon}
					/>
					<TextInput
						placeholder="Email"
						style={styles.input}
						placeholderTextColor="#999"
						value={email}
						onChangeText={setEmail}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Image
						source={{ uri: 'https://tangkas.web.id/tangkas/images/eye2.png' }}
						style={styles.icon}
					/>
					<TextInput
						placeholder="Password"
						style={styles.input}
						placeholderTextColor="#999"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
				</View>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={handleLogin}
				>
					<Text style={styles.loginButtonText}>Login</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
					<Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

// Your styles remain the same

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
	},
	loginContainer: {
		width: '80%',
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
	icon: {
		width: 30,
		height: 30,
		marginRight: 10,
		tintColor: 'black', // This line sets the icon color to black
	},
	input: {
		flex: 1,
	},
	loginButton: {
		width: '100%',
		backgroundColor: '#173A66',
		borderRadius: 5,
		padding: 15,
		alignItems: 'center',
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	signUpText: {
		marginTop: 20,
		fontSize: 14,
		color: '#000',
	},
	signUpLink: {
		color: '#173A66',
		fontWeight: 'bold',
	},
});

export default LoginScreen;
