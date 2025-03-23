import React, { useState, useEffect, useRef } from 'react';

const VoiceLetterGame = () => {
    const [isListening, setIsListening] = useState(false);
    const [currentLetter, setCurrentLetter] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const letterData = {
        'A': { word: 'Apple', image: '/api/placeholder/150/150' },
        'B': { word: 'Ball', image: '/api/placeholder/150/150' },
        'C': { word: 'Cat', image: '/api/placeholder/150/150' },
        'D': { word: 'Dog', image: '/api/placeholder/150/150' },
        'E': { word: 'Elephant', image: '/api/placeholder/150/150' },
        'F': { word: 'Flower', image: '/api/placeholder/150/150' },
        'G': { word: 'Giraffe', image: '/api/placeholder/150/150' },
        'H': { word: 'House', image: '/api/placeholder/150/150' },
        'I': { word: 'Ice Cream', image: '/api/placeholder/150/150' },
        'J': { word: 'Jellyfish', image: '/api/placeholder/150/150' },
        'K': { word: 'Kite', image: '/api/placeholder/150/150' },
        'L': { word: 'Lion', image: '/api/placeholder/150/150' },
        'M': { word: 'Monkey', image: '/api/placeholder/150/150' },
        'N': { word: 'Nest', image: '/api/placeholder/150/150' },
        'O': { word: 'Orange', image: '/api/placeholder/150/150' },
        'P': { word: 'Penguin', image: '/api/placeholder/150/150' },
        'Q': { word: 'Queen', image: '/api/placeholder/150/150' },
        'R': { word: 'Rabbit', image: '/api/placeholder/150/150' },
        'S': { word: 'Snake', image: '/api/placeholder/150/150' },
        'T': { word: 'Tiger', image: '/api/placeholder/150/150' },
        'U': { word: 'Umbrella', image: '/api/placeholder/150/150' },
        'V': { word: 'Violin', image: '/api/placeholder/150/150' },
        'W': { word: 'Whale', image: '/api/placeholder/150/150' },
        'X': { word: 'X-ray', image: '/api/placeholder/150/150' },
        'Y': { word: 'Yacht', image: '/api/placeholder/150/150' },
        'Z': { word: 'Zebra', image: '/api/placeholder/150/150' }
    };

    const timerRef = useRef(null);
    const letters = Object.keys(letterData);

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.trim().toUpperCase();
                handleVoiceInput(transcript);
            };

            recognition.onend = () => {
                if (isListening) {
                    recognition.start();
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setFeedback('Oops! I had trouble hearing you. Let\'s try again!');
                setTimeout(() => setFeedback(''), 3000);
            };

            setSpeechRecognition(recognition);
        } else {
            setFeedback('Speech recognition is not supported in this browser.');
        }

        return () => {
            if (speechRecognition) {
                speechRecognition.stop();
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Stop and restart recognition when isListening changes
    useEffect(() => {
        if (!speechRecognition) return;

        if (isListening) {
            speechRecognition.start();
        } else {
            speechRecognition.stop();
        }
    }, [isListening, speechRecognition]);

    const handleVoiceInput = (input) => {
        // Check if the first character of what was spoken matches the current letter
        const firstChar = input.charAt(0);

        if (firstChar === currentLetter) {
            const newScore = score + 10 + (consecutiveCorrect * 2);
            setScore(newScore);
            setConsecutiveCorrect(consecutiveCorrect + 1);
            setFeedback(`Correct! "${currentLetter}" is for ${letterData[currentLetter].word}`);

            // Next letter after a short delay to show feedback
            timerRef.current = setTimeout(() => {
                generateRandomLetter();
                setFeedback('');
            }, 2000);
        } else if (letters.includes(firstChar)) {
            setConsecutiveCorrect(0);
            setFeedback(`Oops! I heard "${firstChar}" but we're looking for "${currentLetter}"`);
        } else {
            setConsecutiveCorrect(0);
            setFeedback(`I heard "${input}". Please try saying a letter like "${currentLetter}" for ${letterData[currentLetter].word}`);
        }
    };

    const generateRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * letters.length);
        const newLetter = letters[randomIndex];
        setCurrentLetter(newLetter);
    };

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    const startGame = () => {
        setGameStarted(true);
        generateRandomLetter();
        setIsListening(true);
        setScore(0);
        setConsecutiveCorrect(0);
        setFeedback('Say the letter you see on screen!');
    };

    return (
        <div className="bg-indigo-900 min-h-screen text-white font-pixel">
            <div className="max-w-4xl mx-auto p-6">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Voice Letter Match</h1>
                    <p className="text-xl text-indigo-300">Say the letter to score points!</p>
                </header>

                {!gameStarted ? (
                    <div className="text-center">
                        <div className="bg-indigo-800 rounded-xl p-8 mb-8 shadow-lg">
                            <h2 className="text-2xl mb-4">How to Play</h2>
                            <ol className="text-left list-decimal pl-8 space-y-2 mb-6">
                                <li>Click "Start Game" to begin</li>
                                <li>A letter will appear on the screen</li>
                                <li>Say the letter out loud</li>
                                <li>Get points for each correct letter</li>
                                <li>Chain correct answers for bonus points!</li>
                            </ol>
                            <button
                                onClick={startGame}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold transition-colors"
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-indigo-800 rounded-xl p-6 shadow-lg flex flex-col items-center">
                            <div className="mb-4 text-center">
                                <p className="text-indigo-300 mb-1">Current Letter</p>
                                <div className="bg-indigo-700 rounded-lg w-48 h-48 flex items-center justify-center mb-4 border-4 border-indigo-500">
                                    <span className="text-8xl font-bold">{currentLetter}</span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-lg">
                                        <span className="font-bold">{currentLetter}</span> is for <span className="text-yellow-300">{currentLetter && letterData[currentLetter].word}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 w-full">
                                <button
                                    onClick={toggleListening}
                                    className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-colors ${isListening
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    {isListening ? 'Stop Microphone' : 'Start Microphone'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-indigo-800 rounded-xl p-6 shadow-lg flex flex-col">
                            {currentLetter && (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <p className="text-indigo-300 mb-2">Word Example</p>
                                    <img
                                        src={letterData[currentLetter].image}
                                        alt={letterData[currentLetter].word}
                                        className="w-32 h-32 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-3xl font-bold text-yellow-300">
                                        {letterData[currentLetter].word}
                                    </h2>
                                </div>
                            )}

                            <div className="mt-6">
                                <div className="bg-indigo-700/50 rounded-lg p-4 text-center">
                                    <div className="mb-4">
                                        <p className="text-indigo-300">Score</p>
                                        <p className="text-4xl font-bold">{score}</p>
                                    </div>

                                    <div>
                                        <p className="text-indigo-300">Combo</p>
                                        <p className="text-2xl font-bold text-yellow-400">
                                            {consecutiveCorrect > 0 ? `${consecutiveCorrect}x` : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback message */}
                {feedback && (
                    <div className={`mt-8 p-4 rounded-lg text-center text-xl ${feedback.includes('Correct') ? 'bg-green-600/70' : 'bg-indigo-700/70'
                        }`}>
                        {feedback}
                    </div>
                )}

                {gameStarted && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setGameStarted(false);
                                setIsListening(false);
                            }}
                            className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            End Game
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceLetterGame;