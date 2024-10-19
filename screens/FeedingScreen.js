import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SnakeGame = ({ navigation }) => {
    const [snakePosition, setSnakePosition] = useState({ x: screenWidth / 2, y: screenHeight / 2 });
    const [snakeDirection, setSnakeDirection] = useState({ dx: 0, dy: 0 });
    const [foodPosition, setFoodPosition] = useState({ x: Math.random() * (screenWidth - 50), y: Math.random() * (screenHeight - 50) });
    const [score, setScore] = useState(0);
    const snakeSize = 50; // Size of the snake

    // Move the snake every 100ms
    useEffect(() => {
        const moveInterval = setInterval(() => {
            setSnakePosition(prev => {
                const newX = prev.x + snakeDirection.dx * snakeSize;
                const newY = prev.y + snakeDirection.dy * snakeSize;

                // Boundary checks
                const boundedX = Math.max(0, Math.min(newX, screenWidth - snakeSize));
                const boundedY = Math.max(0, Math.min(newY, screenHeight - snakeSize));

                // Check for food collision
                if (
                    boundedX < foodPosition.x + snakeSize &&
                    boundedX + snakeSize > foodPosition.x &&
                    boundedY < foodPosition.y + snakeSize &&
                    boundedY + snakeSize > foodPosition.y
                ) {
                    setScore(prevScore => prevScore + 1);
                    setFoodPosition({
                        x: Math.random() * (screenWidth - 50),
                        y: Math.random() * (screenHeight - 50)
                    });
                }

                return { x: boundedX, y: boundedY };
            });
        }, 100); // Adjust speed of movement here

        return () => clearInterval(moveInterval); // Cleanup on unmount
    }, [snakeDirection]);

    const moveUp = () => setSnakeDirection({ dx: 0, dy: -1 });
    const moveDown = () => setSnakeDirection({ dx: 0, dy: 1 });
    const moveLeft = () => setSnakeDirection({ dx: -1, dy: 0 });
    const moveRight = () => setSnakeDirection({ dx: 1, dy: 0 });

    return (
        <View style={styles.container}>
            <Text style={styles.score}>Score: {score}</Text>
            <View style={{
                position: 'absolute',
                left: snakePosition.x,
                top: snakePosition.y,
                width: snakeSize,
                height: snakeSize,
                backgroundColor: 'pink' // Change to your asset later
            }} />
            <View style={{
                position: 'absolute',
                left: foodPosition.x,
                top: foodPosition.y,
                width: snakeSize,
                height: snakeSize,
                backgroundColor: 'red' // Food color
            }} />
            <View style={styles.buttonContainer}>
                <Button title="↑" onPress={moveUp} />
                <View style={styles.horizontalButtonContainer}>
                    <Button title="←" onPress={moveLeft} />
                    <Button title="→" onPress={moveRight} />
                </View>
                <Button title="↓" onPress={moveDown} />
            </View>
            <Button title="Go Back" onPress={() => navigation.navigate('MainScreen')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    score: {
        fontSize: 24,
        position: 'absolute',
        top: 40,
        left: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
    },
    horizontalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120,
    }
});

export default SnakeGame;
