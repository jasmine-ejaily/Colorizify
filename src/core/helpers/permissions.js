/**
contains functions responsible for getting permissions from device OS
 * @module helpers/permissions
 *
 */
import * as Permissions from 'expo-permissions';


/**
 * fires the permission request module of the OS for opening the camera
 * @function
 * @async
 * @requires expo-permissions
 * @return {Boolean} a boolean determining the result of the permission request.
 */

export const getCPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status === 'granted';
};



/**
 * fires the permission request module of the OS for accessing the storage
 * @function
 * @async
 * @requires expo-permissions
 * @return {Boolean} a boolean determining the result of the permission request.
 */

export const getCRollPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  return status === 'granted';
};