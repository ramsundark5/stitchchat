import React from 'react';
import ReactNative from 'react-native';
const {
    PropTypes,
} = React;

const {
    Text,
    TouchableOpacity,
    View,
} = ReactNative;

import Component from '../PureComponent';
import {styles} from './styles';
import {Theme} from '../common/Themes';
import { Platform } from 'react-native';

export default class NavbarButton extends Component {
    render() {
        const { style, tintColor, margin, title, handler } = this.props;

        return (
            <TouchableOpacity onPress={handler}>
                <View style={style}>
                <Text style={[styles.navBarButtonText, { color: tintColor }, ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        tintColor: PropTypes.string,
        title: PropTypes.string,
        handler: PropTypes.func,
    };

    static defaultProps = {
        style: {},
        title: '',
        tintColor: Platform.OS == 'ios' ? '#0076FF' : Theme.defaultTextColor,
        onPress: () => ({}),
    };
}