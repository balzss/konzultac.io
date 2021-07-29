const emojisHu = require('emojibase-data/hu/data.json');
const fs = require('fs');

fs.readFile(
  '../node_modules/emoji-mart/data/apple.json',
  (e, appleEmojiData) => {
    if (e) return;
    const appleEmoji = JSON.parse(appleEmojiData);
    Object.entries(appleEmoji.emojis).forEach(([key, value]) => {
      const correspondant = emojisHu.find(emoji => emoji.hexcode === value.b);
      if (!correspondant) return;
      appleEmoji.emojis[key].a = correspondant.annotation;
      appleEmoji.emojis[key].j = correspondant.tags;
    });
    fs.writeFileSync('../src/emojiMartHuData.json', JSON.stringify(appleEmoji, null, 2) , 'utf-8');
  }
);
