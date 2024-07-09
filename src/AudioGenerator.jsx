import React, { useRef, useState } from 'react';

const AudioGenerator = () => {
  const audioRef = useRef(null);
//   const [text, setText] = useState('');
const text = "In a world where technology evolves at an astonishing pace and the boundaries of human ingenuity are constantly being pushed, it is fascinating to witness the myriad ways in which our lives are intertwined with the digital realm, from the moment we wake up to the sound of an alarm clock that is more sophisticated than the most advanced computers of just a few decades ago, to the way we navigate through our daily routines, relying on smartphones, tablets, and laptops to communicate, work, learn, and entertain ourselves, all while connected to a vast, invisible network of information and communication that spans the globe, allowing us to stay in touch with friends and family, access a wealth of knowledge at our fingertips, and participate in a global community that transcends geographical boundaries and cultural differences, fostering a sense of interconnectedness and shared experience that is unprecedented in human history, yet also raising important questions about privacy, security, and the impact of constant connectivity on our mental and emotional well-being, as we navigate the complexities of a digital age where the lines between the virtual and the real are increasingly blurred, and we must constantly adapt to new tools, platforms, and ways of interacting with the world and each other, whether through social media, online gaming, virtual reality, or other emerging technologies that promise to reshape the way we live, work, and play, offering new possibilities for creativity, collaboration, and innovation, but also posing significant challenges and risks, from cyberattacks and data breaches to the erosion of personal privacy and the potential for digital addiction, making it more important than ever to cultivate a mindful and balanced approach to our use of technology, to ensure that we harness its benefits while mitigating its drawbacks, and to remain vigilant and informed about the ways in which it shapes our lives and our society, as we continue to explore the frontiers of the digital age, driven by the relentless pursuit of progress and the enduring human desire to connect, create, and transcend the limitations of time and space, forging a future where technology serves as a powerful tool for enhancing our lives and expanding our horizons, while also reminding us of the enduring value of human connection, empathy, and the simple joys of living in the moment, free from the distractions and demands of a constantly connected world, and able to appreciate the beauty and wonder of the world around us, both natural and man-made, as we strive to balance the opportunities and challenges of the digital age with the timeless human quest for meaning, fulfillment, and a sense of belonging."

  const generateAudio = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  return (
    <div>
      <h2>Audio Generator</h2>
      {/* <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to synthesize"
      /> */}
      <audio ref={audioRef} controls />
      <button onClick={generateAudio}>Generate Audio</button>
    </div>
  );
};

export default AudioGenerator;
