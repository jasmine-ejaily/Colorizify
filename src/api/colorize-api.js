/**
contains functions responsible for getting permissions from device OS
 * @module api/colorize-api
 * @requires deepai
 * @copyright deepai.org

 */
import { setApiKey, callStandardApi } from 'deepai';

setApiKey('08bf09db-b674-470d-b75a-41c8a67f9dbb');// my own api key


/**
 * Sends a request to the colorization model DeOldify, which API is provided by Deepai
 * @function
 * @async
 * @param {String} imageURL - takes the url of the image requested to be colorized
   @return {Promise} a promise that resolve to an object containing the results of the operation. 
   */

const colorize = async (imageURL) => {
  try {
    const response = await callStandardApi("colorizer", {
      image: `${imageURL}`
    });
    return response;

  } catch (e) {
    return e;

  }
};

export default colorize;



