/**
This component provides a button for navigation to the previous screen
 * @module components/BackButton
 * @requires React
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { memo } from "react";
import { BackArrowIcon } from '../assets/icons/icons';
import { Button } from "@ui-kitten/components";

/**
   returns a navigation button element that allows the user to navigate to the previous page
 * @function
 * @param {Function} goBack - a callback function with navigation specifications
 * @param {String} color -String containing color (rgb, rgba or hex) of the element's icon
   @return {jsx} - jsx React Native element of type Button with the specs provided.
   */

const BackButton = ({ goBack, color }, ...props) => (
  <Button onPress={goBack} accessoryLeft={() => BackArrowIcon(color)} appearance='ghost' {...props} />
);


export default memo(BackButton);
