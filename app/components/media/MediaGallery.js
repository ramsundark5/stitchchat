import React, { Component, View, ScrollView, ListView, Image, CameraRoll, TouchableHighlight, PropTypes } from 'react-native';
import MediaGalleryHeader from './MediaGalleryHeader';
import {mediaStyle} from './MediaStyles';
import {commons, defaultStyle} from '../styles/CommonStyles';

const MEDIA_FETCH_LIMIT = 25;

class MediaGallery extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            images: [],
            selected: '',
            endCursor: 0,
            hasNextPage: false,
            isSelecting: false
        };
    }

    componentDidMount() {
        const fetchParams = {
            first: MEDIA_FETCH_LIMIT,
        };
        CameraRoll.getPhotos(fetchParams, this.displayImages.bind(this), this.logImageError.bind(this));
    }

    fetchPhotos(endCursor, numberOfPhotos){
        const fetchParams = {
            first: numberOfPhotos,
            after: endCursor
        };
        CameraRoll.getPhotos(fetchParams, this.displayImages.bind(this), this.logImageError.bind(this));
    }

     displayImages(data) {
        const assets = data.edges;
        let endCursor = data.page_info.end_cursor;
        let hasNextPage = data.page_info.has_next_page;
        const images = assets.map((asset) => asset.node.image);
        let appendedImages = this.state.images.concat(images);
        this.setState({
            images: appendedImages,
            endCursor: endCursor,
            hasNextPage: hasNextPage
        });
    }

    logImageError(err) {
        console.log(err);
    }

    selectImage(image) {
        console.log('selected uri is :'+image.uri);
        image.selected = !image.selected;
        this.forceUpdate();
    }

    loadMoreImages(){
        let hasNextPage = this.state.hasNextPage;
        let endCursor   = this.state.endCursor;
        if(hasNextPage){
            this.fetchPhotos(endCursor, MEDIA_FETCH_LIMIT);
        }
    }

    render() {
        const {router} = this.props;
        let imagesDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2});

        /*let lotOfImages = [];
        const images = this.state.images;
        if(images.length > 0){
            for (let i = 0; i < 100; i++) {
                if(i%2 == 0){
                    lotOfImages[i] = this.state.images[0];
                }
                else{
                    lotOfImages[i] = this.state.images[1];
                }
            }
        }
         imagesDS = imagesDS.cloneWithRows(lotOfImages);*/

        imagesDS = imagesDS.cloneWithRows(this.state.images);
        const selectedMedias = this.state.images.filter(image =>
            image.selected === true
        );

        return (
            <View style={commons.container}>
                <MediaGalleryHeader
                    selectedMedias={selectedMedias}
                    router={router}/>
                <ListView contentContainerStyle={mediaStyle.imageGrid}
                        dataSource={imagesDS}
                        renderRow={this.renderImage.bind(this)}
                        onEndReached={this.loadMoreImages.bind(this)}
                        onEndReachedThreshold ={25}
                />
            </View>
        );
    }

    renderImage(image) {
        let imageContainerStyle = mediaStyle.unselectedImage;
        if(image.selected){
            imageContainerStyle = mediaStyle.selectedImage;
        }

        return (
            <TouchableHighlight key={image.uri}
                                onPress={() => this.selectImage(image)}
                                style={imageContainerStyle}>
                <Image style={mediaStyle.image} source={{ uri: image.uri }} />
            </TouchableHighlight>
        );
    }
}

export default MediaGallery;