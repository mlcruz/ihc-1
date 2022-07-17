/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TextInput, View} from 'react-native';

import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
  magnetometer,
} from 'react-native-sensors';

export const App = () => {
  return <MainScreen />;
};

type PageState = {
  gyro: {x: number; y: number; z: number};
  magnetometer: {x: number; y: number; z: number};
};

const MainScreen = () => {
  const [state, setState] = useState<PageState>({
    gyro: {
      x: 0,
      y: 0,
      z: 0,
    },
    magnetometer: {
      x: 0,
      y: 0,
      z: 0,
    },
  });

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // defaults to 100ms
    setUpdateIntervalForType(SensorTypes.magnetometer, 100); // defaults to 100ms

    const gyroSubscription = gyroscope.subscribe(speed => {
      setState({
        ...state,
        gyro: {
          ...speed,
        },
      });
    });

    const magnetometerSubscription = magnetometer.subscribe(mag => {
      setState({
        ...state,
        magnetometer: {
          ...mag,
        },
      });
    });

    return () => {
      gyroSubscription.unsubscribe();
      magnetometerSubscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView>
      <>
        <View>
          <Text>Giroscópio</Text>
          <TextInput value={state.gyro.x.toString()} />
          <TextInput value={state.gyro.y.toString()} />
          <TextInput value={state.gyro.z.toString()} />
        </View>
        <View>
          <Text>Magnetômetro</Text>
          <TextInput value={state.magnetometer.x.toString()} />
          <TextInput value={state.magnetometer.y.toString()} />
          <TextInput value={state.magnetometer.z.toString()} />
        </View>
      </>
      )
    </SafeAreaView>
  );
};
