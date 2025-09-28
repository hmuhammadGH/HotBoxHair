/* Image Extraction Script - HotBoxHair Website */

// This script extracts base64 images from the large HTML file
// and saves them as separate image files

const fs = require('fs');
const path = require('path');

// Function to extract base64 images from HTML content
function extractBase64Images(htmlContent) {
  const base64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
  const images = [];
  let match;
  
  while ((match = base64Regex.exec(htmlContent)) !== null) {
    const format = match[1];
    const base64Data = match[2];
    
    images.push({
      format: format,
      data: base64Data,
      fullMatch: match[0]
    });
  }
  
  return images;
}

// Function to save base64 data as image file
function saveBase64Image(base64Data, format, filename) {
  const buffer = Buffer.from(base64Data, 'base64');
  const filepath = path.join(__dirname, 'images', 'optimized', `${filename}.${format}`);
  
  fs.writeFileSync(filepath, buffer);
  console.log(`Saved: ${filepath}`);
  
  return filepath;
}

// Function to process the large HTML file
function processHTMLFile() {
  const htmlPath = path.join(__dirname, 'archive', 'hotboxhair_styled_v9.html');
  
  if (!fs.existsSync(htmlPath)) {
    console.error('HTML file not found:', htmlPath);
    return;
  }
  
  console.log('Reading HTML file...');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  console.log('Extracting base64 images...');
  const images = extractBase64Images(htmlContent);
  
  console.log(`Found ${images.length} embedded images`);
  
  // Create optimized directory if it doesn't exist
  const optimizedDir = path.join(__dirname, 'images', 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Save each image
  images.forEach((image, index) => {
    const filename = `extracted-image-${index + 1}`;
    saveBase64Image(image.data, image.format, filename);
  });
  
  console.log('Image extraction complete!');
}

// Run the extraction
if (require.main === module) {
  processHTMLFile();
}

module.exports = {
  extractBase64Images,
  saveBase64Image,
  processHTMLFile
};
