import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from './Navbar';
import { Context } from '../Store';

export default function Playlists({ navigation }) {
    const [state, setState] = React.useContext(Context);
    const [showAdd, setShowAdd] = React.useState(false);
    const [addPlaylistName, setAddPlaylistName] = React.useState("");

    // Loads playlists if they have not been loaded already
    React.useEffect(() => {
        if (state.loadedPlaylists == false) {
            getPlaylists();
        }
    });

    // Utility function for changing tabs
    const changeTab = (tab) => {
        navigation.navigate(tab);
    };

    // Calls back-end to get playlists
    const getPlaylists = () => {
        let formData = new FormData();
        formData.append('method', 'getPlaylists');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (Array.isArray(r)) { 
                setState({...state, playlists: r, loadedPlaylists: true});
            }
        })
    };

    // Calls back-end to add playlist
    const addPlaylist = (playlistName) => {
        if (playlistName == "") {
            setShowAdd(false);
            setAddPlaylistName("");
        }

        let formData = new FormData();
        formData.append('method', 'createPlaylist');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        formData.append('playlistName', playlistName);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (typeof r === "object" && r !== null) {
                let currentPlaylists = state.playlists;
                currentPlaylists.push(r);
                setState({...state, playlists: currentPlaylists});
                setShowAdd(false);
                setAddPlaylistName("");
            }
        });
    }

    // Calls back-end to remove playlist
    const removePlaylist = (playlistId) => {
        let formData = new FormData();
        formData.append('method', 'removePlaylist');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        formData.append('playlistId', playlistId);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (r == "successfullyRemoved") {
                let currentPlaylists = state.playlists;
                currentPlaylists = currentPlaylists.filter((playlist) => playlist.id != playlistId);
                setState({...state, playlists: currentPlaylists});
            }
        })
    }

    // Select playlist and navigate to details page
    const selectPlaylist = (playlistId, playlistName) => {
        changeTab("CurrentPlaylist");
        setState({...state, selectedPlaylistId: playlistId, selectedPlaylist: playlistName, selectedTab: "CurrentPlaylist", loadedEntries: false});
    }

    // Renders view for adding playlists
    const renderAddField = () => {
        if (showAdd) {
            return (
                <View style={styles.playlistContainer}>
                    <TextInput
                        style={{...styles.playlistTitle, color: "#2eb35a"}}
                        onChangeText={text => setAddPlaylistName(text)}
                        value={addPlaylistName}
                    />
                    <Pressable onPress={() => addPlaylist(addPlaylistName)}>
                        <Image
                            style={{width: 35, height: 35, tintColor: "#2eb35a"}}
                            source={require('../assets/add.png')}
                        />
                    </Pressable>                        
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            {/* Render bar at the top of the screen */}
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Your Playlists</Text>
                <Pressable 
                    style={styles.topBarButton}
                    onPress={() => {
                        setShowAdd(true);
                    }}
                >    
                    <Image
                        style={{width: 35, height: 35, top: 4, tintColor: "#2eb35a"}}
                        source={require('../assets/add.png')}
                    />
                    <Text style={{color: "#2eb35a", fontSize: 12}}>Create</Text>
                </Pressable>
            </View>

            {/* Render playlists */}
            <ScrollView style={{marginBottom: 70}}>
                {state.playlists.map((playlist) => {
                    return(
                        <View style={styles.playlistContainer} key={playlist.id}>
                            <Pressable onPress={() => selectPlaylist(playlist.id, playlist.name)}>
                                <Text style={styles.playlistTitle} >{playlist.name}</Text>
                            </Pressable>
                            <Pressable onPress={() => removePlaylist(playlist.id)}>
                                <Image
                                    style={{width: 35, height: 35, tintColor: "#2eb35a"}}
                                    source={require('../assets/remove.png')}
                                />
                            </Pressable>                        
                        </View>
                    )
                })}

                {/* Renders view where you can add a new playlist */}
                {renderAddField()}
            </ScrollView>            

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
        paddingTop: 100,
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
    playlistContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    playlistTitle: {
        backgroundColor: "#2d3338",
        color: "#2eb35a",
        padding: 15,
        width: 300,
        marginRight: 15,
    },
});