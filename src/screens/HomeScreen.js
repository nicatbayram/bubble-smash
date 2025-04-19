import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('appTitle')}</Text>
          <View style={styles.bubblesDecoration}>
            {Array(5).fill().map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.bubble, 
                  { 
                    backgroundColor: getBubbleColor(i),
                    width: 30 + (i * 5),
                    height: 30 + (i * 5),
                    left: i * 20 - 40,
                    top: i % 2 === 0 ? -20 : 20
                  }
                ]} 
              />
            ))}
          </View>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Game')}
          >
            <Text style={styles.buttonText}>{t('startGame')}</Text>
          </TouchableOpacity>
          
          <LanguageSelector />
        </View>
      </View>
    </SafeAreaView>
  );
}

const getBubbleColor = (index) => {
  const colors = ['#FF5252', '#FF4081', '#7C4DFF', '#536DFE', '#64FFDA', '#FFEB3B'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 80,
    position: 'relative',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3F51B5',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bubblesDecoration: {
    position: 'absolute',
    width: windowWidth,
    height: 100,
    top: -60,
    left: -20,
    zIndex: -1,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.8,
  },
  menuContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#3F51B5',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});