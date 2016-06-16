import React, {PropTypes} from 'react';
import {View, TextInput, TouchableHighlight, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageService from '../../services/MessageService';
import {Theme} from '../common/Themes';
import Component from '../PureComponent';
const { width } = Dimensions.get('window');
const DEFAULT_TEXT_INPUT_HEIGHT = 30;

class MessageTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: '',
            height: 0,
            bottom: 5
        };
        this.keyBoardHeight = 0;
    }

     handleSubmit(currentThread) {
         this.refs.textInput.blur();
        console.log('submit is called');
        let messageText = this.state.text;
        if (messageText.length > 0) {
            MessageService.handleOutgoingTextMessage(currentThread, messageText);
        }
        this.setState({text: '', height: 0, bottom: 5});
    }

    handleChange(event) {
        let textInputHeight = event.nativeEvent.contentSize.height;
        let newBottomPosition = this.keyBoardHeight;
        if(textInputHeight > DEFAULT_TEXT_INPUT_HEIGHT){
            newBottomPosition = textInputHeight - DEFAULT_TEXT_INPUT_HEIGHT;
        }
        this.setState({
            text: event.nativeEvent.text,
            height: textInputHeight,
            bottom: newBottomPosition
        });
    }

    onKeyboardWillHide(e) {
        this.keyBoardHeight = 0;
        this.setState({
            bottom: 5,
        });
    }

    onKeyboardWillShow(e) {
        this.keyBoardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height;
        let newBottomPosition = this.keyBoardHeight;
        console.log('newHeight is '+this.keyBoardHeight);
        this.setState({
            bottom: newBottomPosition,
        });
    }

    render() {
        const {currentThread} = this.props;
        return (
            <View style={styles.horizontalNoWrap}
                  onKeyboardWillShow={(event) => this.onKeyboardWillShow(event)}
                  onKeyboardWillHide={(event) => this.onKeyboardWillHide(event)}>
                <TextInput
                    ref='textInput'
                    placeholder={this.props.placeholder}
                    multiline={true}
                    value={this.state.text}
                    style={[this.props.style, {
                            height: Math.max(DEFAULT_TEXT_INPUT_HEIGHT, this.state.height),
                            bottom: this.state.bottom
                            }]}
                    onChange={(event) => this.handleChange(event)} />

                <TouchableHighlight style={[styles.sendMessageContainer]}
                                  onPress={() => this.handleSubmit(currentThread)}>
                    <Icon name='md-send'
                        style={styles.sendIcon} />
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sendMessageContainer:{
        paddingLeft: 10,
        paddingRight: 2
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap',
        //below is required for autogrow textinput
        position: 'absolute',
        width: width - 35
    },
    sendIcon: {
        // padding: 4,
        fontSize : 30,
        color: Theme.iconColor,
        paddingRight: 8
    },
});

MessageTextInput.propTypes = {
    addMessage: PropTypes.func.isRequired,
    currentThread: PropTypes.object.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string
};

export default MessageTextInput;
