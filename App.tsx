import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
  magnetometer,
  barometer,
} from 'react-native-sensors';

import Geolocation from 'react-native-geolocation-service';

export const App = () => {
  return <MainScreen />;
};

const requestLocationPermission = async () => {
  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      console.log('You can use fine location');
      return Promise.resolve();
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permissão de acessar GPS',
        message: 'Permitir GPS?',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use fine location');
    } else {
      console.log('fine location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

type PageState = {
  gyro: {x: number; y: number; z: number};
  magnetometer: {x: number; y: number; z: number};
  position: {x: number; y: number};
  pressure: number;
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
    pressure: 0,
    position: {x: 0, y: 0},
  });

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000); // defaults to 100ms
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000); // defaults to 100ms
    setUpdateIntervalForType(SensorTypes.barometer, 1000); // defaults to 100ms

    const gyroSubscription = gyroscope.subscribe(speed => {
      setState(st => ({
        ...st,
        gyro: {
          ...speed,
        },
      }));
    });

    const magnetometerSubscription = magnetometer.subscribe(mag => {
      setState(st => ({
        ...st,
        magnetometer: {
          ...mag,
        },
      }));
    });

    const barometerSubscription = barometer.subscribe(({pressure}) =>
      setState(st => ({...st, pressure})),
    );

    requestLocationPermission().then(() => {
      Geolocation.getCurrentPosition(
        position => {
          setState(st => ({
            ...st,
            position: {
              x: position.coords.longitude,
              y: position.coords.latitude,
            },
          }));
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
        },
      );
    });

    return () => {
      gyroSubscription.unsubscribe();
      magnetometerSubscription.unsubscribe();
      barometerSubscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView>
      <>
        <View>
          <Text>Giroscópio</Text>
          <TextInput editable={false} value={state.gyro.x.toString()} />
          <TextInput editable={false} value={state.gyro.y.toString()} />
          <TextInput editable={false} value={state.gyro.z.toString()} />
        </View>
        <View>
          <Text>Magnetômetro</Text>
          <TextInput editable={false} value={state.magnetometer.x.toString()} />
          <TextInput editable={false} value={state.magnetometer.y.toString()} />
          <TextInput editable={false} value={state.magnetometer.z.toString()} />
        </View>
        <View>
          <Text>Pressão</Text>
          <TextInput editable={false} value={state.pressure.toString()} />
        </View>
        <View>
          <Text>Coordenadas</Text>
          <View>
            <Text>Lat</Text>
            <TextInput editable={false} value={state.position.y.toString()} />
          </View>
          <View>
            <Text>Lon</Text>
            <TextInput editable={false} value={state.position.x.toString()} />
          </View>
        </View>
      </>
    </SafeAreaView>
  );
};
