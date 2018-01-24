import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, Button, Image,ScrollView, ReactNative, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native';
import logo from './../message.png';
import Modal from "react-native-modal";
import senhaIncorreta from './../senha_incorreta.jpg';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { stringify } from 'querystring';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
        email: '',
        password: '',
        isVisible: false,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    };
    this.logar = this.logar.bind(this);
    this.logarCallback = this.logarCallback.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('logado',this.logarCallback);
  }

  logarCallback(user){
    const {navigate} = this.props.navigation; 
    if(user == false){
      this.setState({isVisible: true});
    }else{
      navigate('Contatos', {id: user.id});
    }
  }

  logar(){
    this.socket.emit('login',[this.state.email, this.state.password]);
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Image source={senhaIncorreta} style={styles.erro_senha} />
      {this._renderButton("Ok", () => this.setState({ isVisible: false }))}
    </View>
  );

  render() {
    const { navigate } = this.props.navigation;
    const height = this.state.height;
    const width = this.state.width;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.isVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          {this._renderModalContent()}
        </Modal>
        <View style={{marginTop: 0.05*width, marginBottom: 0.05*width, }}> 
          <Image source={logo} style={styles.logo}></Image>
        </View>
        <View>
          <Button title="preencher" onPress={() => {this.setState({email: "gmrodrigoborges@gmail.com"}, this.setState({password: "123"}))}} />
        </View>
        <View>
          <TextInput style={styles.input} onChangeText={email => this.setState({ email })} value={this.state.email} underlineColorAndroid={'white'} keyboardType="email-address" placeholder="E-mail"/>
        </View>
        <View>
          <TextInput style={styles.input} onChangeText={password => this.setState({ password })} value={this.state.password} secureTextEntry={true} underlineColorAndroid={'white'} placeholder="Password"/>
        </View>
        <View>
          <View style={styles.botao}>
              <Button  onPress={() => this.logar()} style={styles.botao} title="Log in" color="#00cc99"/>
          </View>
        </View>
        <View>
          <View style={styles.avisos}>
            <View>
              <Text style={styles.mensagemInferior}>Esqueceu seu email ou senha?</Text>
            </View>
            <View>
              <Text onPress={() => navigate('Cadastro') } style={styles.mensagemInferior}>Cadastre-se aqui</Text>
            </View>
          </View>
        </View>
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
    width: 0.4*width,
    height: 0.4*width,
    backgroundColor: '#99bbff', 
  },  
  erro_senha: {
    width: width*0.8,
    height: height*0.42,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  input: {
    width: 250,
    height: 50,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'grey',
    borderBottomWidth: 0,
    backgroundColor: 'white',
    padding: 10,
    color:'black',
    borderRadius: 15,
  },
  botao: {
    marginTop: 25
  },
  avisos: {
    alignItems: 'center',
    marginTop:30,
  },
  mensagemInferior:{
    fontSize: 16
  },
  button: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,    
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: height*0.08,
    width: width*0.8,
  },
  modalContent: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "grey",
    width: width*0.8,
    marginLeft: width*0.05,

    height: height*0.5,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
})