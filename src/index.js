/**
The main navigator of the app, allow navigation between screens
 * @module Navigator
 * @requires React
 * @requires react-native
 * @requires eva-design/eva
 * @requires react-navigation/stack
 * @requires react-navigation/bottom-tabs
 * @requires react-navigation/native
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { memo } from 'react';
import { StatusBar } from 'react-native';
import * as eva from '@eva-design/eva';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry, BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { ThemeContext } from './core/config/theme-context';
import { default as customTheme } from './assets/theme/theme.json';
//app's screens
import {
  HomeScreen,
  UserProfileScreen,
  LoginScreen,
  ForgotPasswordScreen,
  ImageDetailsScreen,
  RegisterScreen,
  AuthLoadingScreen
} from './screens';
import { PersonIcon, BrushIcon } from './assets/icons/icons';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

/**
   Returns a Bottom navigator element (stylized) that allow switching between two views on the same screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
 * @param {Object} state - properties of the bottom tabs provided by the navigator
   @return {jsx} - jsx React Native element of type Bottom Navigator with the specs provided.
   */

const BotNav = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
      {/* home screen */}
    <BottomNavigationTab title="Colorize!" icon={BrushIcon} />
    {/* user profile screen */}
    <BottomNavigationTab title="Profile" icon={PersonIcon} />
  </BottomNavigation>
);

/**
   Returns a stack containing main inner screens of the app, displayed as bottom tabs
 * @function
navigator
   @return {jsx} - jsx React Native element of type Bottom Navigator with the specs provided.
   */

const AppStack = () => (
  <BottomTab.Navigator tabBar={props => <BotNav {...props} />}>
    <BottomTab.Screen name="Colorize" component={HomeScreen} />
    <BottomTab.Screen name="Profile" component={UserProfileScreen} />
  </BottomTab.Navigator>
);

/**
   Returns a stack containing Auth screens of the app, with ability for the navigator to switch between
 * @function
navigator
   @return {jsx} - jsx React Native element of type Stack with the specs provided.
   */

const AuthStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

/**
   Main navigator, responsible for navigation within the app screens.
 * @function
navigator
   @return {jsx} - The whole app.
   */

const App = () => {
  //theme manager
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
   
  };
  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={{ ...eva[theme], ...customTheme }}>
          {/* app status bar color and theme */}
          <StatusBar
            backgroundColor={theme === 'light' ? 'white' : '#2a2244'}
            barStyle={`${theme === 'light' ? 'dark' : 'light'}-content`}
          />
          {/* app's screens */}
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Loading" component={AuthLoadingScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="App" component={AppStack} />
            <Stack.Screen name="ImageDetail" component={ImageDetailsScreen} />
          </Stack.Navigator>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};

export default memo(App);
