import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert } from 'react-native';

// Icon URLs
const eyeIconUrl = 'https://tangkas.web.id/tangkas/images/eye%20of.png';
const backIconUrl = 'https://tangkas.web.id/tangkas/images/back.png';
const logoUrl = 'https://tangkas.web.id/tangkas/images/logo_tangkas_2.png';

const ChangePasswordScreen = ({ navigation, route }) => {

	const parsedData = route?.params?.parsedData || [];

	console.log("INI VIEW DATA DARI CHANGEPASSWORD:\n");
	console.log(parsedData);

	const [old_password, setold_password] = useState('');
	const [new_password, setnew_password] = useState('');
	const [confirm_password, setconfirm_password] = useState('');
	const [showold_password, setShowold_password] = useState(false);
	const [shownew_password, setShownew_password] = useState(false);
	const [showconfirm_password, setShowconfirm_password] = useState(false);


	const toggleold_passwordVisibility = () => {
		setShowold_password(!showold_password);
	};

	const togglenew_passworddVisibility = () => {
		setShownew_password(!shownew_password);
	};

	const toggleconfirm_passworddVisibility = () => {
		setShowconfirm_password(!showconfirm_password);
	};

	const handleChangePassword = async () => {

		const data_old_password = "" + old_password.trim();
		const data_new_password = "" + new_password.trim();
		const data_confirm_password = "" + confirm_password.trim();
		const data_id = "" + parsedData[0].id;



		//Alert.alert('-----', "" + data_confirm_password.trim());

		// Validate fields
		if (!old_password && !new_password && !confirm_password) {
			Alert.alert('All Field Empty', 'All fields must be filled.');
			return;
		}

		if (!old_password) {
			Alert.alert('Empty Field', 'Old password must be filled.');
			return;
		}
		if (!new_password) {
			Alert.alert('Empty Field', 'New password must be filled.');
			return;
		}
		if (!confirm_password) {
			Alert.alert('Empty Field', 'Confirm password must be filled.');
			return;
		}
		if (new_password != confirm_password) {
			Alert.alert('password different', 'please, check your new password.');
			return;
		}


		// Prepare request body
		const requestBody = {
			'old_password': data_old_password,
			'new_password': data_new_password,
			'confirm_password': data_confirm_password,
			'id': data_id,
		};

		// Timeout function for the request
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, 5000);
		});

		try {
			const response = await Promise.race([
				fetch('https://tangkas.web.id/myapp/public/mobile/changePassword', {
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
			if (result === 'CHANGE PASSWORD SUCCESS') {
				Alert.alert('Success', 'Password has been successfully change.');
				navigation.navigate('LoginScreen', { parsedData });

			}
			if (result === 'CHANGE PASSWORD FAILED') {
				Alert.alert('FAILED', 'Sorry, your Password cannot be changed.');

			}
			if (result === 'INVALID REQUEST METHOD') {
				Alert.alert('WRONG REQUEST', 'Sorry, you cannot request using this method.');

			}

			if (result === 'PASSWORD MUST BE THE SAME') {
				Alert.alert('PASSWORD MUST BE THE SAME', 'Sorry, your Password must be the same.');

			}
		} catch (error) {
			Alert.alert('Error', error.message);
		}


	};

	return (
		<ImageBackground source={{ uri: 'https://tangkas.web.id/tangkas/images/mobile_bg.png' }} style={styles.background}>
			<View style={styles.container}>
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<Image source={{ uri: backIconUrl }} style={styles.backIcon} />
				</TouchableOpacity>
				{/* Added Logo Here */}
				<Image source={{ uri: logoUrl }} style={styles.logo} />
				<Text style={styles.title}>SELECT YOUR NEW PASSWORD</Text>
				<View style={styles.inputContainer}>
					<View style={styles.inputWrapper}>
						<TextInput
							style={styles.input}
							placeholder="old_password"
							secureTextEntry={!showold_password}
							value={old_password}
							onChangeText={setold_password}
						/>
						<TouchableOpacity onPress={toggleold_passwordVisibility}>
							<Image source={{ uri: eyeIconUrl }} style={styles.eyeIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.inputWrapper}>
						<TextInput
							style={styles.input}
							placeholder="new_password"
							secureTextEntry={!shownew_password}
							value={new_password}
							onChangeText={setnew_password}
						/>
						<TouchableOpacity onPress={togglenew_passworddVisibility}>
							<Image source={{ uri: eyeIconUrl }} style={styles.eyeIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.inputWrapper}>
						<TextInput
							style={styles.input}
							placeholder="confirm_password"
							secureTextEntry={!showconfirm_password}
							value={confirm_password}
							onChangeText={setconfirm_password}
						/>
						<TouchableOpacity onPress={toggleconfirm_passworddVisibility}>
							<Image source={{ uri: eyeIconUrl }} style={styles.eyeIcon} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.button} onPress={handleChangePassword}>
						<Text style={styles.buttonText}>Change Password</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	backButton: {
		position: 'absolute',
		top: 40,
		left: 20,
	},
	backIcon: {
		width: 24,
		height: 24,
	},
	logo: {
		width: 100, // Adjust width as needed
		height: 100, // Adjust height as needed
		marginBottom: 20, // Space between logo and title
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 20,
	},
	inputContainer: {
		width: '100%',
	},
	inputWrapper: {
		marginBottom: 15,
	},
	input: {
		backgroundColor: '#ffffff', // Set background color to white
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
	},
	eyeIcon: {
		width: 24,
		height: 24,
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
});

export default ChangePasswordScreen;
