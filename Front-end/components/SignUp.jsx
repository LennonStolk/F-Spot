import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { StatusBar } from 'expo-status-bar';
import { Context } from '../Store';

export default function SignUp({ navigation }) {
    const [usernameText, setUsernameText] = React.useState("");
    const [passwordText, setPasswordText] = React.useState("");
    const [emailText, setEmailText] = React.useState("");
    const [errorText, setErrorText] = React.useState("");
    const [state, setState] = React.useContext(Context);

    return (
        <View style={styles.container}>
            
            <View style={{width: 275, alignSelf: "center"}}>
                <View style={ (errorText == "") ? styles.errorSection : styles.errorSectionVisible}>
                    <Text style={styles.errorText}>
                        {errorText}
                    </Text>
                    <Pressable style={styles.dismissErrorButton}
                        onPress={() => {
                            setErrorText("");
                        }}
                    >
                        <Image
                            style={styles.dismissErrorIcon}
                            source={require('../assets/dismisserror.png')}
                        />
                    </Pressable>
                </View>

                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setUsernameText(text)}
                    value={usernameText}
                    autoComplete="username"
                />
                <Text style={styles.inputLabel}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setEmailText(text)}
                    value={emailText}
                    autoComplete="email"
                />
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setPasswordText(text)}
                    value={passwordText}
                    autoComplete="password"
                    secureTextEntry={true}
                />
                <Pressable style={styles.logInButton}
                    onPress={() => {
                        let formData = new FormData();
                        formData.append('method', 'createAccount');
                        formData.append('userName', usernameText);
                        formData.append('password', passwordText);
                        formData.append('email', emailText);
                        fetch("http://lennonstolk.nl/apis/F-Spot/userController.php", {
                            method: 'POST',
                            body: formData
                        })
                        .then(r => r.json())
                        .then(r => {
                            if (r == "successfullyMadeAccount") {
                                setErrorText("");
                                navigation.navigate(('LogIn'));
                            }
                            else {
                                setErrorText(readableErrorMessage(r));
                            }                        
                        });
                        return;
                    }}
                >
                    <Text style={styles.logInButtonText}>Sign Up</Text>
                </Pressable>
                <Pressable style={styles.backButton} onPress={() => navigation.navigate("LogIn")}>
                    <Text style={styles.backButtonText}>Back to Log In</Text>
                </Pressable>
            </View>
            <StatusBar barStyle="light-content" backgroundColor="#333a40"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 4,
        backgroundColor: '#333a40',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#ffffff",
    },
    logInButton: {
        alignSelf: 'flex-end',
        marginRight: 0,
        marginBottom: 50,
        marginTop: 20,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        width: 90,
    },
    logInButtonText: {
        color: "#333a40",
    },
    fspotLogo: {
        width: 360,
        height: 210,
        marginBottom: 50,
        alignSelf: 'center',
    },
    input: {
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        height: 40,
        padding: 0,
        marginBottom: 30,
        color: "#fff",
    },
    inputLabel: {
        color: "#fff", 
        fontWeight: "bold", 
        fontSize: 15,
    },
    errorSection: {
        backgroundColor: "#dd4444",
        padding: 10,
        borderRadius: 5,
        marginBottom: 30,
        opacity: 0,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    errorSectionVisible: {
        backgroundColor: "#dd4444",
        padding: 10,
        borderRadius: 5,
        marginBottom: 30,
        opacity: 1,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    errorText: {
        color: "#660000",
    },
    dismissErrorButton: {
        alignSelf: "flex-end",
        width: 20,
        height: 20,
    },
    dismissErrorIcon: {
        width: 20,
        height: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginRight: 0,
        marginBottom: 0,
        top: -93,
        backgroundColor: "#2d3338",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        width: 130,
    },
    backButtonText: {
        color: "#ccc",
    }
});

const readableErrorMessage = (error) => {
    let dictionary = {
        "emptyFields": "Fields can not be empty",
        "nameDoesntExist": "This username doesn't exist",
        "wrongPassword": "The password was incorrect",
        "successfullyLoggedIn": "Successfully logged In!",
        "invalidEmail": "This email address is invalid",
        "nameAlreadyExists": "This username is already registered",
        "emailAlreadyExists": "This e-mail is already registered",
        "nameTooLong": "This username is too long",
        "emailTooLong": "This e-mail is too long",
        "passwordCantBeHashed": "This password is invalid",
        "illegalCharacters": "This username is invalid",
    }
    if (dictionary[error] != undefined) {
        return dictionary[error];
    }
    return error;
}