import * as React from 'react';
import { useState } from "react";
import { Text, View, StyleSheet, Image, TextInput } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

export default function LogIn() {
    const [usernameText, setUsernameText] = React.useState("");
    const [passwordText, setPasswordText] = React.useState("");
    
    return (
        <View style={styles.container}>
            <Image
                style={styles.fspotLogo}
                source={require('../assets/fspotlogoblue.png')}
            />
            
            <View style={{width: 275, alignSelf: "center"}}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setUsernameText(text)}
                    value={usernameText}
                    autoComplete="username"
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
                        formData.append('method', 'logIn');
                        formData.append('userName', usernameText);
                        formData.append('password', passwordText);
                        fetch("http://lennonstolk.nl/apis/F-Spot/userController.php", {
                            method: 'POST',
                            body: formData
                        })
                        .then(r => r.json())
                        .then(r => alert(r));
                        return;
                    }}
                >
                    <Text style={styles.logInButtonText}>Sign In</Text>
                </Pressable>
            </View>
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
        marginBottom: 200,
        marginTop: 20,
        backgroundColor: "#008faf",
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
        marginBottom: 150,
    },
    input: {
        borderBottomColor: "#008faf",
        borderBottomWidth: 1,
        height: 40,
        padding: 0,
        marginBottom: 30,
        color: "#008faf",
    },
    inputLabel: {
        color: "#008faf", 
        fontWeight: "bold", 
        fontSize: 15,
    }
});