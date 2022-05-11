import React, { useState } from "react";

const initialState = {
    username: "",
    password: "",
    email: "",
    loadedPlaylists: false,
    loadedSongs: false,
    loadedEntries: false,
    playlists: [],
    songs: [],
    selectedTab: "",
    selectedPlaylistId: 0,
    selectedPlaylist: "",
    playlistEntries: [],
}

export const Context = React.createContext();

const Store = ({ children }) => {
    const [state, setState] = useState(initialState);

    return (
        <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    )
}

export default Store;