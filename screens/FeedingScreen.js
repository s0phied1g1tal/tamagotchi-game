import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, PanResponder } from 'react-native';

const FeedingScreen = () => {
  const [foodBlocks, setFoodBlocks] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  const tamagotchiGIF = require('../assets/kirby.gif'); // Update your path if needed

  // Function to spawn food blocks at random positions
  const spawnFoodBlocks = () => {
    const newFoodBlocks = [];
    for (let i = 0; i < 3; i++) {
      const randomX = Math.floor(Math.random() * 300); // Adjust based on screen width
      const randomY = Math.floor(Math.random() * 300) + 400; // Lower on the screen, adjust as needed
      const randomColor = getRandomColor();
      const randomValue = randomColor === 'red' ? 10 : 2; // Different values based on color
      newFoodBlocks.push({ id: i + 1, x: randomX, y: randomY, color: randomColor, value: randomValue });
    }
    setFoodBlocks(newFoodBlocks);
  };

  // Function to get a random color for the food blocks
  const getRandomColor = () => {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to handle releasing a food block
  const handleRelease = (index) => {
    const foodBlock = foodBlocks[index];

    // Check collision with the Tamagotchi GIF
    const gifY = 200; // Adjust this based on your GIF's position
    const gifHeight = 100; // Adjust based on your GIF's height
    const gifX = 0; // Adjust based on your GIF's X position
    const gifWidth = 300; // Adjust based on your GIF's width

    if (
      foodBlock.y + 50 > gifY && // Assuming block height is 50
      foodBlock.y < gifY + gifHeight &&
      foodBlock.x + 50 > gifX &&
      foodBlock.x < gifX + gifWidth
    ) {
      setScore(prev => prev + foodBlock.value);
      setShowScore(true);

      // Remove the food block that was eaten
      const newFoodBlocks = [...foodBlocks];
      newFoodBlocks.splice(index, 1);
      setFoodBlocks(newFoodBlocks);

      // Hide score message after 5 seconds
      setTimeout(() => {
        setShowScore(false);
      }, 5000);
      
      // Respawn new food blocks
      spawnFoodBlocks();
    }
  };
// Example in FeedingScreen
const handleFoodCaught = (amount) => {
    setHunger(prev => Math.min(prev + amount, 100)); // Increase hunger when food is caught
};

  // Create pan handlers for the food blocks
  const panHandlers = (index) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {}, // No action needed on grant
      onPanResponderMove: (evt, gestureState) => {
        const newFoodBlocks = [...foodBlocks];
        const foodBlock = newFoodBlocks[index];

        // Update position based on gesture
        foodBlock.x = gestureState.moveX - 25; // Center the block on the touch
        foodBlock.y = gestureState.moveY - 25; // Center the block on the touch
        setFoodBlocks(newFoodBlocks);
      },
      onPanResponderRelease: () => handleRelease(index),
    });
  };

  // Spawn initial food blocks on component mount
  useEffect(() => {
    spawnFoodBlocks();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={tamagotchiGIF} style={styles.gif} />

      {foodBlocks.map((block, index) => (
        <View
          key={block.id}
          style={[styles.foodBlock, { left: block.x, top: block.y, backgroundColor: block.color }]}
          {...panHandlers(index).panHandlers}
        />
      ))}

      {showScore && <Text style={styles.score}>+{score}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF1879',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    position: 'absolute',
    top: 100, // Adjust to your layout
    width: 400,
    height: 400,
  },
  foodBlock: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  score: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    color: 'white',
  },
});

export default FeedingScreen;
