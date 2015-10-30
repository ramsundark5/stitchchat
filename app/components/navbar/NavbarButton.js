import React from 'react-native';
const {
    Text,
    TouchableOpacity,
    View,
    PropTypes,
    } = React;
import Component from '../PureComponent';
import styles from './styles';
import {defaultStyle, commons} from '../styles/CommonStyles';

export default class NavbarButton extends Component {

    render() {
        const { style, tintColor, margin, title, handler } = this.props;

        return (
            <TouchableOpacity onPress={handler}>
              <View style={style}>
                <Text style={[styles.navBarButtonText, { color: defaultStyle.headerColor }, ]}>{title}</Text>
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
  }

}
