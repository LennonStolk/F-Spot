import * as React from 'react';
import { Text, View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from './Navbar';
import { Context } from '../Store';
import { Audio } from 'expo-av';

export default function Search({ navigation }) {
    const songs = {
        "RedHotChiliPeppers-DarkNecessities.mp3": require("../songs/RedHotChiliPeppers-DarkNecessities.mp3"),
        "SystemOfADown-Toxicity.mp3": require("../songs/SystemOfADown-Toxicity.mp3"),
        "SystemOfADown-ChopSuey.mp3": require("../songs/SystemOfADown-ChopSuey.mp3"),
        "SystemOfADown-Aerials.mp3": require("../songs/SystemOfADown-Aerials.mp3"),
        "Disturbed-TheSoundOfSilence.mp3": require("../songs/Disturbed-TheSoundOfSilence.mp3"),
        "RedHotChiliPeppers-CantStop.mp4": require("../songs/RedHotChiliPeppers-CantStop.mp4"),
        "RedHotChiliPeppers-Snow.mp4": require("../songs/RedHotChiliPeppers-Snow.mp4"),
        "RedHotChiliPeppers-Californication.mp4": require("../songs/RedHotChiliPeppers-Californication.mp4"),
        "RedHotChiliPeppers-Otherside.mp4": require("../songs/RedHotChiliPeppers-Otherside.mp4"),
        "FooFighters-ThePretender.mp4": require("../songs/FooFighters-ThePretender.mp4"),
        "Radiohead-Creep.mp4": require("../songs/Radiohead-Creep.mp4"),
        "GnarlsBarkley-Crazy.mp4": require("../songs/GnarlsBarkley-Crazy.mp4"),
        "DaftPunk-GetLucky.mp4": require("../songs/DaftPunk-GetLucky.mp4"),
        "LedZeppelin-StairwayToHeaven.mp4": require("../songs/LedZeppelin-StairwayToHeaven.mp4"),
    }

    const [state, setState] = React.useContext(Context);
    const [sound, setSound] = React.useState();
    const [playingId, setPlayingId] = React.useState(0);

    React.useEffect(() => {
        if (state.loadedEntries == false) {
            getPlaylistEntries();
        }
    }, [state.selectedPlaylistId, state.playlistEntries]);

    React.useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    const playSound = async (entry) => {
        const { sound } = await Audio.Sound.createAsync(songs[entry.src]);
        setSound(sound);
        await sound.playAsync();
        setPlayingId(entry.id);
    }

    const getPlaylistEntries = () => {
        let formData = new FormData();
        formData.append('method', 'getPlaylistEntries');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        formData.append('playlistId', state.selectedPlaylistId);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (Array.isArray(r)) {
                setState({...state, playlistEntries: r, loadedEntries: true});
            }
        })
    }

    const removePlaylistEntry = (entryId) => {
        let formData = new FormData();
        formData.append('method', 'removePlaylistEntry');
        formData.append('userName', state.username);
        formData.append('password', state.password);
        formData.append('playlistEntryId', entryId);
        fetch("http://lennonstolk.nl/apis/F-Spot/playlistController.php", {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            if (r == "successfullyRemoved") {
                let currentEntries = state.playlistEntries;
                currentEntries = currentEntries.filter((entry) => entry.id != entryId);
                setState({...state, playlistEntries: currentEntries});
            }
        });
    }

    const noPlaylistSelectedError = () => {
        if (state.selectedPlaylistId == 0) {
            return(
                <Text style={styles.noPlaylistSelectedError}>No playlist has been selected yet</Text>
            );
        }
    }

    const getSongControlButton = (entry) => {
        if (playingId === entry.id) {
            return (
                <Pressable>
                    <Image
                        style={{width: 30, height: 22, tintColor: "#aab035"}}
                        source={require('../assets/pause.png')}
                    />
                </Pressable>
            )
        }
        else {
            return (
                <Pressable onPress={() => playSound(entry)}>
                    <Image
                        style={{width: 30, height: 30, tintColor: "#aab035"}}
                        source={require('../assets/play.png')}
                    />
                </Pressable>
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={styles.topBarTitle}>{state.selectedPlaylist}</Text>
                    <Text style={styles.topBarSongCount}>{state.playlistEntries.length} Songs</Text>
                </View>
            </View>

            {noPlaylistSelectedError()}

            <ScrollView style={{marginBottom: 70}}>
                {state.playlistEntries.map((entry) => {
                    return(
                        <View style={styles.songContainer} key={entry.id}>
                            <View style={styles.songLabel}>
                                <Text style={{fontWeight: "bold", color: "#aab035", fontSize: 15}}>{entry.name}</Text>
                                <Text style={{color: "#aab035", fontSize: 13}}>{entry.artist}</Text>
                                {getSongControlButton(entry)}
                            </View>
                            <Pressable onPress={() => removePlaylistEntry(entry.id)}>
                                <Image
                                    style={{width: 35, height: 35, tintColor: "#aab035"}}
                                    source={require('../assets/remove.png')}
                                />
                            </Pressable>                   
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
        padding: 12,
        width: '87%',
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "space-between",
        height: 65,
    },
    topBarSongCount: {
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 0,
        fontSize: 18,
        backgroundColor: "#2d3338",
        color: "#aab035",
        height: 35,
    },
    noPlaylistSelectedError: {
        color: "#aab035",
        fontSize: 18,
    },
});