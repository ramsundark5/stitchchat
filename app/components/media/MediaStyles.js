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
        backgroundColor: 'transparent',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        position: 'absolute',
        width: 300,
        height: 80,
        bottom: 35,
    },
    optionsIconContainer:{
        margin: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionIcon:{
        color: 'white',
        fontSize: 35
    }
});
