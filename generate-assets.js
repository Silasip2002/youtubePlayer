const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Create a simple 1x1 transparent PNG
const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

// List of required asset files
const assetFiles = [
  'icon.png',
  'splash.png',
  'favicon.png',
  'adaptive-icon.png'
];

// Create each asset file
assetFiles.forEach(filename => {
  const filePath = path.join(assetsDir, filename);
  fs.writeFileSync(filePath, transparentPixel);
  console.log(`Created ${filePath}`);
});

console.log('All asset files created successfully!');
