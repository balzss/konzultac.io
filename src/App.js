import React, { useState } from 'react';
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
import html2canvas from 'html2canvas';

import 'emoji-mart/css/emoji-mart.css'
import './App.scss';

const App = () => {
  const [primaryText, setPrimaryText] = useState('ez egy plakát?');
  const [secondaryText, setSecondarytext] = useState('az ám!');
  const [emoji, setEmoji] = useState('yawning_face');

  const decorateText = (text) => {
    const firstPart = text.split(' ').splice(0, 2).join(' ').toUpperCase();
    const secondPart = text.split(' ').splice(2).join(' ').toUpperCase();
    return (
      <>
        <span className="Canvas__subtitle--redPart">{firstPart}</span>
        { secondPart && <span className="Canvas__subtitle--greenPart">&nbsp;{secondPart}</span> }
      </>
    );
  };

  const getImg = () => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
      const link = document.createElement('a');
      link.download = 'plakat-test.png';
      link.href = canvas.toDataURL()
      link.click();
    });
  };

  return (
    <div className="container">
      <div className="Toolbar">
        {/* <IconButton> <Rotate90DegreesCcwRounded /> </IconButton> */}
        <IconButton onClick={getImg}>
          <GetAppRounded />
        </IconButton>
        {/* <IconButton> <ShareRounded /> </IconButton> */}
      </div>
      <div className="Canvas" id="capture">
        <div className="Canvas__title">{primaryText.toUpperCase()}</div>
        <img src={`/emoji-images/160x160/${emoji.toLowerCase().replace(' ', '_')}.png`} alt="" />
        {secondaryText && (
          <div className="Canvas__subtitle">
            {decorateText(secondaryText)}
          </div>
        )}
      </div>
      <div className="Fields">
        <TextField
          className="field"
          label="egyik"
          variant="outlined"
          value={primaryText}
          onChange={(e) => setPrimaryText(e.target.value)}
        />
        <TextField
          className="field"
          label="másik"
          variant="outlined"
          value={secondaryText}
          onChange={(e) => setSecondarytext(e.target.value)}
        />
        <Picker onSelect={(emoji) => setEmoji(emoji.name)} style={{width: '100%'}} exclude={['recent']} showSkinTones={false} showPreview={false}/>
      </div>
    </div>
  );
};

export default App;
