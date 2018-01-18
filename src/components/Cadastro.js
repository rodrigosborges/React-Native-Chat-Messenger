import React, { Component } from 'react';
import { Alert, AppRegistry, StyleSheet, View , Text, TextInput, ReactNative, TouchableOpacity,Label, Dimensions, ScrollView} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Modal from "react-native-modal";
import {Button} from 'react-native-elements';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
    };
  }

  cadastrar(){
    const { navigate } = this.props.navigation;
    const { goBack } = this.props.navigation;
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
      <Text>Dados inválidos</Text>
      {this._renderButton("Fechar", () => this.setState({ isVisible: false }))}
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
