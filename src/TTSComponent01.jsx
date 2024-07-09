import React, { useState, useEffect, useRef } from 'react';

const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();

const TTSComponent01 = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [src, setSrc] = useState(false);
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const audioCtx = audioContextRef.current

    const playAudioStream = async () => {
        setIsPlaying(true);

        const url = `http://143.198.171.109:5000/tts`;
        const audio_id = Math.random().toString()

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    language: 'en',
                    audio_id
                })
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

            // console.log(response)
            // response.blob().then(audio => {
            //     console.log(URL.createObjectURL(audio))
            // })

            const browserResponse = response.clone()
            browserResponse.blob().then(audio => {
                console.log("8312t792378t72893t7")
                console.log("8312t792378t72893t7")
                console.log("8312t792378t72893t7")
                console.log("8312t792378t72893t7")
                console.log("8312t792378t72893t7")
                console.log("8312t792378t72893t7")
                console.log(URL.createObjectURL(audio))
            })

            const reader = response.body.getReader();

            let audioChunks = []
            const audioEl = new Audio("")
            let timeout
            console.dir(audioEl)
            let isFullyLoaded = false
            audioEl.addEventListener("loadeddata", () => {
              console.log(`
                dur - ${audioEl.duration}
                cur - ${audioEl.currentTime}
                `)
              if(isFullyLoaded || audioEl.duration - audioEl.currentTime > 1) {
                audioEl.play()
                console.log("TYUHJK <JELJK LK LK")
                console.log("playing")
              }
            })
            for await(const audioChunk of getStream(reader)) {
                console.log("playing next")
                audioChunks = [...audioChunks, audioChunk]
                // console.log(audioChunk)
                // await playAudioChunk$(audioChunk).catch(err => console.error(err))
                const blob = new Blob(audioChunks, { type: response.headers.get("content-type") })
              console.log(blob)
                const audioUrl = URL.createObjectURL(blob)
                clearTimeout(timeout)
                loadAudio(audioEl, audioUrl)

                // await new Promise((res, rej) => {
                //     audioEl.play()
                //     audioEl.addEventListener("ended", () => {
                //         console.log(audioEl)
                //         res()
                //     })
                //     audioEl.addEventListener("error", () => rej)
            // })
            }
            // console.log(URL.createObjectURL(
            //     new Blob(audioChunks, { type: response.headers.get("content-type") })
            // ))
            console.log("done")
            console.dir(audioEl)

            // {
            //     console.log("making download")
            //     const url = `http://143.198.171.109:5000/download/${audio_id}`;
            //     const response = await fetch(url);
            //     response.blob().then(audio => {
            //         console.log("done download")
            //         console.log(audio)
            //         const audioUrl = URL.createObjectURL(audio)
            //         loadAudio(audioEl, audioUrl)
            //         isFullyLoaded = true
            //     })
            // }

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
    // const playAudio = debounce((el, src) => {
    //     const currentTime = el.currentTime
    //     console.log((currentTime))
    //     el.pause()
    //     el.src = src
    //     el.currentTime = currentTime
    //     console.log(el.currentTime, el.duration)
    //     el.play()
    // }, 5000)
    // const playAudio = throttle((el, src) => {
    //     const currentTime = el.currentTime
    //     console.log((currentTime))
    //     el.pause()
    //     el.src = src
    //     el.currentTime = currentTime
    //     el.play()
    //     console.log("TYUHJK <JELJK LK LK")
    //     console.log("playing")
    // }, 100)
    const loadAudio = throttle((el, src) => {
        const currentTime = el.currentTime
        // console.log((currentTime))
        el.pause()
        el.src = src
        // el.currentTime = currentTime
        el.currentTime = currentTime
    }, 250)
    // const playAudio = throttle((el, src) => {
    //     deb(() => {
    //         const currentTime = el.currentTime
    //         console.log((currentTime))
    //         el.pause()
    //         el.src = src
    //         el.currentTime = currentTime
    //         el.play()
    //         console.log("TYUHJK <JELJK LK LK")
    //         console.log("playing")
    //     })
    // }, 1000)

    const deb = debounce((fn) => {
        fn()
    }, 2000)

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

export default TTSComponent01;

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

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }
