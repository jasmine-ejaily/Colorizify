/**
The Image details (manager) screen, shows up when the user clicks on an image in their gallery
 * @module screen/ImageDetailScreen
 * @requires React
 * @requires react-native
 * @requires ui-kitten/components
 * @author Yasmin Magdi Fahmi
 */

import React, { useContext, useState, memo } from 'react';
import { View, Image } from 'react-native';
import {
  Layout,
  useStyleSheet,
  StyleService,
  useTheme,
  Text,
  Button,
  Modal,
  Card,
  Spinner
} from '@ui-kitten/components';
import BackButton from '../components/BackButton';
import ModeSwitch from '../components/ModeSwitch';
import { ThemeContext } from '../core/config/theme-context';
import { removeImageFromDB } from '../api/firebase-db-st';
import { downloadFile } from '../core/helpers/IO';

/**
   Renders the image details screen
 * @function
 * @param {Object} route - an object contain values passed from the previous screen
 * @param {Object} navigation - a navigation object contains functions and properties for navigation
   @return {jsx} - The screen
   */

const ImageDetailsScreen = ({ route, navigation }) => {
  //values passed from user profile screen
  const { image, index, id, uid, imageId } = route.params;
  //the statuses and their setters, statuses re-render the app when changed
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  //status of the confirmation of deletion
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const styles = useStyleSheet(themedStyles);
  const colors = useTheme();
  const { theme } = useContext(ThemeContext);

/**
* Downloads image to device storage.
* @function _SaveImage
* @async
* @private
* @param {String} image - colorized image's url
* @param {String} id - id of the colorized image
 */
  const _SaveImage = async () => {
    if (loading) return;
    setLoading(true);
    await downloadFile(image, id)
      .then(() => {
        setLoading(false);
        setMessage({ text: 'Image saved successfully', type: 'success' });
      })
      .catch(e => setError(e));
  };

/**
 * Downloads image to device storage.
 * @function _deleteImage
 * @private
   */

  const _deleteImage = () => {
    removeImageFromDB(uid, imageId)
      .then(() => {
        navigation.goBack();
      })
      .catch(e => {
        setError(e);
      });
  };
// what the user will see on their screen (rendering)
  return (
    <Layout style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <BackButton
          color={theme === 'light' ? colors['color-primary-900'] : colors['color-primary-100']}
          goBack={() => navigation.goBack()}
        />
        <Text category="h6" style={{ fontWeight: 'bold' }}>
          Colorized Image {index + 1}
        </Text>
        {/* UI mode switch */}
        <ModeSwitch
          moonColor={colors['color-primary-900']}
          sunColor={colors['color-primary-100']}
        />
      </View>

      <Layout style={styles.container} level="4">
        <Image style={styles.bigImage} source={{ uri: image }} />
      </Layout>
      <Layout style={styles.buttonsContainer}>
        <Button status="primary" style={styles.button} onPress={_SaveImage}>
          {loading ? <Spinner size="small" status="control" /> : 'Save to Device'}
        </Button>
        <Button status="danger" onPress={() => setConfirm(true)}>
          Delete Image
        </Button>
      </Layout>
      <Modal visible={!!message.text} backdropStyle={styles.backdrop}>
        <Card disabled={true} status={message.type}>
          <Text style={{ marginVertical: 30 }}>{message.text}</Text>
          <Button
            status="success"
            onPress={() => {
              setMessage({ text: '', type: '' });
            }}>
            OK
          </Button>
        </Card>
      </Modal>
      {/* the error pop up window*/}
      <Modal visible={!!error} backdropStyle={styles.backdrop}>
        <Card disabled={true} status="warning">
          <Text style={{ marginVertical: 30 }}>{error}</Text>
          <Button
            status="warning"
            onPress={() => {
              setError('');
            }}>
            OK
          </Button>
        </Card>
      </Modal>
      {/* the deletion confirmation pop up window*/}

      <Modal visible={!!confirm} backdropStyle={styles.backdrop}>
        <Card disabled={true} status="danger">
          <Text style={{ marginVertical: 30, fontWeight: 'bold' }}>
            Are you sure you want to delete the image?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}>
            <Button appearance="outline" status="danger" onPress={_deleteImage}>
              Delete
            </Button>
            <Button status="danger" onPress={() => setConfirm(false)}>
              Cancel
            </Button>
          </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%'
  },
  bigImage: {
    height: '85%',
    aspectRatio: 1.0
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20
  },
  button: {
    marginRight: 30,
    width: 150,
    height: 50
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
});

export default memo(ImageDetailsScreen);
