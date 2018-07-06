class LibraryImporter {	
	static getImagePicker(){
		return require('react-native-image-picker')
	}
	
	static getToast(){
		return require('@remobile/react-native-toast');
	}

	static getWheelPicker(){
		return require("./view/component/WheelPicker");
	}
}

export default LibraryImporter;