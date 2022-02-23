/**
The User profile screen of the app, where the user can view their colorized images in form of a gallery.
 * @module screen/UserProfileScreen
 * @requires React
 * @requires react-native
 * @requires firebase
 * @requires react-native-gesture-handler
 * @requires expo-linear-gradient
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */
import * as firebase from 'firebase';
import React, { memo, useState, useEffect, useContext } from 'react';
import {
  Text,
  Layout,
  Button,
  Avatar,
  useStyleSheet,
  StyleService,
  useTheme,
  List,
  Spinner,
  Modal,
  Card
} from '@ui-kitten/components';
import { StyleSheet, Image, View, YellowBox } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import ModeSwitch from '../components/ModeSwitch';
import { logoutUser } from '../api/auth-api';
import { ThemeContext } from '../core/config/theme-context';

//TODO: remove
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested', 'Setting a timer']);

/**
   Renders the user profile screen
 * @function
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
   @return {jsx} - The screen
   */
const UserProfile = ({ navigation }) => {
  //theme manager
  const { theme } = useContext(ThemeContext);
  //the statuses and their setters, statuses re-render the app when changed
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagesID, setImagesID] = useState([]);

  //theme manager
  const styles = useStyleSheet(themedStyles);
  const colors = useTheme();
  
  //destructuring email, full name and uid of the current user from firebase
    const { email, displayName, uid  } = firebase.auth().currentUser;

  //runs when the screen first mounts
  useEffect(() => {
    setFullName(displayName);
    //get (fake) username from user's email (anything before the @ symbol)
    setUsername(email.match(/[^@]+/));
    setLoading(true);
    //fetch user's colorized images from database
    try{
    firebase
      .database()
      .ref(`/users/${uid}/images`)
      .on('value', async snapshot => {
        if (loading) return;
        await _getSnapshot(snapshot.val()).then(() => setLoading(false)).catch((e => setError(e)));
      });
    }catch(e){setError(e)}
  }, []);
/**
  gets data from firebase and sets the images array with the data
 * @function _getSnapshot
 * @param {object} snapshot - an object containing a snapshot of the data at the current time
 * @async
 * @private
   */
  const _getSnapshot = async (snapshot) => {
    data = await snapshot ? snapshot : {};
    const images = Object.values(data);
    const ids = Object.keys(data);
    setImages(images);
    setImagesID(ids);
  };

// what the user will see on their screen (rendering)
  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* header */}
        <Layout>
          <Layout style={styles.top}>
            <Image
              source={require('../assets/images/color-back.jpg')}
              style={styles.gradientBackground}
            />
            <LinearGradient
              colors={['#91c4ffaa', '#a68cd1ee', '#fbc2ebee', '#fef9d7']}
              style={styles.gradientBackground}
            />
            {/* UI mode switch */}
            <ModeSwitch
              moonColor={colors['color-primary-900']}
              sunColor={colors['color-primary-900']}
              style={styles.switch}
            />
            <Avatar source={require('../assets/images/avatar.png')} style={styles.userAvatar} />
            <Text category="h5" style={styles.name}>
              {fullName}
            </Text>
            <Text style={styles.userName}>{`@${username}`}</Text>
            <Button status="control" style={styles.logout} onPress={() => logoutUser()}>
              LOG OUT
            </Button>
          </Layout>
          <Layout style={styles.numOfItemsView} level="1">
            <Text category="p2" style={{ fontWeight: 'bold' }}>
              Colorized Photos
            </Text>
            <Text category="p2" style={{ fontWeight: 'bold' }}>
              {images.length > 0 ? images.length : null}
            </Text>
          </Layout>
          <Layout style={{ flex: 1 }}>
            {/* if loading is done, display images */}
            {!loading ? (
              <Layout style={{ flex: 1 }}>
                <List
                  data={images}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    // when users clicks on an image, it should take him to that images details page
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ImageDetail', {
                          uid,
                          id: item.id,
                          image: item.image,
                          index,
                          imageId: imagesID[index]
                        })
                      }>
                      <Image
                        source={{ uri: item.image }}
                        style={[
                          styles.imageItem,
                          {
                            borderColor:
                              theme === 'light'
                                ? colors['color-basic-100']
                                : colors['color-basic-800']
                          }
                        ]}
                      />
                    </TouchableOpacity>
                  )}
                />
              </Layout>
            ) : (
              //when the page is still loading
                <View style={styles.container}>
                  <Spinner size='giant' status='primary' />
                </View>

              )}
          </Layout>
          {/* the error pop up window*/}
          <Modal visible={!!error}>
            <Card disabled={true} status="warning">
              <Text style={{ marginVertical: 30 }}>{error}</Text>
              <Button status="warning" onPress={() => setError('')}>
                OK
          </Button>
            </Card>
          </Modal>
        </Layout>
      </ScrollView>
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
  userAvatar: {
    width: 124,
    height: 124,
    marginTop: 10,
    marginBottom: 20
  },
  top: {
    alignItems: 'center',
    padding: 24
  },

  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    height: '130%',
    width: '120%'
  },
  switch: {
    position: 'absolute',
    right: 0,
    top: 19
  },
  name: {
    fontWeight: 'bold',
    color: 'color-basic-900'
  },
  userName: {
    fontSize: 16,
    color: 'color-basic-700',
    marginTop: 5
  },

  logout: {
    marginTop: 25
  },
  imageItem: {
    aspectRatio: 1.0,
    width: 120,
    height: 120,
    borderWidth: 1
  },
  numOfItemsView: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default memo(UserProfile);
