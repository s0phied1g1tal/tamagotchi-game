import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Text, PanResponder } from 'react-native';
import { Video } from 'expo-av';

const FeedingScreen = ({ route }) => {
    const { setHunger } = route.params;
    const [foodBlocks, setFoodBlocks] = useState([]);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [draggedFoodBlock, setDraggedFoodBlock] = useState(null);
    const [currentVideo, setCurrentVideo] = useState('idle');
    const videoRef = useRef(null);

    const foodImages = {
        apple: require('../assets/images/apple.png'),
        banana: require('../assets/images/banana.png'),
        cake: require('../assets/images/cake.png'),
        steak: require('../assets/images/steak.png'),
        chicken: require('../assets/images/chicken.png'),
        pizza: require('../assets/images/pizza.png'),
    };

    const handleRelease = (block) => {
        const gifY = 250; // Adjust based on your layout
        const gifHeight = 100;
        const gifX = 100; // Adjust based on your layout
        const gifWidth = 300;

        // Check if food is caught
        if (
            block.y + 60 > gifY &&
            block.y < gifY + gifHeight &&
            block.x + 60 > gifX &&
            block.x < gifX + gifWidth
        ) {
            setHunger((prev) => Math.min(prev + block.value, 100));
            setScore((prev) => prev + block.value);
            setShowScore(true);

            // Play eating video when food is caught
            setCurrentVideo('eating');

            // Remove the caught food block
            setFoodBlocks((prev) => prev.filter((b) => b.id !== block.id));

            // Reset back to idle after eating video plays
            setTimeout(() => {
                setShowScore(false);
                setCurrentVideo('idle'); // Return to idle video
            }, 2000); // Adjust time based on video length
        }
    };

    const panHandlers = (index) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setCurrentVideo('mouth_open'); // Play mouth open video when dragging starts
            },
            onPanResponderMove: (evt, gestureState) => {
                const newFoodBlocks = [...foodBlocks];
                const foodBlock = newFoodBlocks[index];

                // Update the food block's position
                foodBlock.x = gestureState.moveX - 30; // Center the image
                foodBlock.y = gestureState.moveY - 30; // Center the image
                setFoodBlocks(newFoodBlocks);
            },
            onPanResponderRelease: () => {
                handleRelease(foodBlocks[index]);
            },
        });
    };

    const panHandlersFoodPile = () => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Play mouth open video when food pile is touched
                setCurrentVideo('mouth_open');

                const foodOptions = Object.keys(foodImages);
                const randomFood = foodOptions[Math.floor(Math.random() * foodOptions.length)];

                // Create a new food block
                const newFoodBlock = {
                    id: Date.now(),
                    x: 0,
                    y: 0,
                    image: foodImages[randomFood],
                    value: randomFood === 'apple' || randomFood === 'banana' ? 2 : 10,
                };
                setDraggedFoodBlock(newFoodBlock);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (draggedFoodBlock) {
                    const newFoodBlock = {
                        ...draggedFoodBlock,
                        x: gestureState.moveX - 30,
                        y: gestureState.moveY - 30,
                    };
                    setDraggedFoodBlock(newFoodBlock);
                }
            },
            onPanResponderRelease: () => {
                if (draggedFoodBlock) {
                    // Add the dragged food block to the array
                    setFoodBlocks((prev) => [...prev, draggedFoodBlock]);
                    handleRelease(draggedFoodBlock);
                    setDraggedFoodBlock(null); // Clear the dragged food block
                }
            },
        });
    };

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.setPositionAsync(0); // Reset video to start
                    await videoRef.current.playAsync(); // Play the video
                } catch (error) {
                    console.error('Error playing video:', error);
                }
            }
        };

        // Play the current video whenever it changes
        playVideo();
    }, [currentVideo]);

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={getVideoSource(currentVideo)}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay={true}
                isLooping={currentVideo === 'idle'} // Loop idle video
                style={styles.video}
            />

            {foodBlocks.map((block, index) => (
                <View
                    key={block.id}
                    style={[styles.foodBlock, { left: block.x, top: block.y }]}
                    {...panHandlers(index).panHandlers}
                >
                    <Image source={block.image} style={styles.foodImage} />
                </View>
            ))}

            {draggedFoodBlock && (
                <View
                    style={[styles.foodBlock, { left: draggedFoodBlock.x, top: draggedFoodBlock.y }]}
                >
                    <Image source={draggedFoodBlock.image} style={styles.foodImage} />
                </View>
            )}

            <View {...panHandlersFoodPile().panHandlers} style={styles.foodPileContainer}>
                <Image source={require('../assets/images/foodpile.png')} style={styles.foodPile} />
            </View>

            {showScore && <Text style={styles.score}>+{score}</Text>}
        </View>
    );
};

// Function to get the video source based on currentVideo state
const getVideoSource = (videoType) => {
    switch (videoType) {
        case 'mouth_open':
            return require('../assets/videos/mouth_open.mp4');
        case 'eating':
            return require('../assets/videos/eating.mp4');
        case 'idle':
        default:
            return require('../assets/videos/idle.mp4');
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF1879',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        position: 'absolute',
        top: 100,
        width: 400,
        height: 400,
    },
    foodBlock: {
        position: 'absolute',
        width: 80,
        height: 80,
    },
    foodImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    foodPileContainer: {
        position: 'absolute',
        bottom: -50,
        alignItems: 'center',
    },
    foodPile: {
        width: 400,
        height: 400,
    },
    score: {
        position: 'absolute',
        top: 50,
        fontSize: 24,
        color: 'white',
    },
});

export default FeedingScreen;
