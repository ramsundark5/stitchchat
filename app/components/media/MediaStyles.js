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
    }
});
