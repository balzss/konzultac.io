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
import { NimblePicker } from 'emoji-mart';
import emojiDataHu from './emojiMartHuData.json';
import { toPng } from 'html-to-image';

import 'emoji-mart/css/emoji-mart.css'
import './App.scss';

const defaults = {
  primaryText: 'Ön is szeretne saját plakátot?',
  secondaryText: 'Készítsen egyet!',
  emoji: '1f9d1-200d-1f3a8', // artist emoji
};

const i18nHu = {
  search: 'Keresés',
  clear: 'Törlés', // Accessible label on "clear" button
  notfound: 'Nincs ilyen emoji',
  skintext: 'Válassz alapértelmezett bőrtónust',
  categories: {
    search: 'Keresés eredménye',
    recent: 'Gyakran használt',
    smileys: 'Smiley és érzelmek',
    people: 'Emberek és érzelmek',
    nature: 'Állatok és természet',
    foods: 'Ételek és italok',
    activity: 'Sport és szabadidő',
    places: 'Utazás és helyek',
    objects: 'Tárgyak',
    symbols: 'Szimbólumok',
    flags: 'Zászlók',
    custom: 'Egyéni',
  },
  categorieslabel: 'Emoji categories', // Accessible title for the list of categories
  skintones: {
    1: 'Default Skin Tone',
    2: 'Light Skin Tone',
    3: 'Medium-Light Skin Tone',
    4: 'Medium Skin Tone',
    5: 'Medium-Dark Skin Tone',
    6: 'Dark Skin Tone',
  },
};

const App = () => {
  const canvasRef = useRef(null);
  const [primaryText, setPrimaryText] = useState(defaults.primaryText);
  const [secondaryText, setSecondarytext] = useState(defaults.secondaryText);
  const [emoji, setEmoji] = useState(defaults.emoji);
  const [showWatermark, setShowWatermark] = useState(false);
  const [horizontalLayout, setHorizontalLayout] = useState(false);

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
    setShowWatermark(true);
    toPng(canvasRef.current, { pixelRatio: 2 }).then((dataUrl) => {
      setShowWatermark(false);
      const link = document.createElement('a');
      link.download = primaryText;
      link.href = dataUrl;
      link.click();
    });
  };

  const shareImage = () => {
    setShowWatermark(true);
    toPng(canvasRef.current, { pixelRatio: 2 }).then(async (dataUrl) => {
      setShowWatermark(false);
      const blob = await (await fetch(dataUrl)).blob();
      const files = [new File([blob], 'plakat.png', { type: blob.type, lastModified: new Date().getTime() })];
      navigator.share({ files });
    });
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="Toolbar">
          {/*<IconButton onClick={() => setHorizontalLayout(prevState => !prevState)}>
            <Rotate90DegreesCcwRounded />
          </IconButton>*/}
          <IconButton onClick={downloadImage}>
            <GetAppRounded />
          </IconButton>
          {navigator.share && (
            <IconButton onClick={shareImage}>
              <ShareRounded />
            </IconButton>
          )}
        </div>
        <div className={`Canvas ${horizontalLayout ? 'Canvas--horizontal' : ''}`} id="capture" ref={canvasRef}>
          <div className="Canvas__title">{primaryText.toUpperCase()}</div>
          <img src={`img-apple-160/${emoji}.png`} alt="" />
          {secondaryText && (
            <div className="Canvas__subtitle">
              {decorateText(secondaryText)}
            </div>
          )}
          {showWatermark && (
            <div className="watermark">konzultac.io</div>
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
          <NimblePicker
            onSelect={(emoji) => setEmoji(emoji.unified)}
            style={{width: '100%'}}
            exclude={['recent']}
            showSkinTones={false}
            showPreview={false}
            data={emojiDataHu}
            i18n={i18nHu}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
