/** 
contains functions responsible for dealing with I/O operations of the application
 * @module helpers/IO
 * 
 */
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

//~~~~~~~~~~~~~~~~~
//input operations
//~~~~~~~~~~~~~~~~~

/**
 * Calls the system UI for selecting images from device's storage
 * @function
 * @async
 * @requires expo-image-picker 
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,//allows cropping the image
    aspect: [1, 1],

  });
  return result;
};

/**
 * Calls the system camera
 * @function
 * @async
 * @requires expo-image-picker 
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

export const takePhoto = async () => {
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3 //compresses the image captured
  });
  return result;
};

//~~~~~~~~~~~~~~~
//output operations
//~~~~~~~~~~~~~~~


/**
 * Downloads the image to the device storage.
 * @function
 * @async
 * @param {String} imageUri - the url of the image requested for download
 * @param {String} id - the id of the image (returned by the colorization api)
 * @requires expo-file-system 
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

export const downloadFile = async (imageUrl, id) => {
  const uri = `${imageUrl}`;
  let fileUri = FileSystem.documentDirectory + id + '.png';
  await FileSystem.downloadAsync(uri, fileUri)
    .then(async ({ uri }) => {
      await saveFile(uri)
        .catch((e) => e);
    })
    .catch(error => {
      return error;
    });
};

/**
 * Saves the file downloaded to the 'downloads' folder in the device's storage
 * @function
 * @private
 * @async
 * @param {String} fileUri - the file uri (location, name of the file and file extension)
 * @requires expo-media-library 
 * @return {Promise} a promise that resolve to an object containing the results of the operation.
 */

const saveFile = async fileUri => {
  const asset = await MediaLibrary.createAssetAsync(fileUri);
  await MediaLibrary.createAlbumAsync('Download', asset, false);
};