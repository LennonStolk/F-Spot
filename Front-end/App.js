import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import LogIn from './components/LogIn';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './components/Account';
import Playlists from './components/Playlists';
import CurrentPlaylist from './components/CurrentPlaylist';
import Search from './components/Search';
import SignUp from './components/SignUp';
import Store from './Store';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
    <Store>
      <NavigationContainer>
            <Stack.Navigator screenOptions={{
              animation: 'fade_from_bottom'
            }}>
              <Stack.Screen name="LogIn" component={LogIn} options={{ title: 'Welcome', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
              <Stack.Screen name="Search" component={Search} options={{ title: 'Search', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
              <Stack.Screen name="Playlists" component={Playlists} options={{ title: 'Playlists', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
              <Stack.Screen name="CurrentPlaylist" component={CurrentPlaylist} options={{ title: 'Current Playlist', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
              <Stack.Screen name="Account" component={Account} options={{ title: 'Account', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
              <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up', headerShown: false, statusBarStyle: "dark"}}></Stack.Screen>
            </Stack.Navigator>
      </NavigationContainer>
    </Store>
  );
}
