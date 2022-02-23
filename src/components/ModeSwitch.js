/**
This component provides a switch for UI theme toggle, dark and light
 * @module components/ModeSwitch
 * @requires React
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */
import React, { memo, useContext } from 'react';
import { Button } from '@ui-kitten/components';
import { SunIcon, MoonIcon } from '../assets/icons/icons';
import { ThemeContext } from '../core/config/theme-context';


/**
   Returns a switch element that allows the user to switch between dark and light theme
 * @function
 * @param {Object} props - a props object containing attributes provided by the element using it
   @return {jsx} - jsx React Native element of type Button with the specs provided.
   */


const ModeSwitch = (props) => {
  const { theme, toggleTheme } = useContext(ThemeContext); //get current theme and theme toggle function 
  const mode = theme === 'dark' ? true : false;

  return (
    <Button {...props}
      onPress={toggleTheme}
      appearance="ghost"
      accessoryLeft={mode ? () => SunIcon(props.sunColor) : () => MoonIcon(props.moonColor)}
    />
  );
};

export default memo(ModeSwitch);