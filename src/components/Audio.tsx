import { useRef, useImperativeHandle, forwardRef } from 'react';
import audioSrc from "../assets/audio.mp3";

interface AudioRef {
  setVolume: (volume: number) => void;
}

const Audio = forwardRef<AudioRef>((_props, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => ({
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
  }));

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} autoPlay loop />
    </div>
  );
});

export default Audio;