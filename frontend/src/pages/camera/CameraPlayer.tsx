
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

type PlayerProps = {
    src: string;
};

const CameraPlayer = ({ src }: PlayerProps) => {
  return (
    <MediaPlayer
      src={src}
      viewType='video'
      streamType='on-demand'
      logLevel='warn'
      crossOrigin
      playsInline
      title='Sprite Fight'
      // poster='https://files.vidstack.io/sprite-fight/poster.webp'
    >
      <MediaProvider>
        <Poster className="vds-poster" />
      </MediaProvider>
      <DefaultVideoLayout
        // thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}

export default CameraPlayer