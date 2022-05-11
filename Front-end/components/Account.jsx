import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from './Navbar';
import { Context } from '../Store';

export default function Account({ navigation }) {
    const [state, setState] = React.useContext(Context);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Account</Text>
                {/* Log out button */}
                <Pressable 
                    style={styles.topBarButton}
                    onPress={() => {
                        setState({
                            ...state, 
                            username: "", 
                            password: "", 
                            email: "", 
                            playlists: [], 
                            loadedPlaylists: false, 
                            playlistEntries: [],
                            selectedPlaylistId: 0,
                            selectedPlaylist: "",
                        });
                        navigation.navigate(('LogIn'));
                    }}
                >    
                    <Image
                        style={{width: 35, height: 35, top: 4, tintColor: "#c93a61"}}
                        source={require('../assets/logout.png')}
                    />
                    <Text style={{color: "#c93a61", fontSize: 12}}>Sign Out</Text>
                </Pressable>
            </View>

            <View style={styles.accountField}>
                <Text style={styles.fieldLabel}>User Name</Text>
                <Text style={styles.fieldValue}>{state.username}</Text>
            </View>

            <View style={styles.accountField}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Text style={styles.fieldValue}>{"*".repeat(state.password.length)}</Text>
            </View>
            

            <StatusBar barStyle="light-content" backgroundColor="#333a40"/>
            <NavBar navigation={navigation}></NavBar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 80,
        backgroundColor: '#333a40',
        padding: 8,
    },
    topBar: {
        position: "absolute",
        height: 70,
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: '104%',
        alignSelf: 'center'
    },
    topBarTitle: {
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
        padding: 16,
    },
    topBarButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 70,
        top: 0,
    },
    accountField: {
        alignSelf: "flex-start",
        padding: 15,
    },
    fieldLabel: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#c93a61",
    },
    fieldValue: {
        backgroundColor: "#2d3338",
        fontSize: 18,
        color: "#c93a61",
        padding: 15,
        width: 320,
        marginTop: 10,
    },
});