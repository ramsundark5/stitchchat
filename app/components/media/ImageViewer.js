import React, {Component, PropTypes} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import { Dimensions } from 'react-native';

class ImageViewer extends Component{

    render() {
        const{uri} = this.props;
        return (
            <View  style={styles.slide}>
                <Image style={styles.image}
                       source={{uri: uri}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        //justifyContent: 'center',
        backgroundColor: 'black',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    image: {
        flex: 1,
    },
});
export default ImageViewer;