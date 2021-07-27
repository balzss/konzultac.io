import React, { useState, useRef } from 'react';
import {
  TextField,
  IconButton,
} from '@material-ui/core'
import {
  Rotate90DegreesCcwRounded,
  GetAppRounded,
  ShareRounded,
} from '@material-ui/icons'
import { Picker } from 'emoji-mart';
import { toPng } from 'html-to-image';

import 'emoji-mart/css/emoji-mart.css'
import './App.scss';

const defaults = {
  primaryText: 'Ön is szeretne saját plakátot?',
  secondaryText: 'Készítsen egyet!',
  emoji: '1f9d1-200d-1f3a8', // artist emoji
};

const App = () => {
  const canvasRef = useRef(null);
  const [primaryText, setPrimaryText] = useState(defaults.primaryText);
  const [secondaryText, setSecondarytext] = useState(defaults.secondaryText);
  const [emoji, setEmoji] = useState(defaults.emoji);

  const decorateText = (text) => {
    const splitText = text.split(' ');
    const splitIndex = splitText.length > 2 ? 2 : 1;
    const firstPart = text.split(' ').splice(0, splitIndex).join(' ').toUpperCase();
    const secondPart = text.split(' ').splice(splitIndex).join(' ').toUpperCase();
    return (
      <>
        <div className="Canvas__subtitle--redPart">{firstPart}</div>
        { secondPart && <div className="Canvas__subtitle--greenPart">&nbsp;{secondPart}</div> }
      </>
    );
  };

  const downloadImage = () => {
    toPng(canvasRef.current, { pixelRatio: 1 }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${primaryText.split(' ').splice(0, 3).join(' ')} (${new Date(Date.now()).toISOString().substring(0, 10)})`;
      link.href = dataUrl;
      link.click();
    });
  };

  const shareImage = () => {
    toPng(canvasRef.current, { pixelRatio: 1 }).then(async (dataUrl) => {
      const blob = await (await fetch(dataUrl)).blob();
      const files = [new File([blob], 'plakat.png', { type: blob.type, lastModified: new Date().getTime() })];
      navigator.share({ files });
    });
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="Toolbar">
          {/* <IconButton> <Rotate90DegreesCcwRounded /> </IconButton> */}
          <IconButton onClick={downloadImage}>
            <GetAppRounded />
          </IconButton>
          {navigator.share && (
            <IconButton onClick={shareImage}>
              <ShareRounded />
            </IconButton>
          )}
        </div>
        <div className="Canvas" id="capture" ref={canvasRef}>
          <div className="Canvas__title">{primaryText.toUpperCase()}</div>
          <img src={`img-apple-160/${emoji}.png`} alt="" />
          {secondaryText && (
            <div className="Canvas__subtitle">
              {decorateText(secondaryText)}
            </div>
          )}
        </div>
        <div className="Fields">
          <TextField
            className="field"
            label="Felső szöveg"
            variant="outlined"
            value={primaryText}
            onChange={(e) => setPrimaryText(e.target.value)}
          />
          <TextField
            className="field"
            label="Alsó szöveg"
            variant="outlined"
            value={secondaryText}
            onChange={(e) => setSecondarytext(e.target.value)}
          />
          <Picker onSelect={(emoji) => setEmoji(emoji.unified)} style={{width: '100%'}} exclude={['recent']} showSkinTones={false} showPreview={false}/>
        </div>
      </div>
    </div>
  );
};

export default App;
