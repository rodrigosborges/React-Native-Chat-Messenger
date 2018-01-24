import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Button } from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import Home from './src/components/Home';
import Cadastro from './src/components/Cadastro';
import Chat from './src/components/Chat';
import Contatos from './src/components/Contatos';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4d88ff',
    height: 50 
  },
  back: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    paddingRight: 0,
    paddingLeft: 0
  },
})

const SimpleApp = StackNavigator({
    Home: {
      screen: Home,
      navigationOptions:{
        headerStyle: styles.header,
        title: 'Início',
        headerTitleStyle: styles.back,
        headerTintColor: 'white',
      }
    },
    Cadastro: {
      screen: Cadastro,
      navigationOptions:{
        headerStyle: styles.header,
        title: 'Cadastrar',
        headerTitleStyle: styles.back,
        headerTintColor: 'white',
        headerRight: <View/>
      }
    },
    Chat: {
      screen: Chat,
      navigationOptions:{
        headerStyle: styles.header,
        headerTitleStyle: styles.back,
        headerTintColor: 'white',
        headerRight: <View/>
      }
    },
    Contatos: {
      screen: Contatos,
      navigationOptions:{
        headerStyle: styles.header,
        title: 'Contatos',
        headerTitleStyle: styles.back,
        headerTintColor: 'white',
      }
    }


});


export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}


