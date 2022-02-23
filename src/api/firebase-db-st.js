/**
This file contains functions responsible for dealing with firebase database CRUD
 * @module api/firebase-database-storage
 *
 */
import * as firebase from 'firebase';

/**
 * calls upload the image to firebase storage as a temporally repository
 * @function
 * @async
 * @copyright expo.io
 * @requires firebase
 * @param {string} uri - the file path of the image uploaded from user device
 * @param {string} uid - the id of the user currently logged in
 * @return {String} The image url in firebase storage 
 */


export const uploadImageAsync = async (uri, uid) => {
  const rand = Math.floor(Math.random() * 99999);// ise random numbering to have a variation in the names of the images, since all of them have the same user id

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
//upload to firebase storage
  const ref = firebase.storage().ref().child(`/users/${uid}/images/${uid}-${rand}`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return await snapshot.ref.getDownloadURL();
};


/**
 * Adds the image object to firebase database
 * @function
 * @async
 * @requires firebase
 * @param {string} imageURL - the colorized image url (mostly from firebase storage )
 * @param {string} uid - the id of the user currently logged in
 * @param {string} id - the id of colorized image (provided by the colorization api)
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

export const addImageToDB = async (imageURL, uid, id) => {
  await firebase.database().ref(`/users/${uid}/images`).push({ id: id, image: imageURL });
};

/**
 * removes the image object / node from firebase database
 * @function
 * @async
 * @requires firebase
 * @param {string} uid - the id of the user currently logged in
 * @param {string} id - the id of image object / node
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

export const removeImageFromDB = async (uid, id) => {
  await firebase.database().ref(`/users/${uid}/images/${id}`).remove();
};

