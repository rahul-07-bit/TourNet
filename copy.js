const fs = require('fs');
const path = require('path');
const src = 'C:\\Users\\moham\\.gemini\\antigravity-ide\\brain\\0c92a9d9-a1cd-43c8-b0a8-d3667228a177\\himalayan_sunrise_1781603736546.png';
const dest = path.join(__dirname, 'public', 'himalayan_sunrise.png');
try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Successfully copied to ' + dest);
  } else {
    console.error('Source file does not exist: ' + src);
  }
} catch (err) {
  console.error('Error during copy:', err);
}
