import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';

/**
 * @class UserAvatar
 * @extends React.Component
 *
 * @author https://github.com/bltnico
 * @url https://github.com/bltnico/react-user-avatar
 * @version 1.0.3
 *
 * @example
 *
 * <UserAvatar
 *     size={100}
 *     style={styles.useravatar}
 *     textStyle={styles.useravatarText}
 *     onPress={this.doSomething}
 *     onPressIn={this.doSomething}
 *     onPressOut={this.doSomething}
 *     onLongPress={this.doSomething}
 *     username="bltnico"
 *     borderStyle={false}
 *     textLength={2}
 *     textColor="#ffffff" />
 *
 */
export default class UserAvatar extends React.Component {

    /**
     * Constructor
     *
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            color: "0000",
            text : null
        }
    }

    /**
     * @static getColor
     * @param {String} str
     * @return {String}
     */
    static getColor(str) {
        return this.intToRGB(this.hashCode(str));
    }

    componentDidMount() {
        this.setState({
            color : this.getColor(),
            text : this.getText()
        });
    }

    /**
     * Thanks to Cristian Sanchez
     * @url http://stackoverflow.com/a/3426956/4185200
     *
     * @param {String} str
     * @return {String}
     */
    hashCode(str) {
        let hash = 0, i = 0;
        for(i; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return hash;
    }

    /**
     * Thanks to Cristian Sanchez
     * @url http://stackoverflow.com/a/3426956/4185200
     *
     * @param {Integer} int
     * @return {String}
     */
    intToRGB(i) {
        let c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
    }

    /**
     * Get color with username
     * @return {String}
     */
    getColor() {
        let hash = this.hashCode(this.props.username);
        return this.intToRGB(hash);
    }

    /**
     * Get text with username
     * @return {String}
     */
    getText() {
        let f, l;
        f = this.props.username.substr(0,1);
        l = this.props.username.substr(this.props.username.length - 1, this.props.username.length);
        return (f + l).toUpperCase();
    }

    /**
     * Event when user press on user avatar
     * @return {Function}
     */
    _onPress() {
        return this.props.onPress();
    }

    /**
     * Event when user exec a long press on user avatar
     * @return {Function}
     */
    _onLongPress() {
        return this.props.onLongPress();
    }

    /**
     * Event when user press in user avatar
     * @return {Function}
     */
    _onPressIn() {
        return this.props.onPressIn();
    }

    /**
     * Event when user release user avatar
     * @return {Function}
     */
    _onPressOut() {
        return this.props.onPressOut();
    }

    /**
     * Get user avatar container style
     * @return {Object}
     */
    getContainerStyle() {
        return {
            backgroundColor : (!this.props.borderStyle) ? "#" + this.state.color : "transparent",
            borderRadius : this.props.size / 2,
            width : this.props.size,
            height : this.props.size
        };
    }

    /**
     * Get text style
     * @return {Object}
     */
    getTextStyle() {
        return {
            color : (!this.props.borderStyle) ? this.props.textColor : this.state.color,
            fontSize : (this.props.size / 3)
        };
    }

    /**
     * Render UserAvatar component
     * @return {String}
     */
    render() {

        return (
            <TouchableWithoutFeedback
                onPress={this._onPress.bind(this)}
                onLongPress={this._onLongPress.bind(this)}
                onPressIn={this._onPressIn.bind(this)}
                onPressOut={this._onPressOut.bind(this)} >

                <View style={[ styles.container, this.getContainerStyle() ,this.props.style ]}>
                    <Text style={[ this.getTextStyle(), this.props.textStyle ]}>{this.state.text}</Text>
                </View>

            </TouchableWithoutFeedback>
        );
    }

}

let styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        justifyContent : 'center'
    }
});

/**
 * Define UserAvatar propTypes
 */
UserAvatar.propTypes = {
    username : React.PropTypes.string.isRequired,
    style : React.PropTypes.object,
    textStyle : React.PropTypes.object,
    size : React.PropTypes.number,
    onPress : React.PropTypes.func,
    onPressIn : React.PropTypes.func,
    onPressOut : React.PropTypes.func,
    onLongPress : React.PropTypes.func,
    textLength : React.PropTypes.number,
    textColor : React.PropTypes.string,
    borderStyle : React.PropTypes.bool,
};

/**
 * Init default UserAvatar props
 */
UserAvatar.defaultProps = {
    size : 100,
    onPress : () => {},
    onPressIn : () => {},
    onPressOut : () => {},
    onLongPress : () => {},
    textLength : 2,
    textColor : "#ffffff",
    borderStyle : false
};