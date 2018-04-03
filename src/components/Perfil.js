import React, { Component } from 'react';
import { Alert, AppRegistry,Animated, StyleSheet, View , Text, TextInput, Button, Image,ScrollView, ReactNative, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native';
import logo from './../message.png';
import user from './../user.jpg';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { stringify } from 'querystring';
import Icon from 'react-native-vector-icons/Ionicons';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Modal from "react-native-modal";
import { NavigationActions } from 'react-navigation';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Contatos extends Component {

  constructor(props){
    super(props);
    this.state = {
        id: 0,
        isVisible: false,
        name: '',
        status: ''
    };
    
    this.dadosPerfil = this.dadosPerfil.bind(this);
    this.dadosPerfilCallback = this.dadosPerfilCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('dadosPerfil',this.dadosPerfilCallback);
  };
  
  
  dadosPerfilCallback(user){ 
    this.setState({name: user.name, status: user.status})
  }
  
  componentWillMount(){
    AsyncStorage.getItem('id').then((id)=> {
        this.dadosPerfil(id);
    })
  }

  fechar(){
    this.setState({isVisible: false})
  }
  
  dadosPerfil(id){
    this.socket.emit('dadosPerfil', id);
  }

  _renderModalContent = () => (
    <View style={styles.modalContent}>
        <Text style={styles.mensagemModal}>Perfil atualizado com sucesso</Text>
        <TouchableOpacity onPress={() => this.fechar()}>
            <View style={styles.buttonModal}>
                <Text style={{fontSize: 18}}>Fechar</Text>
            </View>
        </TouchableOpacity>
    </View>
  );


  render() {
    var height= Dimensions.get('window').height;
    var width= Dimensions.get('window').width;

    return (
      <View style={styles.label}>
        <Modal
          isVisible={this.state.isVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          {this._renderModalContent()}
        </Modal>

        <View style={styles.label}>
          <View>
            <FormLabel labelStyle={{fontSize:15}}>Nome</FormLabel>
            <FormInput style={styles.input} value={this.state.name} onChangeText={(text) => this.setState({name: text})}/>
          </View>
          <View>
            <FormLabel labelStyle={{fontSize:15}}>Status</FormLabel>
            <FormInput style={styles.input} keyboardType="email-address" value={this.state.status} onChangeText={(text) => this.setState({email: text})}/>
          </View>
          <View>
            <Button textStyle={{fontSize: 16}} buttonStyle={styles.botao} title="ATUALIZAR" onPress={() => this.cadastrar()} />
          </View>
        </View>
            <KeyboardSpacer/>
      </View>
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
        marginTop: 4,
        marginLeft: 5,
        borderRadius: 70/2,

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
    },
    buttonModal: {
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: '#e6e6e6',
        borderColor: '#a6a6a6',
        width: width*0.8,
        height: height*0.1,
        alignItems: "center",
        justifyContent: "center"
    },
    botao: {
        borderRadius: 15,
        backgroundColor: '#00cc99',
        marginTop: height*0.05
      },
      label:{
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: 'black',
        height: height*0.7,
        width: width*0.9,
      },
})