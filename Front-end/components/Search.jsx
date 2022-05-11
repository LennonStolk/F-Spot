import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from './Navbar';
import { Context } from '../Store';

export default function Account({ navigation }) {
    const [state, setState] = React.useContext(Context);
    const [search, setSearch] = React.useState("");

    // Loads songs if they have not been loaded already
    React.useEffect(() => {
        if (state.loadedSongs == false) {
            getSongs();
        }
    });

    // Calls back-end to get songs
    const getSongs = () => {
        let formData = new FormData();
        formData.append('method', 'getSongs');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        fetch("http://lennonstolk.nl/apis/F-Spot/songController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (Array.isArray(r)) {
                setState({...state, songs: r, loadedSongs: true});
            }
        });
    };

    // Calls back-end to add song to playlist
    const addPlaylistEntry = (songId, songName) => {
        if (state.selectedPlaylistId == null || state.selectedPlaylistId == 0) {
            alert("No playlist has been selected");
            return;
        }
        
        let formData = new FormData();
        formData.append('method', 'addPlaylistEntry');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        formData.append('playlistId', state.selectedPlaylistId);
        formData.append('songId', songId);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (typeof r === "object" && r !== null) {
                alert(`"${songName}" has been added to playlist "${state.selectedPlaylist}"`);
                let currentEntries = state.playlistEntries;
                currentEntries.push(r);
                setState({...state, playlistEntries: currentEntries});
            }
        })
    }

    const filterSongs = (e) => {
        let lowerName = e.name.toLowerCase();
        let lowerArtist = e.artist.toLowerCase();
        let lowerSearch = search.toLowerCase();
        return lowerName.includes(lowerSearch) || lowerArtist.includes(lowerSearch);
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Search</Text>
                {/* Render search bar */}
                <TextInput
                    style={styles.searchBox}
                    onChangeText={text => setSearch(text)}
                    value={search}
                />
            </View>

            {/* Render songs */}
            <ScrollView style={{marginBottom: 70}}>
                {state.songs.filter(filterSongs).map((song) => {
                    return(
                        <View style={styles.songContainer} key={song.id}>
                            <View style={styles.songLabel}>
                                <Text style={{fontWeight: "bold", color: "#2f60b5", fontSize: 17}}>{song.name}</Text>
                                <Text style={{color: "#2f60b5"}}>{song.artist}</Text>
                                <Pressable onPress={() => addPlaylistEntry(song.id, song.name)}>
                                    <Image
                                        style={{width: 35, height: 35, tintColor: "#2f60b5"}}
                                        source={require('../assets/add.png')}
                                    />
                                </Pressable>
                            </View>     
                        </View>
                    )
                })}
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
    songContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    songLabel: {
        backgroundColor: "#2d3338",
        color: "#2f60b5",
        padding: 15,
        width: '95%',
        height: 75,
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "space-between",
    },
    searchBox: {
        backgroundColor: "#2d3338",
        color: "#2f60b5",
        padding: 10,
        width: '65%',
        marginRight: 20,
    },
});