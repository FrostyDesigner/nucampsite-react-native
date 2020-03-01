import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
//import {createBottomTabNavigator} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import * as ImageManipulator from 'expo-image-manipulator';


class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='sign-in'
                type='font-awesome'
                iconStyle={{ color: tintColor }}
            />
        )
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify(
                { username: this.state.username, password: this.state.password }
            )).catch(error => console.log('Could not save user info', error));
        } else {
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log('Could not delete user info', error));
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then(userdata => {
                const userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true });
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <CheckBox
                    title='Remember Me'
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.handleLogin()}
                        title="Login"
                        icon={
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{ marginRight: 10 }}
                            />
                        }
                        buttonStyle={{ backgroundColor: '#5637DD' }}
                    />
                </View>
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Register')}
                        title="Register"
                        type='clear'
                        icon={
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                color='blue'
                                iconStyle={{ marginRight: 10 }}
                            />
                        }
                        titleStyle={{ color: 'blue' }}
                    />
                </View>
            </View>
        );
    }
}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        };
    }
    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='user-plus'
                type='font-awesome'
                iconStyle={{ color: tintColor }}
            />
        )
    }


    // find the getImageFromCamera method. Outside of this method and below it, create a new method named processImage as an asynchronous method, giving it a single parameter of imgUri. 
    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            const capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                this.processImage(capturedImage.uri);
            }
        }
    }
    
    // Create async method: Create an asynchronous method named getImageFromGallery.
    getImageFromGallery = async () => {
        // Ask for permission to access the camera roll: Inside the async method, ask for permissions using the Permissions API to access the camera roll, 
        // storing the return value inside a const named cameraRollPermissions. This will look exactly like what we did during the week in the getImageFromCamera method.
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // Open the image gallery: If permission is granted, then set up an await for the ImagePicker.launchImageLibraryAsync method and assign its return value to a constant named capturedImage. 
        // The launchImageLibraryAsync method should allow editing and force an aspect ratio of 1:1, exactly as the launchCameraAsync method does. 
        if (cameraRollPermission.status === 'granted') {
            const capturedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                // Log to the console and process the image: If the image picking from the gallery process was not canceled, then log the details of the capturedImage to the console, then call the processImage method, passing it the uri property of the capturedImage object.
                console.log(capturedImage);
                // Call the processImage method: In the getImageFromCamera method, locate the call to setState where the imageUrl state property is being set to capturedImage.uri. 
                // Delete this line and replace it with a call to the processImage method, passing it the capturedImage.uri as its sole argument.
                this.processImage(capturedImage.uri);
            }
        }
    }

    // Create a new image: Inside the async method, set up an await for the ImageManipulator.manipulateAsync method, and assign its return value to a constant named processedImage. 
    // Update imageUrl state: Then, still inside the processImage method, 
    // Test: Test that when you click the Camera button in the Register screen then take a photo, once you have finished taking the photo, your console shows that a new image was created with a 400px width and a PNG file format. 

    processImage = async (imgUri) => {
        let processedImage = await ImageManipulator.manipulateAsync(
            imgUri,
            [{ resize: { width: 400 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        // Log new image details to console: 
        console.log(processedImage);
        // use setState to update the imageUrl property of the RegisterTab component's state to processedImage.uri, which should contain the uri of the new resized PNG image that you created.
        this.setState({ imageUrl: processedImage.uri });

    };


    handleRegister() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify(
                { username: this.state.username, password: this.state.password }
            )).catch(error => console.log('Could not save user info', error));
        } else {
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log('Could not delete user info', error));
        }
    }

    
    // Add Gallery button: Using RNE's Button component, create a Button with the title "Gallery" that will appear next to the Camera Button in the Register screen.
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={require('./images/logo.png')}
                            style={styles.image}
                        />
                        <Button
                            title='Camera'
                            onPress={this.getImageFromCamera}
                        />
                        <Button
                            title='Gallery'
                            onPress={this.getImageFromGallery}
                        />
                    </View>
                    <Input
                        placeholder='Username'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={username => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Password'
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='First Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Last Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Email'
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <CheckBox
                        title='Remember Me'
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title="Register"
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    color='#fff'
                                    iconStyle={{ marginRight: 10 }}
                                />
                            }
                            buttonStyle={{ backgroundColor: '#5637DD' }}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }

}

const Login = createBottomTabNavigator(
    {
        Login: LoginTab,
        Register: RegisterTab
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#5637DD',
            inactiveBackgroundColor: '#CEC8FF',
            activeTintColor: '#fff',
            labelStyle: { fontSize: 16 }
        }
    }
);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 10
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 8,
    },
    formCheckbox: {
        margin: 8,
        backgroundColor: null
    },
    formButton: {
        margin: 20,
        marginLeft: 40,
        marginRight: 40
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10
    },
    image: {
        height: 60,
        width: 60
    }
})

export default Login;