import React,{ Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
const USER_ID = '@userId';

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      id: this.props.navigation.state.params.id,
    };
    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
    this.socket = SocketIOClient('http://192.168.11.51:3000', { timeout: 30000 });
    this.socket.on('message', this.onReceivedMessage);
    this.determineUser();
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.contact.name}`,
  });

  componentWillMount(){
  }

  determineUser() {
    this.socket.emit('userJoined', [this.props.navigation.state.params.id, this.props.navigation.state.params.contact.id]);
  }
  
  onReceivedMessage(messages) {
    this._storeMessages(messages);
  }
  
  onSend(messages=[]) {
    this.socket.emit('message', messages[0]);
    this._storeMessages(messages);
  }
  
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    var user = { _id: this.props.navigation.state.params.id || -1 };
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={user}
          showUserAvatar={true}
          renderAvatarOnTop={true}
          keyboardShouldPersistTaps={'never'}
        />
        <KeyboardSpacer />
      </View>
    )
  }

}