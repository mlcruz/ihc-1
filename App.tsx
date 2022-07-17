import React, {useState} from 'react';
import {Button, SafeAreaView, Text, TextInput} from 'react-native';

export const App = () => {
  return <MainScreen />;
};

const MainScreen = () => {
  const [state, setState] = useState<number[]>([0, 0]);
  const [somaState, setSomaState] = useState('');

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Enter a number"
        value={state[0].toString()}
        onChangeText={text => {
          const digits = text.replace(/\D/g, '');

          setState([+digits, state[1]]);
        }}
      />
      <TextInput
        placeholder="Enter a number"
        value={state[1].toString()}
        onChangeText={text => {
          const digits = text.replace(/\D/g, '');
          setState([state[0], +digits]);
        }}
      />
      <Button
        title="Somar"
        onPress={() => setSomaState((state[0] + state[1]).toString())}
      />
      <Text>{somaState}</Text>
    </SafeAreaView>
  );
};
