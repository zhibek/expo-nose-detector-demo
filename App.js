import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  }
});

export default () => {
  const [hasPermission, setHasPermission] = useState();
  const [faceData, setFaceData] = useState([]);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  getFaceDataView = () => {
    let myFace = null;
    let noseLocation = null;
    let isSmiling = false;

    if (faceData.length === 1) {
      myFace = faceData[0];
      noseLocation = myFace?.NOSE_BASE;
      isSmiling = (myFace?.smilingProbability > 0.6);
    };

    if (!noseLocation) {
      return (
        <View
          pointerEvents={'none'}
          style={{
            borderWidth: 10,
            borderColor: 'red',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          }}
        />
      );
    }

    const noseStyle = {
      borderWidth: 2,
      borderColor: 'red',
      position: 'absolute',
      left: noseLocation.x - 25,
      top: noseLocation.y - 25,
      width: 50,
      height: 50,
      borderRadius: 25
    };
    if (isSmiling) {
      noseStyle.backgroundColor = 'red';
    }

    return (
      <View
        pointerEvents={'none'}
        style={noseStyle}
      />
    );
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
  }

  return (
    <Camera
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 10,
        tracking: true
      }}>
      {getFaceDataView()}
    </Camera>
  );
};
