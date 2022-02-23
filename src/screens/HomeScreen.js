/**
The Home screen of the app, where the user can colorize their image.
 * @module screen/HomeScreen
 * @requires React
 * @requires react-native
 * @requires react-native-community/netinfo
 * @requires firebase
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */
import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as firebase from 'firebase';
import {
  Text,
  Layout,
  Button,
  Avatar,
  Modal,
  Card,
  Spinner,
  useStyleSheet,
  StyleService,
  useTheme
} from '@ui-kitten/components';
import { ImageIcon, CameraIcon } from '../assets/icons/icons';
import ModeSwitch from '../components/ModeSwitch';
import { getCRollPermission, getCPermission } from '../core/helpers/permissions';
import colorize from '../api/colorize-api';
import { uploadImageAsync, addImageToDB } from '../api/firebase-db-st';
import { ScrollView } from 'react-native-gesture-handler';
import { pickImage, takePhoto, downloadFile } from '../core/helpers/IO';


/**
   Renders the home screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
   @return {jsx} - The screen
   */

const HomeScreen = ({ navigation }) => {
  //the statuses and their setters, statuses re-render the app when changed
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [hasCRollPermission, setCRollPermission] = useState(false);
  const [hasCameraPermission, setCameraPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnection] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coloredImage, setColoredImage] = useState({ image: null, id: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  //destructuring email, full name and uid of the current user from firebase
  const { email, displayName, uid } = firebase.auth().currentUser;

  //using the theme in home screen
  const styles = useStyleSheet(themedStyles);
  const colors = useTheme();

  //runs when the screen first mounts
  useEffect(() => {
    setFullName(displayName);
    //get (fake) username from user's email (anything before the @ symbol)
    setUsername(email.match(/[^@]+/));
    //listens for the status of the network
     const unsubscribe = NetInfo.addEventListener(state => {
       setConnection(state.isConnected);
     });
  }, []);

/**
  requests permission to device's storage from user
 * @function _cRollAccess
 * @async
 * @private
   */

  const _cRollAccess = async () => {
    await getCRollPermission()
      .then(res => setCRollPermission(res))
      .catch(e => setError(e));
  };
 
/**
 requests permission to device's camera from user
* @function _cameraAccess
* @async
  @private
  */
  const _cameraAccess = async () => {
    await getCPermission()
      .then(res => setCameraPermission(res))
      .catch(e => setError(e));
  };
/**
 * Opens device's UI for picking images (if permission was granted).
 * @function _OpenGallery
 * @private
 * @async
   */

  const _OpenGallery = async () => {
    await _cRollAccess();
    if (!hasCRollPermission) {
      await _cRollAccess();
      return;
    }
    let result = await pickImage();
    if (!result.cancelled) {
      _handleImage(result);
    }
  };

/**
 * Opens device's camera (if permission was granted).
 * @function _OpenCamera
 * @private
 * @async
   */

  const _OpenCamera = async () => {
    await _cameraAccess();
    if (!hasCameraPermission) {
      await _cameraAccess();
      return;
    }
    let result = await takePhoto();
    if (!result.cancelled) {
      _handleImage(result);
    }
  };

/**
 * Downloads image to device storage.
 * @function _SaveImage
 * @async
 * @private
 * @param {String} image - colorized image's url
 * @param {String} id - id of the colorized image
   */

  const _SaveImage = async (image, id) => {
    if (loading) return;
    setSaving(true);
    await downloadFile(image, id)
      .then(() => {
        setSaving(false);
        setMessage('Image saved successfully');
      })
      .catch(e => setError(e));
  };

/**
 * handles uploading the picked image to the server and colorization
 * @function _handleImage
 * @async
 * @private
 * @param { Object } pickerResult - image picked by the user
*/
      
  const _handleImage = async pickerResult => {
    try {
      if (loading) return;
      setLoading(true);
      // checks if user is online.
      if(connected){
        //upload image to the firebase storage (temporarily hosting the image)
      await uploadImageAsync(pickerResult.uri, uid)
        .then(async ImageURL => {
          //send the image to DeOldify model for colorization
          await colorize(ImageURL)
            .then(async res => {
              //host the colorized image on firebase storage, since the api doesn't keep colorized images for long
              await uploadImageAsync(res.output_url, uid)
                .then(coloredURL => {
                  //store the colorized image for display
                  setColoredImage({ image: coloredURL, id: res.id });
                  //finally add the image to the database
                  addImageToDB(coloredURL, uid, res.id);
                })
                .catch(e => setError(e));
            })
            .catch(e => setError(e));
        })
        .catch(e => setError(e));
      }else{setMessage("You need to be connected to the internet to colorize.")}
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
// what the user will see on their screen (rendering)
  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Layout style={styles.user}>
            <Avatar
              style={{ marginRight: 10 }}
              size="large"
              source={require('../assets/images/avatar.png')}
            />
            <Layout style={styles.userText}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{fullName}</Text>
              <Text style={{ fontSize: 14 }} appearance="hint">
                {`@${username}`}
              </Text>
              {!connected && <Text status='warning'>You're offline!</Text>}
            </Layout>
          </Layout>
        </TouchableOpacity>
        {/* UI mode switch */}
        <ModeSwitch
          moonColor={colors['color-primary-500']}
          sunColor={colors['color-primary-300']}
        />
      </Layout>
      {/* if loading is true OR colorized image exists */}
      {loading || coloredImage.image ? (
        <Layout style={styles.container}>
          {/* if image is being colorized */}
          {loading ? (
            <View style={styles.container}>
              <Image
                source={require('../assets/images/colorizing-AI.png')}
                style={{ width: 150, height: 150, marginBottom: 30 }}
              />
              <Text category="h5" style={{ fontWeight: 'bold', marginBottom: 10 }}>
                The AI is colorizing your photo
              </Text>
              <Text style={{ marginBottom: 30 }}>This may take a few moments...</Text>
              <Spinner size="giant" status="primary" />
              <Text style={styles.credit}>
                ©With DeOldify{'\n'} <Text style={styles.creditName}>by Jason Antic</Text>
              </Text>
            </View>
          ) : (
            // when the image is finally colorized
            <ScrollView style={{ flex: 1, height: '100%' }} showsVerticalScrollIndicator={false}>
              <Layout style={styles.container}>
                <View style={styles.coloredTextView}>
                  <Text category="h5" style={styles.title}>
                    Here's your colorized photo...
                  </Text>
                  <Text>Hope you Like it! ♥</Text>
                </View>
                <Layout style={styles.coloredHolder}>
                  <Image source={{ uri: coloredImage.image }} style={styles.coloredPhoto} />
                </Layout>
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    onPress={() => _SaveImage(coloredImage.image, coloredImage.id)}
                    style={styles.saveButton}>
                    {saving ? <Spinner size="small" status="control" /> : 'Save to device'}
                  </Button>
                  <Button
                    onPress={() => setColoredImage('')}
                    style={{ marginVertical: 20, marginLeft: 15 }}
                    appearance="outline">
                    Colorize another
                  </Button>
                </View>
              </Layout>
            </ScrollView>
          )}
        </Layout>
      ) : (
        //when there is no colorized image (yet) and no loading (when opening the app basically)
        <Layout style={styles.main}>
          <Text category="h5" style={styles.title}>
            <Text category="h5" style={styles.italicTitle}>
              Colorizify{' '}
            </Text>
            Some Old Photos!
          </Text>
          <Text style={styles.hintText} appearance="hint">
            Click on the image icon to select from storage or the camera icon take a photo
          </Text>
          <Image source={require('../assets/images/32.png')} style={styles.footerImage} />
          <View style={styles.imageUploadBorder}>
            <Layout style={{ flexDirection: 'row' }}>
              <Button
                onPress={_OpenGallery}
                appearance="ghost"
                accessoryLeft={() => ImageIcon(colors['color-primary-500'])}
                style={{ marginRight: 10 }}
              />
              <Layout style={styles.divider}></Layout>
              <Button
                onPress={_OpenCamera}
                appearance="ghost"
                accessoryLeft={() => CameraIcon(colors['color-primary-500'])}
                style={{ marginLeft: 10 }}
              />
            </Layout>
            <Text style={styles.tip} appearance="hint">
              Tip: photos of higher quality and clarity have better results, but also a take longer
              time to colorize.
            </Text>
          </View>
        </Layout>
      )}
      {/* the message pop up window */}
      <Modal visible={!!message} backdropStyle={styles.backdrop}>
        <Card disabled={true} status="info">
          <Text style={{ marginVertical: 30 }}>{message}</Text>
          <Button status="info" onPress={() => setMessage('')}>
            OK
          </Button>
        </Card>
      </Modal>
      {/* the error pop up window */}
      <Modal visible={!!error}>
        <Card disabled={true} status="warning">
          <Text style={{ marginVertical: 30 }}>{error}</Text>
          <Button status="warning" onPress={() => setError('')}>
            OK
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
};

//styles
const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  userText: {
    flexDirection: 'column'
  },
  imageUploadBorder: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'color-basic-500',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'color-basic-500',
    borderRadius: 1
  },
  hintText: {
    fontSize: 12,
    paddingHorizontal: 40,
    marginVertical: 25
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  italicTitle: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'color-primary-500'
  },
  tip: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 10,
    paddingHorizontal: 40
  },
  footerImage: {
    width: 600,
    height: 500,
    position: 'absolute',
    bottom: -290,
    right: -100,
    opacity: 0.3
  },
  coloredHolder: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'color-primary-500',
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 20
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  coloredPhoto: {
    width: 280,
    height: 280,
    aspectRatio: 1.0,
    borderColor: 'color-primary-500',
    borderWidth: 2,
    borderRadius: 10
  },
  coloredTextView: {
    marginVertical: 20
  },
  saveButton: {
    marginVertical: 20,
    width: 140,
    height: 45
  },
  credit: {
    color: 'color-primary-500',
    fontSize: 12,
    marginTop: 40
  },
  creditName: {
    fontSize: 10,
    color: 'color-primary-400'
  }
});

export default memo(HomeScreen);
