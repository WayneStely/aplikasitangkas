import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './Screen/Splash Screen.js'
import LoginScreen from './Screen/LoginScreen.js'
import SignUpScreen from './Screen/SignUpScreen.js'
import LocationAccess from './Screen/LocationAccess.js'
import HomeScreen from './Screen/HomeScreen.js'
import ChangePassword from './Screen/ChangePassword.js'
import ProfileScreen from './Screen/ProfileScreen.js'
import EmergencyReportScreen from './Screen/EmergencyReportScreen.js'
import FastReportScreen from './Screen/FastReportScreen.js'
import LaporScreen from './Screen/LaporScreen.js'
import MapsScreen from './Screen/MapsScreen.js'
import LaporEmergency from './Screen/LaporEmergency.js'
import HistoryScreen from './Screen/HistoryScreen.js'
import SelectLocationScreen from './Screen/SelectLocationScreen.js'


//import LocationScreen from './src/pages/LocationScreen.js'
//import ClassesScreen from './src/pages/ClassesScreen'
//import QRScannerScreen from './src/pages/QRScannerScreen'
//import ChangePassScreen from './src/pages/ChangePassScreen'
//import StatisticsScreen from './src/pages/StatisticsScreen'
//import TakeAttendanceScreen from './src/pages/TakeAttendanceScreen'
//import NotificationScreen from './src/pages/NotificationScreen'
//import ProfileScreen from './src/pages/ProfileScreen.js'

const Stack = createNativeStackNavigator();

const App = () => {
  return (

    //< LocationScreen />


    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocationAccess" component={LocationAccess} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmergencyReportScreen" component={EmergencyReportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FastReportScreen" component={FastReportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LaporScreen" component={LaporScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MapsScreen" component={MapsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LaporEmergency" component={LaporEmergency} options={{ headerShown: false }} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} options={{ headerShown: false }} />

        {/* <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="ClassesScreen" component={ClassesScreen} options={{headerShown: false}} />
            <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} options={{headerShown: false}} />
            <Stack.Screen name="ChangePassScreen" component={ChangePassScreen} options={{headerShown: false}} />
            <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} options={{headerShown: false}} />
            <Stack.Screen name="TakeAttendanceScreen" component={TakeAttendanceScreen} options={{headerShown: false}} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{headerShown: false}} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false}} />
            <Stack.Screen name="LocationScreen" component={LocationScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default App;