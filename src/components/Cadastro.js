import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, ReactNative, TouchableOpacity,Label, Dimensions, ScrollView, AsyncStorage} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Modal from "react-native-modal";
import {Button} from 'react-native-elements';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { stringify } from 'querystring';
import { NavigationActions } from 'react-navigation';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        isVisible: false,
        space: 0,
        mensagem: '',
    };
    this.cadastrar = this.cadastrar.bind(this);
    this.cadastrarCallback = this.cadastrarCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('cadastrar',this.cadastrarCallback);
  }

  cadastrarCallback(cadastro){
    const {navigate} = this.props.navigation; 
    const { goBack } = this.props.navigation;
    if(cadastro[0]){
      this.setState({isVisible: true, mensagem: "Cadastro concluído"})
    }else{
      this.setState({isVisible: true, mensagem: cadastro[1]})
    }
  }

  cadastrar(){
    this.socket.emit('cadastrar',{name: this.state.name, email: this.state.email ,password: this.state.password, passwordConfirm: this.state.passwordConfirm});
  }

  redirecionar(){
    if(this.state.mensagem == "Cadastro concluído"){
      this.props.navigation.dispatch(NavigationActions.reset({
        index:0,
        actions:[
          NavigationActions.navigate({routeName:'Home'})
        ]
      }))      
    }else
      this.setState({ isVisible: false })
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonModal}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.mensagemModal}>{this.state.mensagem}</Text>
      {this._renderButton("Fechar", () => this.redirecionar())}
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
            <FormLabel labelStyle={{fontSize:15}}>Nome</FormLabel>
            <FormInput style={styles.input} onChangeText={(text) => this.setState({name: text})}/>
          </View>
          <View>
            <FormLabel labelStyle={{fontSize:15}}>E-mail</FormLabel>
            <FormInput style={styles.input} keyboardType="email-address" onChangeText={(text) => this.setState({email: text})}/>
          </View>
          <View>
            <FormLabel labelStyle={{fontSize:15}}>Senha</FormLabel>
            <FormInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
          </View>
          <View>
            <FormLabel labelStyle={{fontSize:15}}>Confirmar senha</FormLabel>
            <FormInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setState({passwordConfirm: text})}/>
          </View>
          <View>
            <Button textStyle={{fontSize: 16}} buttonStyle={styles.botao} title="CADASTRAR" onPress={() => this.cadastrar()} />
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
    marginTop: height*0.05
  },
  label:{
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: 'black',
    height: height*0.7,
    width: width*0.9,
  },
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 10,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
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
  mensagemModal: {
    fontSize: 18,
    height: height*0.1,
    marginTop: height*0.1,
    textAlign: 'center'
  }
})
