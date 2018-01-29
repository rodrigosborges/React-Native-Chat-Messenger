import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, ReactNative, TouchableOpacity,Label, Dimensions, ScrollView, AsyncStorage} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Modal from "react-native-modal";
import {Button} from 'react-native-elements';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { stringify } from 'querystring';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
        contato: '',
        isVisible: false,
        botao: '',
        mensagem: '',
        id: 0,
    };
    this.adicionar = this.adicionar.bind(this);
    this.adicionarCallback = this.adicionarCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('adicionar',this.adicionarCallback);

    AsyncStorage.getItem('id').then(response => {
      this.setState({id: Number.parseInt(response,10)});
    })
  }

  adicionarCallback(params){
    this.setState({isVisible: true, mensagem: params[1]})
  }

  adicionar(){
      this.socket.emit('adicionar',[this.state.id,this.state.contato]);
  }

  fechar(){
    const {navigate} = this.props.navigation
    if(this.state.mensagem == "Contato adicionado"){
      this.setState({ isVisible: false, contato: '' })
      navigate('Contatos', {id: this.state.id})
    }else{
      this.setState({ isVisible: false, contato: '' })
    }
  
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonModal}>
        <Text style={{fontSize: 18}}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.mensagemModal}>{this.state.mensagem}</Text>
      {this._renderButton("FECHAR", () => this.fechar())}
    </View>
  );

  render() {

    const { navigate } = this.props.navigation;
    
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.isVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          {this._renderModalContent()}
        </Modal>
        <View style={styles.label}>
          <View>
            <Text style={styles.mensagem}> Digite o nome de usuário ou email do contato que deseja adicionar</Text>
          </View>
          <View style={{ justifyContent: "center"}}>
            <FormInput style={styles.input} value={this.state.contato} onChangeText={(text) => {this.setState({contato: text})}}/>
          </View>
          <View style={{ alignItems: 'center'}}>
            <Button textStyle={{fontSize: 16}} onPress={() => this.adicionar()} buttonStyle={styles.botao} title="ADICIONAR"/>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#99bbff',
  },
  botao: {
    borderRadius: 15,
    backgroundColor: '#00cc99',
    marginTop: height*0.05,
    width: width*0.4
  },
  label:{
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: 'black',
    height: height*0.5,
    width: width*0.9,
  },
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 10,
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
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  mensagem: {
      fontSize: 20,
      color: 'grey',
      textAlign: 'center',
      margin: 7,
      marginTop: height*0.05,
      marginBottom: height*0.1,
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
  mensagemModal: {
    fontSize: 18,
    height: height*0.1,
    marginTop: height*0.1,
    textAlign: 'center'
  }
})
