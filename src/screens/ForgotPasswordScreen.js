/**
The password restoration screen that allows the user file a request to restore their password
 * @module screen/ForgotPasswordScreen
 * @requires React
 * @requires react-native
 * @requires react-native-gesture-handler
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { useState, memo } from 'react';
import { View, KeyboardAvoidingView, Image } from 'react-native';
import TextInput from '../components/TextInput';
import { emailValidator } from '../core/helpers/validators';
import { sendEmailWithPassword } from '../api/auth-api';
import { ScrollView } from 'react-native-gesture-handler';
import ModeSwitch from '../components/ModeSwitch';
import BackButton from '../components/BackButton';
import { LoadingIndicator } from '../assets/icons/icons';
import {
  Button,
  Text,
  StyleService,
  useStyleSheet,
  Modal,
  Card,
  Layout,
  Spinner,
  useTheme
} from '@ui-kitten/components';

/**
   Renders the reset password screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
 @return {jsx} - The screen
 */

const ForgotPasswordScreen = ({ navigation }) => {
  //the statuses and their setters, statuses re-render the app when changed
  const [email, setEmail] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ value: '', type: '' });
  const styles = useStyleSheet(themedStyles);
  const colors = useTheme();
  

/**
 close the pop up window
* @function _dismissMessage
* @private

*/
  const _dismissMessage = () => {
    setMessage({ type: '', value: '' });
  };

/**
 validate the user inputted email and sends the reset link to the user
* @function _onSendPressed
* @async
* @private
 */

  const _onSendPressed = async () => {
    if (loading) return;

    //get the validation result
    const emailError = emailValidator(email.value);

     //store the entered data error to display to the user
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    //start the resetting process
    setLoading(true);

    //initiate resetting process with the given info
    const response = await sendEmailWithPassword(email.value);

    //if there was an error during the operation, display error
    if (response.error) {
      setMessage({ type: 'danger', value: response.error });
    //otherwise, display success message
    } else {
      setMessage({
        type: 'success',
        value: 'Email with password has been sent.'
      });
    }
    //done
    setLoading(false);
  };

  // what the user will see on their screen (rendering)
  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView>
          <Layout style={styles.top}>
            <Image source={require('../assets/images/31.png')} style={styles.headerImage} />
            <View style={styles.topBar}>
              <BackButton goBack={() => navigation.goBack()} />

              {/* UI mode switch */}
              <ModeSwitch
                moonColor={colors['color-primary-900']}
                sunColor={colors['color-primary-900']}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../assets/images/forget-password.png')}
                style={styles.welcomeImage}
              />
              <Text category="h5" style={styles.title}>
                LOST YOUR PASSWORD?{'\n'}NO PROBLEM!
              </Text>
              <Text category="c1">enter your email and we will send you a link to restore it!</Text>
            </View>
          </Layout>
          {/* reset link form */}
          <View style={styles.formContainer}>
            <TextInput
              label="EMAIL"
              returnKeyType="next"
              value={email.value}
              status={!!email.error ? 'danger' : 'primary'}
              placeholder="mymail@example.com"
              onChangeText={text => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          </View>
          {/* message pop up window */}
          <Modal backdropStyle={styles.backdrop} visible={!!message.value}>
            <Card disabled={true} status={message.returnKeyType}>
              <Text style={{ marginVertical: 20, fontWeight: 'bold' }}>{message.value}</Text>
              <Button status={message.type} onPress={_dismissMessage}>
                OK
              </Button>
            </Card>
          </Modal>
          {/* login option */}
          <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
            <Button size="giant" onPress={_onSendPressed} style={styles.loginButton}>
              {loading ? LoadingIndicator : 'Send me the link'}
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Button appearance="ghost" size="medium" onPress={() => navigation.navigate('Login')}>
                I remembered my password
              </Button>
            </View>
          </Layout>
        </KeyboardAvoidingView>
      </ScrollView>
    </Layout>
  );
};

//styles
const themedStyles = StyleService.create({
  top: {
    alignItems: 'center',
    paddingVertical: 24
  },
  switch: {
    alignSelf: 'flex-start'
  },
  welcomeImage: {
    width: 160,
    height: 160,
    marginBottom: 20
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    marginBottom: -20
  },
  headerImage: {
    width: 700,
    height: 700,
    position: 'absolute',
    top: -350,
    opacity: 0.6
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    marginVertical: 10
  },
  formContainer: {
    paddingHorizontal: 16
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -30
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default memo(ForgotPasswordScreen);
