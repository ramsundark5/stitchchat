import { StyleSheet } from 'react-native';
import {defaultStyle, commons} from '../styles/CommonStyles';

export const mediaStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    },
    unselectedImage:{
        backgroundColor: defaultStyle.selectedColor,
    },
    selectedImage:{
        backgroundColor: defaultStyle.selectedColor,
    },
    optionsModal: {
        backgroundColor: 'red',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 250,
        height: 100,
        bottom: 35,
    },
});
