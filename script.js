const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load background image
const img = new Image();
img.src = 'https://i.imgur.com/zTpLHHR.png';
let drawWidth, drawHeight;

img.onload = () => {
  // Calculate scaling to fit window while maintaining aspect ratio (1116x1079)
  const imgRatio = img.width / img.height; // 1116 / 1079
  const winRatio = window.innerWidth / window.innerHeight;
  if (imgRatio > winRatio) {
    drawWidth = window.innerWidth;
    drawHeight = window.innerWidth / imgRatio;
  } else {
    drawHeight = window.innerHeight;
    drawWidth = window.innerHeight * imgRatio;
  }
  // Center the image
  const offsetX = (window.innerWidth - drawWidth) / 2;
  const offsetY = (window.innerHeight - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  console.log('Image loaded, drawWidth:', drawWidth, 'drawHeight:', drawHeight, 'offsetX:', offsetX, 'offsetY:', offsetY);

  // Map bounds (gm_bigcity world coordinates)
  const minX = -8192, maxX = 8192;
  const minY = -8192, maxY = 8192;
  const worldWidth = maxX - minX; // 16384 units
  const worldHeight = maxY - minY; // 16384 units

  // Function to plot player
  function plotPlayer(x, y, velLen, velDir) {
    console.log('Plotting:', { x, y, velLen, velDir }); // Debug coordinates
    const imgWidth = drawWidth || 1116; // Fallback to image width
    const imgHeight = drawHeight || 1079; // Fallback to image height
    const scaleX = imgWidth / worldWidth;
    const scaleY = imgHeight / worldHeight;

    const px = offsetX + ((x - minX) * scaleX); // Adjust for X offset
    const py = offsetY + (imgHeight - ((y - minY) * scaleY)) - 30; // Adjust for Y offset and centering

    console.log('Pixel coords:', { px, py }); // Debug pixel positions
    if (px >= offsetX && px <= (offsetX + imgWidth) && py >= offsetY && py <= (offsetY + imgHeight)) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();

      const arrowLen = velLen / 100;
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + arrowLen * Math.cos(velDir), py + arrowLen * -Math.sin(velDir));
      ctx.stroke();
    } else {
      console.log('Out of bounds:', { px, py, imgWidth, imgHeight, offsetX, offsetY });
    }
  }

  // Single real-time update loop
  let updateInterval = setInterval(async () => {
    try {
      const res = await fetch('https://emm-mapped.onrender.com/data');
      const players = await res.json();
      console.log('Fetched players:', players); // Debug fetched data
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      players.forEach(p => plotPlayer(p.x, p.y, p.vel_len, p.vel_dir));
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, 100);
};

// Handle window resize with single update
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const imgRatio = img.width / img.height;
  const winRatio = window.innerWidth / window.innerHeight;
  if (imgRatio > winRatio) {
    drawWidth = window.innerWidth;
    drawHeight = window.innerWidth / imgRatio;
  } else {
    drawHeight = window.innerHeight;
    drawWidth = window.innerHeight * imgRatio;
  }
  const offsetX = (window.innerWidth - drawWidth) / 2;
  const offsetY = (window.innerHeight - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  // Clear previous interval and restart
  clearInterval(updateInterval);
  updateInterval = setInterval(async () => {
    const res = await fetch('https://emm-mapped.onrender.com/data');
    const players = await res.json();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    players.forEach(p => plotPlayer(p.x, p.y, p.vel_len, p.vel_dir));
  }, 100);
});