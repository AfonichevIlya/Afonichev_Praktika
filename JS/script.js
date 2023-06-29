const countriesSelect = document.querySelector('#countries-select');
const genresSelect = document.querySelector('#genres-select');
const audio = document.querySelector('#audio-player');
const nowPlaying = document.querySelector('#now-playing');
const nextUp = document.querySelector('#next-up');
const history = document.querySelector('#history');
async function krData(strana) {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${strana}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}
fetch( `https://de1.api.radio-browser.info/json/countries`)
  .then(response => response.json())
  .then(data => {
    data.forEach(country => {
      const option = document.createElement('option');
      option.value = country.name;
      option.textContent = country.name;
      countriesSelect.appendChild(option);
    });
  });
  const genres = ['pop', 'rock', 'jazz', 'classical', 'country', 'hiphop', 'blues'];
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genresSelect.appendChild(option);
  });
  const searchButton = document.querySelector('#search-button');
const stationsList = document.querySelector('#stations-list');
let matchingStations = [];
searchButton.addEventListener('click', async () => {
  const country = countriesSelect.value.trim();
  const genre = genresSelect.value.trim();
  if (country === '' || genre === '') {
    alert('Выберите страну и жанр');
    return;
  }
  const stations = await krData(country);
  matchingStations = stations.filter(station => station.tags.includes(genre));
    if (matchingStations.length === 0) {
    stationsList.textContent = `Станций с жанром "${genre}" не найдено`;
    return;
  }
  stationsList.innerHTML = '';
  matchingStations.forEach(station => {
    const stationLink = document.createElement('a');
    stationLink.href = station.homepage;
    stationLink.target = '_blank';
    stationLink.textContent = station.name;
    const listItem = document.createElement('li');
    listItem.appendChild(stationLink);
    stationsList.appendChild(listItem);
  });
});
stationsList.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.tagName === 'A') {
    const stationName = event.target.textContent;
    const station = matchingStations.find(station => station.name === stationName);
    if (station) {
      playStation(station);
    }
  }
});


 function playStation(station) {
  // Set the station name and audio source for the popup window
  const popupStationName = document.querySelector('#popup-station-name');
  const popupAudio = document.querySelector('#popup-audio');
  popupStationName.textContent = `Сейчас играет: ${station.name}`;
  popupAudio.src = station.url_resolved;
  popupAudio.load();
   // Display the popup window
  const popup = document.querySelector('#popup');
  popup.style.display = 'block';
   // Create the playlist for the station
   // Close the popup window when the close button is clicked
  const popupCloseButton = document.querySelector('#popup-close-button');
  popupCloseButton.addEventListener('click', () => {
    popup.style.display = 'none';
    // Pause the audio when closing the popup
    popupAudio.pause();
  });
}


























