import React, { Component } from 'react';
import { Alert, AppRegistry,Animated, StyleSheet, View , Text, TextInput, Button, Image,ScrollView, ReactNative, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native';
import logo from './../message.png';
import user from './../user.png';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { stringify } from 'querystring';
import Icon from 'react-native-vector-icons/Ionicons';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Modal from "react-native-modal";
import { NavigationActions } from 'react-navigation';

export default class Contatos extends Component {
  static navigationOptions =({navigation})=> ({
    headerRight:(
      <TouchableOpacity onPress={() => navigation.navigate('AdicionarContatos')}>
        <Icon name="md-person-add" size={35} style={{marginRight: 10}}color='white'/>
      </TouchableOpacity>
    )
  });

  constructor(props){
    super(props);
    this.state = {
        id: 0,
        contacts: [],
        mensagem: '',
        isVisible: false,
        contatoExcluir: {
          user: {
            name: ''
          }
        },
        pressAction: new Animated.Value(0),
    };
    
    this.contatos = this.contatos.bind(this);
    this.contatosCallback = this.contatosCallback.bind(this);
    this.excluirContato = this.excluirContato.bind(this);
    this.excluirContatoCallback = this.excluirContatoCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('contatos',this.contatosCallback);
    this.socket.on('excluirContato',this.excluirContatoCallback);
  };
  
  
  contatosCallback(contatos){ 
    this.setState({contacts: contatos});
  }
  
  componentWillMount(){
    this.contatos();
  }

  fechar(){
    this.setState({isVisible: false})
  }
  
  contatos(){
    var id = this.props.navigation.state.params.id
    AsyncStorage.setItem('id', id+'').then((value) => {
      this.setState({id: this.props.navigation.state.params.id});
      this.socket.emit('contatos', this.props.navigation.state.params.id);
    })
  }


  openChat(contact){
    const { navigate } = this.props.navigation;
    var id = this.state.id;
    navigate('Chat', {contact, id});
  }

  excluir(contact){
    this.setState({isVisible: true, contatoExcluir: contact})
  }

  excluirContato(){
    this.socket.emit('excluirContato', [this.state.id,this.state.contatoExcluir.user.id])
  }

  excluirContatoCallback(){
    console.log(1)
    this.props.navigation.dispatch(NavigationActions.reset({
      index:0,
      actions:[
        NavigationActions.navigate({routeName:'Contatos', params: {id: this.state.id, }})
      ]
    }))
  }

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.mensagemModal}>Deseja excluir {this.state.contatoExcluir.user.name} da sua lista de amigos?</Text>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => this.fechar()}>
          <View style={styles.buttonNao}>
            <Text style={{fontSize: 18}}>Não</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.excluirContato()}>
          <View style={styles.buttonSim}>
            <Text style={{fontSize: 18}}>Sim</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );


  render() {
    var height= Dimensions.get('window').height;
    var width= Dimensions.get('window').width;
    const contacts =  this.state.contacts.map((contact, index) => (
      <TouchableOpacity key={index} style={styles.contact} onPress={() => this.openChat(contact.user)} delayLongPress={500} onLongPress={() => this.excluir(contact)}>
          <View style={{width: width*0.25}}>
            <Image source={user} style={styles.user} />
          </View>
          <View style={{width: width*0.75}}>
            <View style={{height: 35, marginTop:10}}>
              <Text style={styles.name}>{contact.user.name}</Text>
            </View>
            <View style={{height: 35}}>
              <Text style={styles.status}>{contact.user.status}</Text>
            </View>
          </View>
      </TouchableOpacity>
    ));

    return (
      <ScrollView style={styles.contacts}>
        <Modal
          isVisible={this.state.isVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          {this._renderModalContent()}
        </Modal>
        {contacts}
      </ScrollView>
    );
  }
}
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
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
  mensagem: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',
    margin: 7,
    marginTop: height*0.05,
    marginBottom: height*0.1,
},
buttonNao: {
  borderBottomLeftRadius: 15,
  backgroundColor: '#e6e6e6',
  borderColor: 'black',
  borderWidth: 1,
  borderRightWidth: 0,
  width: width*0.4,
  height: height*0.1,
  alignItems: "center",
  justifyContent: "center"
},
buttonSim: {
  borderBottomRightRadius: 15,
  backgroundColor: '#e6e6e6',
  borderWidth: 1,
  borderColor: 'black',
  width: width*0.4,
  height: height*0.1,
  alignItems: "center",
  justifyContent: "center"
},
mensagemModal: {
  fontSize: 18,
  height: height*0.1,
  marginTop: height*0.1,
  textAlign: 'center'
},
modalContent: {
  backgroundColor: "white",
  alignItems: "center",
  borderRadius: 15,
  borderColor: "grey",
  width: width*0.8,
  marginLeft: width*0.05,
  height: height*0.3,
}
})