import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, Button, Image,ScrollView, ReactNative, AsyncStorage, TouchableOpacity } from 'react-native';
import logo from './../message.png';
import user from './../user.png';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';

export default class Contatos extends Component {
  constructor(props){
    super(props);
    this.state = {
        id: 0,
        contacts: [],
    };
    var that = this;
    AsyncStorage.getItem('id').then((value) => {
      this.setState({id: value});
    })
  };
  
  openChat(contact){
    const { navigate } = this.props.navigation;
    var id = this.state.id;
    navigate('Chat', {contact, id});
  }

  render() {
    const contacts =  this.state.contacts.map((contact, index) => (
      <TouchableOpacity key={index} style={styles.contact} onPress={() => this.openChat(contact)}>
        <Grid>
          <Col size={1}></Col>
          <Col size={7}>
            <Image source={user} style={styles.user} />
          </Col>
          <Col size={20}>
            <Row size={1}></Row>
            <Row size={4}>
              <Text style={styles.name}>{contact.name}</Text>
            </Row>
            <Row size={3}>
              <Text style={styles.status}>{contact.status}</Text>
            </Row>
          </Col>
        </Grid>
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
    borderColor: 'grey'
  },
})