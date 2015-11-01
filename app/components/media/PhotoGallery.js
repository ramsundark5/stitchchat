import React, { Component, View, ScrollView, Image, CameraRoll, TouchableHighlight, NativeModules, PropTypes } from 'react-native';
import FileUploadService from '../../services/FileUploadService';
import {HelloManager} from 'NativeModules';
import {mediaStyle} from './MediaStyles';

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
        CameraRoll.getPhotos(fetchParams, this.displayImages.bind(this), this.logImageError.bind(this));
    }

     displayImages(data) {
        const assets = data.edges;
        const images = assets.map((asset) => asset.node.image);
        this.setState({images: images});
    }

    logImageError(err) {
        console.log(err);
    }

    selectImage(uri) {
        console.log('selected uri is :'+uri);
        FileUploadService.getSignedUrl(uri);
        /*NativeModules.ReadImageData.readImage(uri, (image) => {
            this.setState({
                selected: image,
            });
            console.log(image);
        });*/
    }

    render() {
        return (
            <ScrollView style={mediaStyle.container}>
                <View style={mediaStyle.imageGrid}>
                    { this.state.images.map((image) => {
                        return (
                            <TouchableHighlight key={image.uri} onPress={this.selectImage.bind(null, image.uri)}>
                                <Image style={mediaStyle.image} source={{ uri: image.uri }} />
                            </TouchableHighlight>
                        );
                    })
                    }
                </View>
            </ScrollView>
        );
    }
}

export default PhotoGallery;