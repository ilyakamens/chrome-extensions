if (location.pathname === '/') {
  const style = document.createElement('style');
  style.textContent = `
    ytd-browse /* Home page suggested videos */
    {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

// Convert shorts to videos.
if (location.pathname.startsWith('/shorts')) {
  location.href = location.href.replace('shorts/', 'watch?v=');
}

if (location.pathname === '/watch') {
  const style = document.createElement('style');
  style.textContent = `
    div.ytp-ce-element, /* End screen elements (from author) */
    div#secondary, /* Right-hand sidebar for suggested videos */
    div#related, /* Same as previous, but sometimes appears below dependign on layout */
    div.ytp-fullscreen-grid-stills-container /* YouTube end-cards at the end of videos */
    {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
