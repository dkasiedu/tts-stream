import React, { useRef } from 'react';

const AudioPlayer = ({ filename }) => {
  const audioRef = useRef(null);

  const startStreaming = () => {
    if (audioRef.current) {
      audioRef.current.src = `http://127.0.0.1:5000/api/stream1`;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <h2>Audio Player 1</h2>
      <audio ref={audioRef} controls />
      <button onClick={startStreaming}>Play Audio</button>
    </div>
  );
};

export default AudioPlayer;
