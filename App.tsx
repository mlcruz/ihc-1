import React, {useState} from 'react';
import {Button, SafeAreaView, Text, TextInput} from 'react-native';

export const App = () => {
  return <MainScreen />;
};

type PageState =
  | {
      state: 'enter-message';
      message: string;
    }
  | {
      state: 'show-message';
      message: string;
    };

const MainScreen = () => {
  const [state, setState] = useState<PageState>({
    state: 'enter-message',
    message: '',
  });

  return (
    <SafeAreaView>
      {state.state === 'enter-message' ? (
        <>
          <TextInput
            placeholder="Enter a message"
            value={state.message}
            onChangeText={text => {
              setState({...state, message: text});
            }}
          />
          <Button
            title="Send"
            onPress={() => {
              setState({state: 'show-message', message: state.message});
            }}
          />
        </>
      ) : (
        <>
          <Text>{state.message}</Text>
        </>
      )}
    </SafeAreaView>
  );
};
