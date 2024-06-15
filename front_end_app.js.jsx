// App.js

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Camera, CameraConstants } from 'react-native-camera'; // Corrected import statement

const App = () => {
  // State variables to manage camera reference, images, loading state, and camera permission
  const [camera, setCamera] = useState(null);
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);

  // useEffect hook to request camera permission when the component mounts
  useEffect(() => {
    async function requestCameraPermission() {
      // Requesting camera permission
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // Setting camera permission state based on user response
      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermission(true);
      } else {
        console.log('Camera permission denied');
      }
    }
    requestCameraPermission();
  }, []);

  // Function to take a picture and set the image state
  const takePicture = async (type) => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      const imageUri = `data:image/jpeg;base64,${data.base64}`;
      if (type === 'front') {
        setImageFront(imageUri);
      } else {
        setImageBack(imageUri);
      }
    }
  };

  // Function to upload images and store them
  const uploadImages = async () => {
    setLoading(true);
    try {
      // Assuming MongoDB.uploadImage and MongoDB.storeLicense are defined elsewhere
      const frontImage = await MongoDB.uploadImage(imageFront);
      const backImage = await MongoDB.uploadImage(imageBack);
      await MongoDB.storeLicense(frontImage, backImage);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {cameraPermission ? (
        // Camera component to capture images
        <Camera
          ref={(ref) => setCamera(ref)}
          style={{ flex: 1 }}
          type={CameraConstants.Type.back} // Corrected CameraConstants
          flashMode={CameraConstants.FlashMode.auto} // Corrected CameraConstants
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => takePicture('front')} style={{ marginBottom: 10 }}>
              <Text>Scan front</Text>
            </TouchableOpacity>
            {imageFront && (
              <Image source={{ uri: imageFront }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            )}
            <TouchableOpacity onPress={() => takePicture('back')} style={{ marginBottom: 10 }}>
              <Text>Scan back</Text>
            </TouchableOpacity>
            {imageBack && (
              <Image source={{ uri: imageBack }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            )}
            <TouchableOpacity onPress={uploadImages} style={{ marginBottom: 10 }}>
              <Text>Upload and store license</Text>
            </TouchableOpacity>
            {loading && <Text>Uploading...</Text>}
          </View>
        </Camera>
      ) : (
        <Text>No camera permission</Text>
      )}
    </View>
  );
};

export default App;
