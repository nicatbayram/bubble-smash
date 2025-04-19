import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language')}:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            language === 'tr' && styles.activeButton
          ]}
          onPress={() => changeLanguage('tr')}
        >
          <Text style={[
            styles.buttonText, 
            language === 'tr' && styles.activeButtonText
          ]}>
            {t('turkish')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            language === 'en' && styles.activeButton
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[
            styles.buttonText, 
            language === 'en' && styles.activeButtonText
          ]}>
            {t('english')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#3F51B5',
  },
  buttonText: {
    color: '#555',
    fontWeight: '500',
  },
  activeButtonText: {
    color: 'white',
  },
});

export default LanguageSelector;