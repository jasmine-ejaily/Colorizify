/**
This screen is responsible for checking and redirecting if the user is already logged in (session's active) or need to log in.
 * @module screen/AuthLoadingScreen
 * @requires React
 * @requires firebase
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React from 'react';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from '../core/config/fb-config';
import { Layout, Spinner } from '@ui-kitten/components';

//initialize firebase services
firebase.initializeApp(FIREBASE_CONFIG);

/**
   Renders the loading screen at the start of the app
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
   @return {jsx} - The screen
   */

  const AuthLoadingScreen = ({ navigation }) => {
    //check if the user is logged in
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is logged in, redirect to home screen
      navigation.replace('App');
    } else {
      // User is not logged in, redirect to login screen
      navigation.replace('Auth');
    }
  });
// what the user will see on their screen (rendering)
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="giant" status="primary" />
    </Layout>
  );
};

export default AuthLoadingScreen;
