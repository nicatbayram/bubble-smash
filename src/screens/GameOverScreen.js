import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const windowWidth = Dimensions.get('window').width;

export default function GameOverScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { score } = route.params;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>{t('gameOver')}</Text>
          <Text style={styles.scoreText}>
            {t('gameOverDesc').replace('{score}', score)}
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.playAgainButton]}
              onPress={() => navigation.navigate('Game')}
            >
              <Text style={styles.buttonText}>{t('playAgain')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.menuButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>{t('mainMenu')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.bubblesContainer}>
          {Array(8).fill().map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.bubble,
                {
                  backgroundColor: getBubbleColor(i),
                  width: 40 + Math.random() * 30,
                  height: 40 + Math.random() * 30,
                  top: Math.random() * 400,
                  left: (i * (windowWidth / 8)) + Math.random() * 20 - 10,
                  opacity: 0.5 + Math.random() * 0.5
                }
              ]} 
            />
          ))}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  playAgainButton: {
    backgroundColor: '#3F51B5',
  },
  menuButton: {
    backgroundColor: '#64FFDA',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
  },
});