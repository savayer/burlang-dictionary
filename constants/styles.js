import colors from './colors';

const appStyles = {
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -15,
  },
  input: {
    marginTop: 20,
    padding: 10,
    paddingRight: 40,
    borderColor: colors.neutral400,
    borderRadius: 5,
    borderWidth: 1,
  },
  langSwitcher: {
    marginLeft: 'auto',
    position: 'absolute',
    top: 33,
    right: 10,
  },
  title: {
    fontSize: 20,
    color: '##525252',
    fontWeight: 'medium',
    borderBottomWidth: 0.7,
    borderBottomColor: colors.neutral300,
    paddingBottom: 4,
    marginTop: 20,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.yellow,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
};

export default appStyles;
