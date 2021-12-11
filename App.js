import React, { Component } from 'react';
import { StyleSheet, Image, View, Button } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const GOOGLE_CLOUD_VISION_API_KEY="Api Key";



const options = {
	title: 'Seçiniz...',
	
	storageOptions: {
		skipBackup: true,
		path: 'images',
	},
	allowsEditing: true
};

export default class App extends Component<Props> {

	state = {
		avatarSource: null,
		image: null,
		uploading: false,
		googleResponse: null
	};

	onSelectPicture = () => {
		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.uri };

				this.setState({
					avatarSource: source,
				});

				this.uploadPhoto(response);
				//this.submitToGoogle(response.fileName);
				
			}
		});
	};

	uploadPhoto = async response => {


		try {

			await storage().ref(response.fileName).putFile(response.uri);
			this.submitToGoogle(response.fileName);

		} catch (error) {
			console.log(error);
		};



	}
	submitToGoogle = async (url) => {
		try {
		  console.log("response.fileName::"+url);
		  let body = JSON.stringify({
			requests: [
			  {
				features: [
				 { type: "OBJECT_LOCALIZATION", maxResults: 10 },
				],
				image: {
				  source: {
					//imageUri:"https://storage.googleapis.com/imageprocessing-a3e5c.appspot.com/apb4.jpg"
					imageUri: "https://storage.googleapis.com/imageprocessing-a3e5c.appspot.com/"+url
				  }
				}
			  }
			]
		  });
		  let response = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=AIzaSyARCPokihUBznlZJffd6LlLo4EV5ALZjjU",
			{
			  headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			  },
			  method: "POST",
			  body: body
			}
		  );
		  let responseJson = await response.json();
		  console.log(JSON.stringify(responseJson));
	
		  //nesneler=responseJson.responses[0].localizedObjectAnnotations;
		  
		} catch (error) {
		  console.log(error);
		}
	  };

	




	render() {
		
		return (
			<View style={styles.container}>
				<Image source={this.state.avatarSource} style={{ width: 200, height: 200 }} />
				<Button
					title={"Fotoğraf Seç"}
					onPress={this.onSelectPicture}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	}
});