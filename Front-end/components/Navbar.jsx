import * as React from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import { Context } from '../Store';

export default function NavBar({ navigation }) {
    const [state, setState] = React.useContext(Context);

    const changeTab = (tab) => {
        setState({...state, selectedTab: tab})
        navigation.navigate(tab);
    };

    const getIconColor = (tab) => {
        if (state.selectedTab != tab) return "#222226";
        let colors = {
            "Search": "#2f60b5",
            "Playlists": "#2eb35a",
            "CurrentPlaylist": "#aab035",
            "Account": "#c93a61",
        };
        return colors[tab];
    };

    return (
        <View style={{...styles.navContainer, borderTopColor: getIconColor(state.selectedTab)}}>
            <View style={styles.navBar}>
                <Image
                    style={{width: 145, height: 65, left: 0,}}
                    source={require('../assets/fspotlogowhite.png')}
                />

                <Pressable 
                    style={styles.navBarButton}
                    onPress={() => changeTab("Search")}
                >   
                    <Image
                        style={{width: 35, height: 35, top: 2, tintColor: getIconColor("Search")}}
                        source={require('../assets/search.png')}
                    />
                    <Text style={{color: getIconColor("Search"), fontSize: 12}}>Search</Text>
                </Pressable>

                <Pressable 
                    style={styles.navBarButton}
                    onPress={() => changeTab("Playlists")}
                >   
                    <Image
                        style={{width: 35, height: 35, top: 2, tintColor: getIconColor("Playlists")}}
                        source={require('../assets/playlists.png')}
                    />
                    <Text style={{color: getIconColor("Playlists"), fontSize: 12}}>Playlists</Text>
                </Pressable>

                <Pressable 
                    style={styles.navBarButton}
                    onPress={() => changeTab("CurrentPlaylist")}
                >    
                    <Image
                        style={{width: 35, height: 35, top: 4, tintColor: getIconColor("CurrentPlaylist")}}
                        source={require('../assets/playlist.png')}
                    />
                    <Text style={{color: getIconColor("CurrentPlaylist"), fontSize: 12}}>Current</Text>
                </Pressable>

                <Pressable 
                    style={styles.navBarButton}
                    onPress={() => changeTab("Account")}
                >    
                    <Image
                        style={{width: 35, height: 35, top: 2, tintColor: getIconColor("Account")}}
                        source={require('../assets/account.png')}
                    />
                    <Text style={{color: getIconColor("Account"), fontSize: 12}}>Account</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        alignItems: 'center',
        borderTopWidth: 2,
        height: 70,
        width: '104%',
        bottom: 0,
        alignSelf: 'center'
    },
    navBar: {
        flexDirection: 'row',
        backgroundColor: '#333a40',
        width: '100%',
        justifyContent: 'center',
    },
    navBarButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 60,
        top: 5,
    }
});