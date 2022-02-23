/**
contains functions responsible for validating auth forms
 * @module helpers/validators
 *
 */

//Names structure schema
const NRe = /^[a-z]+$/i;


/**
 * Validate the email format inputted by the user
 * @function
 * @param {String} email - the email inputted by the user
 * @return {String} The message containing the invalidation in the email inputted.
 */

export const emailValidator = email => {
  //email structure schema
  const Ere = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Email cannot be empty.";
  if (!Ere.test(email)) return "Sorry, the email is invalid";

  return "";
};

/**
 * Validate the password format inputted by the user
 * @function
 * @param {String} password - the password inputted by the user
 * @return {String} The message containing the invalidation in the password inputted.
 */

export const passwordValidator = password => {
  if (!password || password.length <= 0) return "Password cannot be empty.";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
};

/**
 * Validate the first name format inputted by the user
 * @function
 * @param {String} firstName - the first name inputted by the user
 * @return {String} The message containing the invalidation in the first name inputted.
 */


export const firstNameValidator = firstName => {
  if (!firstName || firstName.length <= 0) return "First name cannot be empty.";
  if (!NRe.test(firstName)) return "First name should only contain letters";
  if (firstName.length > 35) return "maximum characters exceeded";
  return "";
};

/**
 * Validate the last name format inputted by the user
 * @function
 * @param {String} lastName - the last name inputted by the user
 * @return {String} The message containing the invalidation in the last name inputted.
 */

export const lastNameValidator = lastName => {
  if (!lastName || lastName.length <= 0) return "Last name cannot be empty.";
  if (!NRe.test(lastName)) return "Last name should only contain letters";
  if (lastName.length > 100) return "maximum characters exceeded";

  return "";
};