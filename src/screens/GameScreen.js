import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { useLanguage } from '../context/LanguageContext';

const windowWidth = Dimensions.get('window').width;
const BUBBLE_SIZE = windowWidth / 8;
const GRID_SIZE = 7;
// Updated with your requested dark colors
const COLORS = ['#B71C1C', '#0D47A1', '#1B5E20', '#4A148C', '#E65100', '#263238'];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GameScreen({ navigation }) {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(15);
  const popSound = useRef();

  useEffect(() => {
    initializeGame();
    loadSounds();
    return () => {
      if (popSound.current) popSound.current.unloadAsync();
    };
  }, [level]);

  const loadSounds = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../assets/pop.mp3'));
    popSound.current = sound;
  };

  const playPopSound = async () => {
    try {
      if (popSound.current) {
        await popSound.current.replayAsync();
      }
    } catch (e) {}
  };

  const initializeGame = () => {
    const newBubbles = [];
    const colorCount = Math.min(3 + level - 1, COLORS.length);

    for (let i = 0; i < GRID_SIZE; i++) {
      newBubbles[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const colorIndex = Math.floor(Math.random() * colorCount);
        newBubbles[i][j] = {
          color: COLORS[colorIndex],
          visible: true
        };
      }
    }

    setBubbles(newBubbles);
    setMoves(15 + level * 5);
    setGameOver(false);
  };

  const checkAdjacentBubbles = (row, col, color, visited = {}) => {
    const key = `${row},${col}`;
    if (visited[key]) return [];

    visited[key] = true;
    let matches = [{ row, col }];

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newRow < GRID_SIZE &&
        newCol >= 0 && newCol < GRID_SIZE &&
        bubbles[newRow][newCol].visible &&
        bubbles[newRow][newCol].color === color
      ) {
        matches = [...matches, ...checkAdjacentBubbles(newRow, newCol, color, visited)];
      }
    });

    return matches;
  };

  // New function to check if any valid matches exist on the board
  const checkForPossibleMatches = () => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (bubbles[row][col].visible) {
          const color = bubbles[row][col].color;
          const matches = checkAdjacentBubbles(row, col, color);
          if (matches.length >= 2) {
            return true; // Found at least one valid match
          }
        }
      }
    }
    return false; // No valid matches found
  };

  // Function to shuffle the board when no matches are available
  const shuffleBoard = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // Get all visible bubbles
    const visibleBubbles = [];
    bubbles.forEach(row => {
      row.forEach(bubble => {
        if (bubble.visible) {
          visibleBubbles.push(bubble.color);
        }
      });
    });
    
    // Shuffle colors
    for (let i = visibleBubbles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [visibleBubbles[i], visibleBubbles[j]] = [visibleBubbles[j], visibleBubbles[i]];
    }
    
    // Create new board with shuffled colors
    const newBubbles = [...bubbles.map(row => [...row])];
    let index = 0;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newBubbles[row][col].visible) {
          newBubbles[row][col].color = visibleBubbles[index++];
        }
      }
    }
    
    setBubbles(newBubbles);
    
    // Check if the shuffled board has any matches
    // If still no matches after shuffle (rare but possible), shuffle again
    setTimeout(() => {
      if (!checkForPossibleMatches()) {
        shuffleBoard();
      }
    }, 100);
  };

  const popBubbles = (row, col) => {
    if (gameOver || moves <= 0) return;

    const color = bubbles[row][col].color;
    const matches = checkAdjacentBubbles(row, col, color);

    if (matches.length >= 2) {
      const newBubbles = [...bubbles.map(row => [...row])];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      matches.forEach(({ row, col }) => {
        newBubbles[row][col].visible = false;
      });

      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newBubbles.map(row => row[col]);
        const visibleBubbles = column.filter(bubble => bubble.visible);
        const invisibleCount = GRID_SIZE - visibleBubbles.length;

        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (row >= invisibleCount) {
            newBubbles[row][col] = visibleBubbles[row - invisibleCount];
          } else {
            newBubbles[row][col] = { visible: false };
          }
        }
      }

      const newScore = score + matches.length * 10;
      setScore(newScore);
      setBubbles(newBubbles);
      setMoves(moves - 1);
      playPopSound();

      const remainingBubbles = newBubbles.flat().filter(b => b.visible).length;
      if (remainingBubbles <= GRID_SIZE * GRID_SIZE * 0.2) {
        Alert.alert(
          t('levelCompleted'),
          t('levelCompletedDesc').replace('{level}', level),
          [{ text: t('nextLevel'), onPress: () => setLevel(level + 1) }]
        );
      } else {
        // Check if there are no more matches after popping
        setTimeout(() => {
          if (moves > 0 && remainingBubbles > 0 && !checkForPossibleMatches()) {
            Alert.alert(
              t('noMoreMatches'),
              t('shuffleOrEnd'),
              [
                { text: t('shuffle'), onPress: () => shuffleBoard() },
                { text: t('endGame'), onPress: () => {
                  setGameOver(true);
                  navigation.navigate('GameOver', { score: newScore });
                }}
              ]
            );
          }
        }, 500); // Small delay to let animations complete
      }

      if (moves <= 1) {
        setGameOver(true);
        navigation.navigate('GameOver', { score: newScore });
      }
    } else {
      setMoves(moves - 1);
      if (moves <= 1) {
        setGameOver(true);
        navigation.navigate('GameOver', { score });
      } else {
        // Check if there are no more matches after using a move
        setTimeout(() => {
          if (!checkForPossibleMatches()) {
            Alert.alert(
              t('noMoreMatches'),
              t('shuffleOrEnd'),
              [
                { text: t('shuffle'), onPress: () => shuffleBoard() },
                { text: t('endGame'), onPress: () => {
                  setGameOver(true);
                  navigation.navigate('GameOver', { score });
                }}
              ]
            );
          }
        }, 100);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>{t('appTitle')}</Text>
        <Text style={styles.levelText}>{t('level')}: {level}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{t('score')}: {score}</Text>
        <Text style={styles.movesText}>{t('moves')}: {moves}</Text>
      </View>

      <View style={styles.gridContainer}>
        {bubbles.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((bubble, colIndex) => (
              <TouchableOpacity
                key={`bubble-${rowIndex}-${colIndex}`}
                style={[
                  styles.bubble,
                  {
                    backgroundColor: bubble.visible ? bubble.color : 'transparent',
                    width: BUBBLE_SIZE,
                    height: BUBBLE_SIZE,
                  },
                ]}
                onPress={() => bubble.visible && popBubbles(rowIndex, colIndex)}
                disabled={!bubble.visible || gameOver}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScore(0);
            setLevel(1);
            initializeGame();
          }}
        >
          <Text style={styles.buttonText}>{t('restart')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.menuButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>{t('mainMenu')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  levelText: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  movesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  gridContainer: {
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  bubble: {
    borderRadius: BUBBLE_SIZE / 2,
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    margin: 5,
  },
  menuButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});