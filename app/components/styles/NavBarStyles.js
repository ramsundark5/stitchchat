import React, { StyleSheet } from 'react-native';

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

export const navStyle = StyleSheet.create({
    navBarContainer: {
        height: NAV_HEIGHT,
        backgroundColor: '#ff0000',
        paddingBottom: 5,
        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
        borderBottomWidth: 1 / React.PixelRatio.get(),
    },

    opaqueSceneStyle: {
        backfaceVisibility : 'hidden',
    }
});