/**
This component provides a Text input element that can display errors.
 * @module components/TextInput
 * @requires React
 * @requires ui-kitten/components
 * @requires react-native
 * @author Yasmin Magdi Fahmi
 */
import React, { memo } from "react";
import { Text, View } from "react-native";
import { Input, StyleService, useStyleSheet } from '@ui-kitten/components';

/**
   Returns a Text Input element that displays error in inputs to the user
 * @function
 * @param {String} errorText - error returned from the validation module regarding this input
 * @param {Object} props - the rest of the attributes provided by the parent element
   @return {jsx} - jsx React Native element of type Input with the specs provided.
   */

const TextInput = ({ errorText, ...props }) => {
  const styles = useStyleSheet(themedStyles);// use the theme stylesheet
  return (
    <View style={{ marginBottom: 25 }}>
      <Input
        {...props}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const themedStyles = StyleService.create({
  error: {
    fontSize: 14,
    color: 'color-danger-500',
    paddingHorizontal: 4,
    paddingTop: 4,

  }
});

export default memo(TextInput);
