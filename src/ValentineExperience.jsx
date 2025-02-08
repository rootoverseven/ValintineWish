import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Calendar, Coffee, Camera, Music, Star, ArrowLeft } from 'lucide-react';
import Confetti from 'react-confetti'; // For confetti animation

const ValentineExperience = () => {
  const [stage, setStage] = useState('landing');
  const [foundHearts, setFoundHearts] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [memoryHearts, setMemoryHearts] = useState({
    'first-trip': Array(6).fill(false), // Track clicked hearts for each memory
    outings: Array(6).fill(false),
    manali: Array(6).fill(false),
    'we-look-good': Array(6).fill(false),
  });
  const [secretCode, setSecretCode] = useState(['', '', '', '', '', '', '']); // For LOZEN
  const inputRefs = useRef([]); // Refs for input boxes
  const [showConfetti, setShowConfetti] = useState(false); // For confetti animation
  const [selectedDateOption, setSelectedDateOption] = useState(null); // For date options

  // Memory Lane Data
  const memories = [
    { id: 'first-trip', title: 'Our First Trip 🚗', description: 'Remember our first road trip? The car we used was...', startImage: 1 },
    { id: 'outings', title: 'Our Outings 🌸', description: 'All those lovely times we spent together...', startImage: 7 },
    { id: 'manali', title: 'Manali Adventure 🏔️', description: 'The mountains, the snow, and our cozy moments...', startImage: 13 },
    { id: 'we-look-good', title: 'We Look GOOD 📸', description: 'Every picture we took is a masterpiece!', startImage: 19 },
  ];

  // Date Options
  const dateOptions = [
    { id: 'coffee', icon: Coffee, text: 'Coffee Date ☕' },
    { id: 'movie', icon: Camera, text: 'Movie Night 🎬' },
    { id: 'photos', icon: Music, text: 'Photo Session 📸' },
    { id: 'stargazing', icon: Star, text: 'Stargazing Night ⭐' },
  ];

  // Handle Heart Clicks
  const handleHeartClick = (memoryId, index) => {
    const updatedHearts = [...memoryHearts[memoryId]];
    updatedHearts[index] = true; // Mark the heart as clicked
    setMemoryHearts((prev) => ({
      ...prev,
      [memoryId]: updatedHearts,
    }));
    setFoundHearts((prev) => prev + 1);

    // Check if all hearts in the current memory are clicked
    if (updatedHearts.every((clicked) => clicked)) {
      setTimeout(() => setStage('mosaic'), 1000); // Return to Memory Lane
    }

    // Check if all 24 hearts are clicked
    if (foundHearts + 1 === 24) {
      setTimeout(() => setStage('secret-message'), 1000);
    }
  };

  // Handle Secret Code Input
  const handleSecretCodeInput = (index, value) => {
    const newCode = [...secretCode];
    newCode[index] = value.toUpperCase();
    setSecretCode(newCode);

    // Move to the next input box
    if (value && index < 6) {
      inputRefs.current[index + 1].focus();
    }

    // Check if the code is correct
    if (newCode.join('') === 'LOZENGE') {
      setTimeout(() => setStage('proposal'), 1000);
    }
  };

  // Handle "No" Button Hover
  const handleNoButtonHover = (e) => {
    const randomX = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
    const randomY = Math.floor(Math.random() * (200 - (-50) + 1)) + (-50);
    e.target.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  // Handle "Yes" Button Click
  const handleYesClick = () => {
    setShowConfetti(true); // Show confetti
    setTimeout(() => setStage('celebration'), 1000); // Proceed to celebration
  };

  // Handle Date Option Selection
  const handleDateOptionClick = (id) => {
    setSelectedDateOption(id);
  };

  // Render Current Stage
  const renderStage = () => {
    switch (stage) {
      case 'landing':
        return (
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-pink-600 animate-pulse">Hey Lozen! 🌹</h1>
            <p className="text-lg text-gray-700">Solve this riddle to begin our journey:</p>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="italic text-gray-600">"What car did we use on our first road trip?"</p>
              <input
                type="text"
                placeholder="Your answer..."
                className="mt-4 w-full p-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                onChange={(e) => {
                  if (e.target.value.toLowerCase().includes('alto')) {
                    setTimeout(() => setStage('mosaic'), 1000);
                  }
                }}
              />
            </div>
          </div>
        );

      case 'mosaic':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl text-center text-pink-600 font-bold">Our Memory Lane 💝</h2>
            <div className="grid grid-cols-2 gap-4">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedMemory(memory);
                    setTimeout(() => setStage('memory'), 800);
                  }}
                >
                  <Calendar className="w-8 h-8 text-pink-500 mb-2 mx-auto" />
                  <h3 className="font-bold text-gray-800 text-center">{memory.title}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <button
                onClick={() => setStage('mosaic')}
                className="flex items-center text-pink-500 hover:text-pink-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Memories
              </button>
              <h3 className="text-2xl font-bold text-pink-600 text-center">{selectedMemory?.title}</h3>
              <p className="text-gray-700 leading-relaxed text-center">{selectedMemory?.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-pink-50 rounded-lg flex items-center justify-center hover:bg-pink-100 transition-colors cursor-pointer"
                    onClick={() => handleHeartClick(selectedMemory.id, i)}
                  >
                    {memoryHearts[selectedMemory.id][i] ? (
                      <img
                        src={`./assets/${selectedMemory.startImage + i}.jpg`} // Image path: e.g., 1.jpg, 2.jpg, ..., 24.jpg
                        alt={`Memory ${selectedMemory.startImage + i}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Heart className="w-6 h-6 text-red-500 animate-bounce" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'secret-message':
        return (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold text-pink-600">Decode the Secret Message 💌</h1>
            <div className="flex justify-center gap-2">
              {secretCode.map((char, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={char}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  onChange={(e) => handleSecretCodeInput(index, e.target.value)}
                />
              ))}
            </div>
            <p className="text-gray-700">Enter the secret word to unlock the next stage.</p>
          </div>
        );

      case 'proposal':
        return (
          <div className="space-y-8 text-center">
            <div className="flex justify-center space-x-4">
              <Heart className="w-16 h-16 text-red-500 animate-bounce" fill="currentColor" />
              <Sparkles className="w-16 h-16 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-pink-600">Meri Pyari Lozen... 🌹</h1>
            <p className="text-xl text-gray-700">
              Every moment with you is pure magic. From our first coffee date to stargazing nights, you've made my life
              incredibly special.
            </p>
            <h2 className="text-2xl font-bold text-pink-600">Will you be my Valentine? 💝</h2>
            <div className="flex justify-center gap-6 relative">
              <button
                onClick={handleYesClick}
                className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transform hover:scale-110 transition-all duration-300 yes"
              >
                Yes, my love! 💖
              </button>
              <button
                className="px-8 py-3 bg-gray-400 text-white rounded-lg transition-all duration-300 no"
                onMouseEnter={handleNoButtonHover}
              >
                Let me think...
              </button>
            </div>
          </div>
        );

      case 'celebration':
        return (
          <div className="space-y-8 text-center">
            {showConfetti && <Confetti />} {/* Confetti animation */}
            <div className="flex justify-center space-x-4">
              <Heart className="w-16 h-16 text-red-500 animate-bounce" fill="currentColor" />
              <Sparkles className="w-16 h-16 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold text-pink-600 animate-pulse">You Said YES! 💝</h1>
            <p className="text-xl text-gray-700">
              My love for you is infinite, like the stars in the sky. 🌌
              <br />
              You are my everything, and I can't wait to spend forever with you. 💖
            </p>
            <h2 className="text-2xl font-bold text-pink-600">Choose Our Date:</h2>
            <div className="grid grid-cols-2 gap-4">
              {dateOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 bg-white rounded-lg shadow-md cursor-pointer ${
                    selectedDateOption === option.id ? 'border-2 border-green-500' : 'border-2 border-transparent'
                  }`}
                  onClick={() => handleDateOptionClick(option.id)}
                >
                  <option.icon className="w-8 h-8 mx-auto text-pink-500 mb-2" />
                  <p className="text-gray-700">{option.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6">{renderStage()}</div>
    </div>
  );
};

export default ValentineExperience;