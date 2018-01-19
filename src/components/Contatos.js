import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, Button, Image,ScrollView, ReactNative, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native';
import logo from './../message.png';
import user from './../user.png';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { stringify } from 'querystring';

export default class Contatos extends Component {
  constructor(props){
    super(props);
    this.state = {
        id: 0,
        contacts: [],
    };
    
    this.contatos = this.contatos.bind(this);
    this.contatosCallback = this.contatosCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('contatos',this.contatosCallback);
  };
  
  
  contatosCallback(contatos){ 
    this.setState({contacts: contatos});
  }
  
  componentWillMount(){
    this.contatos();
  }
  
  contatos(){
    AsyncStorage.setItem('id', stringify(this.props.navigation.id)).then(() => {
      this.setState({id: this.props.navigation.state.params.id});
      this.socket.emit('contatos', this.props.navigation.state.params.id);
    })

  }


  openChat(contact){
    const { navigate } = this.props.navigation;
    var id = this.state.id;
    navigate('Chat', {contact, id});
  }

  render() {
    var height= Dimensions.get('window').height;
    var width= Dimensions.get('window').width;
    const contacts =  this.state.contacts.map((contact, index) => (
      <TouchableOpacity key={index} style={styles.contact} onPress={() => this.openChat(contact)}>
          <View style={{width: width*0.25}}>
            <Image source={user} style={styles.user} />
          </View>
          <View style={{width: width*0.75}}>
            <View style={{height: 35, marginTop:10}}>
              <Text style={styles.name}>{contact.name}</Text>
            </View>
            <View style={{height: 35}}>
              <Text style={styles.status}>{contact.status}</Text>
            </View>
          </View>
      </TouchableOpacity>
    ));

    return (
      <ScrollView style={styles.contacts}>
          {contacts}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    //  justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#99bbff',

  },
  telaPrincipal:{
    flex:1,
    backgroundColor: '#99bbff',
  },
  texto:{
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },  
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#99bbff', 
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  user:{
    height: 70,
    width: 70,
    marginTop: 7
  },
  status: {
    fontSize: 18,
    color: 'grey'
  },
  contact:{
    height: 80,
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
  },
})