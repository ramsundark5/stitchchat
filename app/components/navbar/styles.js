import {defaultStyle, commons} from '../styles/CommonStyles';

const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

module.exports = {
  navBarContainer: {
    height: NAV_HEIGHT,
    backgroundColor: defaultStyle.bgColor,
    paddingBottom: 5,
    borderBottomColor: 'rgba(0, 0, 0, .5)',
    borderBottomWidth: .5,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_HEIGHT,
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
    marginTop: 16,
    marginLeft: 7,
    marginRight: 7,
    letterSpacing: 0.5,
    color: defaultStyle.headerColor
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: defaultStyle.headerColor,
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
  },
};
