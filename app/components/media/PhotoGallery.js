import React, { Component, StyleSheet, View, ScrollView, Image, CameraRoll, TouchableHighlight, NativeModules, PropTypes } from 'react-native';
import FileUploadService from '../../services/FileUploadService';
import {HelloManager} from 'NativeModules';

class PhotoGallery extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            images: [],
            selected: ''
        };
    }

    componentDidMount() {
        const fetchParams = {
            first: 25,
        };
        CameraRoll.getPhotos(fetchParams, this.storeImages.bind(this), this.logImageError.bind(this));
    }

    async storeImages(data) {
        try{
            let result =  await HelloManager.sayHello("hello buddy");
            console.log('swift output is '+ result);
        }catch(error){
            console.log('error '+ error);
        }

        const assets = data.edges;
        const images = assets.map((asset) => asset.node.image);
        this.setState({images: images});
    }

    logImageError(err) {
        console.log(err);
    }

    selectImage(uri) {
        NativeModules.ReadImageData.readImage(uri, (image) => {
            this.setState({
                selected: image,
            });
            console.log(image);
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imageGrid}>
                    { this.state.images.map((image) => {
                        return (
                            <TouchableHighlight key={image.uri} onPress={this.selectImage.bind(null, image.uri)}>
                                <Image style={styles.image} source={{ uri: image.uri }} />
                            </TouchableHighlight>
                        );
                    })
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    }
});

export default PhotoGallery;