import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LogIn from './components/logIn';

export default function App() {
  return (
    <View style={styles.container}>
      <LogIn></LogIn>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333a40',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
