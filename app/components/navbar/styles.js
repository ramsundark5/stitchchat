import {Theme} from '../common/Themes';
import { Platform } from 'react-native';
const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

export const styles = {
  navBarContainer: {
    backgroundColor: Platform.OS == 'ios' ? '#FAFAFA': Theme.primaryColor,
    paddingBottom: 5,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
  navBarButton: {
    marginTop: 16,
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 12,
    color: Platform.OS == 'ios' ? '#0076FF' : Theme.defaultTextColor,
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: Platform.OS == 'ios' ? '#0076FF' : Theme.defaultTextColor,
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
  },
  tintColor:{
    color: Platform.OS == 'ios' ? '#0076FF' : Theme.defaultTextColor,
  }
};