/**
The log in screen that allows the user to sign into the app
 * @module screen/LoginScreen
 * @requires React
 * @requires react-native
 * @requires react-native-gesture-handler
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { useState, memo } from 'react';
import { View, KeyboardAvoidingView, Image } from 'react-native';
import TextInput from '../components/TextInput';
import { emailValidator, passwordValidator } from '../core/helpers/validators';
import { loginUser } from '../api/auth-api';
import { ScrollView } from 'react-native-gesture-handler';
import ModeSwitch from '../components/ModeSwitch';
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
   Renders the login screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
   @return {jsx} - The screen
   */

const LoginScreen = ({ navigation }) => {
    //the statuses and their setters, statuses re-render the app when changed
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //theme manager
  const styles = useStyleSheet(themedStyles);
  const colors = useTheme();
/**
   display's the spinner when called
 * @function LoadingIndicator
 * @private
 * @returns {jsx} loading's spinner
   */

  const LoadingIndicator = () => (
    <View style={styles.indicator}>
      <Spinner size="small" status="control" />
    </View>
  );

/**
   validate the user inputted information and login the user into the app
 * @function _onLoginPressed
 * @async
 * @private
   */

  const _onLoginPressed = async () => {
    if (loading) return;
    //get the validation result
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

     //store the entered data errors to display to the user
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    //start the logging in process
    setLoading(true);
    //initiate log in with the given info
    const response = await loginUser({
      email: email.value,
      password: password.value
    });
    //if there was an error during the operation, display error
    if (response.error) {
      setError(response.error);
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
              {/* UI mode switch */}
              <ModeSwitch
                moonColor={colors['color-primary-900']}
                sunColor={colors['color-primary-900']}
                style={styles.switch}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../assets/images/welcome-hand.png')}
                style={styles.welcomeImage}
              />
              <Text category="h6" style={{ fontWeight: 'bold', marginBottom: 10 }}>
                WELCOME BACK ♥
              </Text>
              <Text category="c1">
                It's time to bring your old pics to{' '}
                <Text status="primary" style={{ fontWeight: 'bold' }}>
                  Life!{' '}
                </Text>
              </Text>
            </View>
          </Layout>
          {/* log in form */}
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
            <TextInput
              label="PASSWORD"
              returnKeyType="done"
              status={!!password.error ? 'danger' : 'primary'}
              value={password.value}
              onChangeText={text => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          {/* forgot password button */}
          <View style={styles.forgotPassword}>
            <Button
              appearance="ghost"
              status="primary"
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot your password?
            </Button>
          </View>
          {/* the error pop up window*/}
          <Modal backdropStyle={styles.backdrop} visible={!!error}>
            <Card disabled={true} status='danger'>
              <Text style={{ marginVertical: 20, fontWeight: 'bold' }}>{error}</Text>
              <Button status="danger" onPress={() => setError('')}>
                OK
              </Button>
            </Card>
          </Modal>
          {/* registration option */}
          <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
            <Button size="giant" onPress={_onLoginPressed} style={styles.loginButton}>
              {loading ? LoadingIndicator : 'Login'}
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text appearance="hint">Not a Member?</Text>
              <Button
                appearance="ghost"
                size="medium"
                onPress={() => navigation.navigate('Register')}>
                Register now!
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
    width: 150,
    height: 160,
    marginBottom: 20
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 5,
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
  }
});

export default memo(LoginScreen);
