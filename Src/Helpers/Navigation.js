import React from 'react';
import { createNativeStackNavigator }
    from '@react-navigation/native-stack';

import SplashScreen from '../Screens/SplashScreen';
import HomeScreen from '../Screens/HomeScreen';
import ModeSelectionScreen from '../Screens/ModeSelectionScreen';
import GameScreen from '../Screens/GameScreen';
import PauseScreen from '../Screens/PauseScreen';
import GameOverScreen from '../Screens/GameOverScreen';
import ResultsScreen from '../Screens/ResultsScreen';
import SettingsScreen from '../Screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="ModeSelectionScreen" component={ModeSelectionScreen}/>
            <Stack.Screen name="GameScreen" component={GameScreen}/>
            <Stack.Screen name="PauseScreen" component={PauseScreen}/>
            <Stack.Screen name="GameOverScreen" component={GameOverScreen}/>
            <Stack.Screen name="ResultsScreen" component={ResultsScreen}/>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Stack.Navigator>
    );
};

export default StackNavigator;
