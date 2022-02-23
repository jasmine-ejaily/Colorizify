/** 
This file contains functions  responsible for dealing with firebase authentication process
 * @module api/auth-api
 * 
 */

import firebase from "firebase/app";
import "firebase/auth";


/**
 * Logs out the current user when called
 * @function
 */

export const logoutUser = () => {
  firebase.auth().signOut();
};


/**
 * calls the registration process done by firebase api
 * @function
 * @async
 * @requires firebase 
 * @param {string} name - the full name of the user
 * @param {string} email - the user's email
 * @param {string} password - the user's password
 * @return {Object} the response object, if empty, then there were no errors during registration.
 */

export const signUpUser = async ({ name, email, password }) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    firebase.auth().currentUser.updateProfile({
      displayName: name
    });
    return {};
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return {
          error: "E-mail already in use."
        };
      case "auth/invalid-email":
        return {
          error: "Invalid e-mail address format."
        };
      case "auth/weak-password":
        return {
          error: "Password is too weak."
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute."
        };
      default:
        return {
          error: "Check your internet connection."
        };
    }
  }
};

/**
 * calls the logging in process done by firebase api
 * @function
 * @async
 * @requires firebase
 * @param {string} email - the user's email
 * @param {string} password - the user's password
 * @return {Object} the response object, if empty, then there were no errors during logging in.
 */

export const loginUser = async ({ email, password }) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return {};
  } catch (error) {
    console.log(error);

    switch (error.code) {
      case "auth/invalid-email":
        return {
          error: "Invalid email address format."
        };
      case "auth/user-not-found":
        return {
          error: "We couldn’t find an account matching the email and password you entered. Please check your email and password and try again."
        };
      case "auth/wrong-password":
        return {
          error: "Your password is incorrect.\nPlease reset your password if you can't remember"
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute."
        };
      default:
        return {
          error: "Check your internet connection."
        };
    }
  }
};

/**
 * calls the password restoration of the user process done by firebase api
 * @function
 * @async
 * @requires firebase
 * @param {string} email - the user's email
 * @return {Object} the response object, if empty, then there were no errors during the process.
 */

export const sendEmailWithPassword = async email => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return {};
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        return {
          error: "Invalid email address format."
        };
      case "auth/user-not-found":
        return {
          error: "User with this email does not exist."
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute."
        };
      default:
        return {
          error: "Check your internet connection."
        };
    }
  }
};
