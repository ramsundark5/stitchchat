const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

module.exports = {
  navBarContainer: {
    height: NAV_HEIGHT,
    //backgroundColor: 'white',
    backgroundColor: '#ff0000',
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
    letterSpacing: 0.5,
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
  },
};
