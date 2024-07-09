import React, { useState, useEffect, useRef } from 'react';

const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();

const TTSComponent = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [src, setSrc] = useState(false);
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const audioCtx = audioContextRef.current

    const playAudioStream = async () => {
        setIsPlaying(true);

        const url = `http://143.198.171.109:5000/tts?text=${encodeURIComponent(text)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error("HTTP error:", response.status, response.statusText);
                setIsPlaying(false);
                return;
            }

            if (!response.body) {
                console.error("No response body.");
                setIsPlaying(false);
                return;
            }
            console.log(response)
            window.R = response

            // const blob = await response.blob()
            // const urlp = URL.createObjectURL(blob)
            // console.log(urlp)

            // return;
            const reader = response.body.getReader();
            // let audioData = new Uint8Array();

            // while (true) {
            //     const { done, value } = await reader.read();
            //     if (done) break;

            //     const tempBuffer = new Uint8Array(audioData.length + value.length);
            //     console.log(tempBuffer)
            //     tempBuffer.set(audioData);
            //     tempBuffer.set(value, audioData.length);
            //     audioData = tempBuffer;

            //     playAudioChunk(tempBuffer);
            // }
            const audioChunks = []
            const audioEl = new Audio("")
            let timeout
            console.dir(audioEl)
            window.AS = getStream(reader)
            for await(const audioChunk of getStream(reader)) {
                console.log("playing next")
                audioChunks.push(audioChunk)
                // await playAudioChunk$(audioChunk).catch(err => console.error(err))
                const blob = new Blob(audioChunks, { type: response.headers.get("content-type") })
                const audioUrl = URL.createObjectURL(blob)
                clearTimeout(timeout)
                playAudio(audioEl, audioUrl)

                // await new Promise((res, rej) => {
                //     audioEl.play()
                //     audioEl.addEventListener("ended", () => {
                //         console.log(audioEl)
                //         res()
                //     })
                //     audioEl.addEventListener("error", () => rej)
            // })§1 ~§§§    w
            }
            console.log(audioChunks)
            console.log("done")

            // for(const chunk of audioChunks) {
            //     await p
            // }

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsPlaying(false);
        }
    };
    /**
     * 
     * @param {HTMLAudioElement} el 
     * @param {string} src 
     */
    const playAudio = throttle((el, src) => {
        const currentTime = el.currentTime
        console.log((currentTime))
        el.pause()
        el.src = src
        el.currentTime = currentTime
        el.play()
    }, 100)

    // const playAudioChunk = async (chunk) => {
    //     try {
    //         const audioBuffer = await AUDIO_CTX.decodeAudioData(chunk.buffer);
    //         const sourceNode = AUDIO_CTX.createBufferSource();
    //         sourceNode.buffer = audioBuffer;
    //         sourceNode.connect(AUDIO_CTX.destination);
    //         sourceNode.start();
    //     } catch (err) {
    //         console.error("Error decoding audio data:", err);
    //     }
    // };
    
    const playAudioChunk$ = (chunk) => new Promise(async (resolve, reject) => {
        try {
            console.log(chunk.buffer)
            const audioBuffer = await AUDIO_CTX.decodeAudioData(chunk.buffer);
            console.log("decoded")
            const sourceNode = AUDIO_CTX.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(AUDIO_CTX.destination);
            sourceNode.start();
            console.log("play")

            sourceNode.addEventListener("ended", () => {
                console.log("doneplaying")
                resolve()
            })
        } catch (err) {
            // console.error("Error decoding audio data:", err);
            reject(err)
        }
    });

    const audioRef = useRef(null)

    return (
        <div>
            <button onClick={playAudioStream} disabled={isPlaying}>
                {isPlaying ? 'Playing...' : 'Play Text'}
            </button>
            <audio
            ></audio>
            {/* <audio src={`http://localhost:8001/tts?text=${encodeURIComponent(text)}`} controls ref={audioRef}></audio> */}
            {/* <button onClick={() => audioRef.current?.play()}>Play audio</button> */}
        </div>
    );
};

export default TTSComponent;

async function* getStream(reader, { signal } = {}) {
    while(true) {
      signal?.throwIfAborted()
  
      const {value, done} = await reader.read()
      if(done) break;
      yield value
    }
  }

  function throttle(func, wait) {
    let timeout
    let latestArgs = null
    let canInvoke = true
  
    return (...args) => {
      latestArgs = args
  
      if(!canInvoke) return
  
      func(...latestArgs)
      latestArgs = null
      canInvoke = false
      
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        canInvoke = true
  
        if(latestArgs != null) {
          func(...latestArgs)
          latestArgs = null
        }
      }, wait)
    }
  }