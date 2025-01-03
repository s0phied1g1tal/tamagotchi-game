import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Text, PanResponder, TouchableOpacity } from 'react-native';
import { Video, Audio } from 'expo-av';

const FeedingScreen = ({ route, navigation }) => {
    const { setHunger } = route.params;
    const [foodBlocks, setFoodBlocks] = useState([]);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [draggedFoodBlock, setDraggedFoodBlock] = useState(null);
    const [currentVideo, setCurrentVideo] = useState('idle');
    const videoRef = useRef(null);
    const audioRef = useRef(new Audio.Sound());

    const foodImages = {
        apple: require('../assets/images/apple.png'),
        banana: require('../assets/images/banana.png'),
        cake: require('../assets/images/cake.png'),
        steak: require('../assets/images/steak.png'),
        chicken: require('../assets/images/chicken.png'),
        pizza: require('../assets/images/pizza.png'),
    };

    useEffect(() => {
        const loadAudio = async () => {
            try {
                await audioRef.current.loadAsync(require('../assets/audio/kirby_feeding_music.mp3'));
                await audioRef.current.setIsLoopingAsync(true);
                await audioRef.current.playAsync();
            } catch (error) {
                console.error('Error loading audio:', error);
            }
        };

        loadAudio();

        return () => {
            audioRef.current.unloadAsync();
        };
    }, []);

    const handleRelease = (block) => {
        const gifY = 250;
        const gifHeight = 100;
        const gifX = 100;
        const gifWidth = 300;

        if (
            block.y + 60 > gifY &&
            block.y < gifY + gifHeight &&
            block.x + 60 > gifX &&
            block.x < gifX + gifWidth
        ) {
            setHunger((prev) => Math.min(prev + block.value, 100));
            setScore((prev) => prev + block.value);
            setShowScore(true);

            setCurrentVideo('eating');

            setFoodBlocks((prev) => prev.filter((b) => b.id !== block.id));

            setTimeout(() => {
                setShowScore(false);
                setCurrentVideo('idle');
            }, 2000);
        }
    };

    const panHandlers = (index) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setCurrentVideo('mouth_open');
            },
            onPanResponderMove: (evt, gestureState) => {
                const newFoodBlocks = [...foodBlocks];
                const foodBlock = newFoodBlocks[index];

                foodBlock.x = gestureState.moveX - 30;
                foodBlock.y = gestureState.moveY - 30;
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
                setCurrentVideo('mouth_open');

                const foodOptions = Object.keys(foodImages);
                const randomFood = foodOptions[Math.floor(Math.random() * foodOptions.length)];

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
                    setFoodBlocks((prev) => [...prev, draggedFoodBlock]);
                    handleRelease(draggedFoodBlock);
                    setDraggedFoodBlock(null);
                }
            },
        });
    };

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.setPositionAsync(0);
                    await videoRef.current.playAsync();
                } catch (error) {
                    console.error('Error playing video:', error);
                }
            }
        };

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
                isLooping={currentVideo === 'idle'}
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

            <Text style={styles.instructionText}>Drag the food to feed Kirby!</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        fontFamily: 'Cherry Bomb One',
        position: 'absolute',
        top: 50,
        fontSize: 24,
        color: 'white',
        padding: 10,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    instructionText: {
        fontFamily: 'Cherry Bomb One',
        position: 'absolute',
        bottom: 690,
        fontSize: 20,
        color: 'white',
    },
    backButton: {
        backgroundColor: '#6D003F',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    backButtonText: {
        fontFamily: 'Cherry Bomb One',
        fontSize: 20,
        color: 'white',
    },
});

export default FeedingScreen;
