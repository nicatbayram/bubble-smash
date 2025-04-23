# Bubble Smash

Bubble Smash is a fun and interactive bubble-popping game built with React Native and Expo. The game challenges players to pop adjacent bubbles of the same color, earn points, and progress through levels.

## Features

- **Dynamic Gameplay**: Pop adjacent bubbles of the same color to score points.
- **Level Progression**: Complete levels by clearing bubbles and move to the next level with increased difficulty.
- **Multilingual Support**: Switch between English and Turkish languages.
- **Sound Effects**: Enjoy satisfying pop sounds when bubbles are popped.
- **Responsive Design**: Optimized for various screen sizes.

## Screens

1. **Home Screen**: 
   - Displays the game title and menu options.
   - Allows navigation to the game screen and language selection.

2. **Game Screen**:
   - Displays the game grid with bubbles.
   - Tracks score, level, and remaining moves.
   - Allows restarting the game or returning to the main menu.

3. **Game Over Screen**:
   - Displays the final score.
   - Options to play again or return to the main menu.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nicatbayram/bubble-smash.git
   cd bubble-smash
    ```

2. Install dependencies:
   ```bash
   npm install
   npm start
    ```

3. Run the app on your desired platform:

For Android: npm run android
For iOS: npm run ios
For Web: npm run web

## Project Structure

bubble-smash/
├── App.js              # Main app entry point
├── index.js            # Expo entry point
├── src/
│   ├── assets/         # Game assets (images, sounds)
│   ├── components/     # Reusable components (e.g., LanguageSelector)
│   ├── context/        # Context for managing language state
│   ├── screens/        # Game screens (Home, Game, Game Over)
│   ├── translations/   # Translation files for multilingual support
├── package.json        # Project dependencies and scripts
├── app.json            # Expo configuration
├── .gitignore          # Git ignore rules


## Dependencies

React Native: 
Expo: 
React Navigation: 
Expo AV: 

## ScreenShots
