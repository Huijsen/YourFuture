import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 30,
    zIndex: -10,
  },
  taskInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: 16,
    paddingVertical: 4,
  },

  line: {
    width: '100%',
    height: 2,
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    top: 75,
  },

  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 10,
  },

  archiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // or '80%' for relative sizing
    height: 50, // adjust as needed
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },

  archiveText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'grey',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // For Android shadow
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },

  textbox1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10, // or '80%' for relative sizing
    height: 55, // adjust as needed
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#BEBEBE',
    position: 'relative',
  },
  box1text: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
    position: 'relative',
  },

  dashedLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    marginTop: 10,
  },

  taskList: {
    marginTop: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    maxHeight: '90%',
  },

  boxscroll: {
    marginHorizontal: 20,
    maxHeight: '90%',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  squareBox: {
    width: 25,
    height: 25,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  subtaskBox: {
    height: 20,
    width: 20,
    borderRadius: 3,
    borderColor: 'grey',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  taskText: { fontSize: 18, color: 'black' },
  strikedText: { textDecorationLine: 'line-through', color: 'grey' },
  subtitleText: { fontSize: 14, marginTop: 2, color: 'grey' },
  subtitleText2: { fontSize: 14, marginTop: 2, color: 'black' },

  middleIcons: {
    position: 'absolute',
    bottom: 20,
    left: '15%',
    right: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    paddingVertical: 5,
    paddingHorizontal: 50,
    borderRadius: 20,
    gap: 30,
    zIndex: 10000,
    elevation: 10000,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 32,
    borderBottomWidth: 0,
    borderBottomColor: '#ccc',
    paddingTop: 6,
    marginBottom: 1,
    fontWeight: 'bold',
  },
  modalDesc: {
    fontSize: 18,
    borderWidth: 0,
    borderColor: '#ccc',
    paddingBottom: 0,
    borderRadius: 6,
    minHeight: 25,
    textAlignVertical: 'top',
  },

  taskDetailPageContainer: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // add this
  },
  subtaskPageContainer: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // add this
  },

  subtaskText: { fontSize: 16 },

  dropdown: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 100,
    zIndex: 999,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
  },

  dropdownStyle: {
    position: 'absolute',
    top: 20, // right below the button
    right: 0, // aligned to the right edge
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'flex-start', // left align text inside dropdown
  },
});
