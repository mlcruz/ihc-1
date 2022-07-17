/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TextInput, View} from 'react-native';

import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

export const App = () => {
  return <MainScreen />;
};

type PageState =
  | {
      state: 'get-gyro';
      coord: {x: number; y: number; z: number};
    }
  | {
      state: 'show-message';
      message: string;
    };

const MainScreen = () => {
  const [state, setState] = useState<PageState>({
    state: 'get-gyro',
    coord: {x: 0, y: 0, z: 0},
  });

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms
    const subscription = gyroscope.subscribe(speed => {
      if (speed.x >= 1 || speed.y >= 1 || speed.z >= 1) {
        setState({state: 'show-message', message: 'girando'});
        setTimeout(() => {
          setState({state: 'get-gyro', coord: {x: 0, y: 0, z: 0}});
        }, 10000);
      } else if (state.state !== 'show-message') {
        setState({
          state: 'get-gyro',
          coord: {
            ...speed,
          },
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView>
      {state.state === 'get-gyro' ? (
        <>
          <View>
            <TextInput value={state.coord.x.toString()} />
            <TextInput value={state.coord.y.toString()} />
            <TextInput value={state.coord.z.toString()} />
          </View>
        </>
      ) : (
        <>
          <Text>{state.message}</Text>
        </>
      )}
    </SafeAreaView>
  );
};
