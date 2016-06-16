import React, {Component} from 'react';
import {View, ActivityIndicatorIOS, ProgressBarAndroid, Platform} from 'react-native';

class LoadingSpinner extends Component{

    _getSpinner(height, size) {
        if (Platform.OS === 'android') {
            let spinnerHeight = height || 20;
            return (
                <ProgressBarAndroid
                    style={{height: spinnerHeight,}}
                    styleAttr="Inverse"
                    {...this.props}
                />
            );
        } else {
            return (
                <ActivityIndicatorIOS
                    animating={true}
                    size={size || "small"}
                    {...this.props}
                />
            );
        }
    }

    render(){
        const {height, size} = this.props;
        return (
            <View>
                {this._getSpinner(height, size)}
            </View>
        );
    }
}


export default LoadingSpinner;