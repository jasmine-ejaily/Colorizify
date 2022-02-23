/**
The registration screen that allows the user to sign up the app
 * @module screen/RegisterScreen
 * @requires React
 * @requires react-native
 * @requires react-native-gesture-handler
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { useState, memo } from 'react';
import { View, KeyboardAvoidingView, Image } from 'react-native';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import ModeSwitch from '../components/ModeSwitch';
import {
  emailValidator,
  passwordValidator,
  firstNameValidator,
  lastNameValidator
} from '../core/helpers/validators';
import { alertIcon } from '../assets/icons/icons';
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
import { signUpUser } from '../api/auth-api';
import { ScrollView } from 'react-native-gesture-handler';

/**
   Renders the Register screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
 @return {jsx} - The screen
 */

const RegisterScreen = ({ navigation }) => {
  //the statuses and their setters, statuses re-render the app when changed
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
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
   validate the user inputted information and adds the user to the database
 * @function _onSignUpPressed
 * @async
 * @private
   */

  const _onSignUpPressed = async () => {
    if (loading) return;

    //get the validation result
    const firstNameError = firstNameValidator(firstName.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

     //store the entered data errors to display to the user
    if (emailError || passwordError || firstNameError || lastNameError) {
      setFirstName({ ...firstName, error: firstNameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    //start the registration operation
    setLoading(true);

    //initiate registration process with the given info
    const response = await signUpUser({
      //combine into full name
      name: `${firstName.value} ${lastName.value}`,
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
    <Layout style={{ flex: 1 }} level="1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView>
          <Layout style={styles.top}>
            <Image source={require('../assets/images/31.png')} style={styles.headerImage} />
            <View style={styles.topBar}>
              <BackButton
                color={colors['color-primary-900']}
                goBack={() => navigation.navigate('Login')}
              />
              {/* UI mode switch */}
              <ModeSwitch
                moonColor={colors['color-primary-900']}
                sunColor={colors['color-primary-900']}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/images/sign-up.png')} style={styles.welcomeImage} />
              <Text category="h5" style={{ fontWeight: 'bold', marginBottom: 10 }}>
                HELLO THERE ♥
              </Text>
              <Text category="c1">
                Sign up now and start{' '}
                <Text status="primary" style={{ fontWeight: 'bold' }}>
                  colorizifying{' '}
                </Text>
                your old photos!
              </Text>
            </View>
          </Layout>
          {/* registration form */}
          <View style={styles.formContainer}>
            <TextInput
              value={firstName.value}
              label="FIRST NAME"
              returnKeyType="next"
              placeholder="Ada"
              status={!!firstName.error ? 'danger' : 'primary'}
              onChangeText={text => setFirstName({ value: text, error: '' })}
              error={!!firstName.error}
              errorText={firstName.error}
            />
            <TextInput
              value={lastName.value}
              label="LAST NAME"
              returnKeyType="next"
              placeholder="Lovelace"
              status={!!lastName.error ? 'danger' : 'primary'}
              onChangeText={text => setLastName({ value: text, error: '' })}
              error={!!lastName.error}
              errorText={lastName.error}
            />
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
              caption="Should contain at least 8 characters"
              captionIcon={alertIcon}
              onChangeText={text => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              autoCapitalize="none"
            />
            {/* the error pop up window*/}
            <Modal backdropStyle={styles.backdrop} visible={!!error}>
              <Card disabled={true} status='danger'>
                <Text style={{ marginVertical: 20, fontWeight: 'bold' }}>{error}</Text>
                <Button status="danger" onPress={() => setError('')}>
                  OK
                </Button>
              </Card>
            </Modal>
          </View>
          {/* Login option */}
          <Layout style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
            <Button size="giant" onPress={_onSignUpPressed} style={styles.registerButton}>
              {loading ? LoadingIndicator : 'Register'}
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text appearance="hint">Already a member?</Text>
              <Button appearance="ghost" size="large" onPress={() => navigation.navigate('Login')}>
                Log in
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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerButton: {
    marginVertical: 10
  },
  top: {
    alignItems: 'center',
    paddingVertical: 24
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
  formContainer: {
    paddingHorizontal: 16
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  welcomeImage: {
    width: 150,
    height: 165,
    marginBottom: 20
  }
});
export default memo(RegisterScreen);
