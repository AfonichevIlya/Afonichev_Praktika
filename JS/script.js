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

searchButton.addEventListener('click', async () => {
  const country = countriesSelect.value.trim();
  const genre = genresSelect.value.trim();
  if (country === '' || genre === '') {
    alert('Выберите страну и жанр');
    return;
  }
  const stations = await krData(country);
  const matchingStations = stations.filter(station => station.tags.includes(genre));
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



function playStation(station) {
  audio.src = station.url_resolved;
  audio.load();
  audio.play();
  nowPlaying.textContent = `Сейчас играет: ${station.name}`;
  nextUp.textContent = '';
  history.innerHTML = '';
}

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
audio.addEventListener('play', () => {
  const stationName = nowPlaying.textContent.split(':')[1].trim();
  const station = matchingStations.find(station => station.name === stationName);
  if (station) {
    fetch(`https://de1.api.radio-browser.info/json/nowplaying/${station.name}`)
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          nowPlaying.textContent = `Сейчас играет: ${data[0].title}`;
          if (data[1]) {
            nextUp.textContent = `Следующий трек: ${data[1].title}`;
          } else {
            nextUp.textContent = '';
          }
          if (data.length > 2) {
            history.innerHTML = 'Ранее играло: ';
            data.slice(2, 5).forEach(track => {
              const trackLink = document.createElement('a');
              trackLink.href = track.url;
              trackLink.target = '_blank';
              trackLink.textContent = track.title;
              history.appendChild(trackLink);
              history.appendChild(document.createTextNode(', '));
            });
          } else {
            history.innerHTML = '';
          }
        }
      });
  }
});
