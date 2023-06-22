// Получаем элементы со страницы
const countrySelect = document.querySelector('#country-select');
const genreSelect = document.querySelector('#genre-select');
const searchButton = document.querySelector('#search-button');
const stationsContainer = document.querySelector('#stations-container');

// Функция для получения данных с API RadioBrowser
async function getStations(country, genre) {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${country}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    const stations = data.filter(station => station.tags.includes(genre));
    return stations;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

// Функция для отображения списка станций
function renderStations(stations) {
  stationsContainer.innerHTML = '';
  const playlist = document.createElement('div');
  stations.forEach(station => {
    const stationLink = document.createElement('a');
    stationLink.href = station.homepage;
    stationLink.target = '_blank';
    stationLink.textContent = station.name;
    stationsContainer.appendChild(stationLink);
  });
  stationsContainer.appendChild(playlist);
}

// Обработчик события для кнопки поиска станций
searchButton.addEventListener('click', async () => {
  const country = countrySelect.value;
  const genre = genreSelect.value;
  const stations = await getStations(country, genre);
  renderStations(stations);
});

// Функция для получения информации о текущей песне на станции
async function getCurrentSong(station) {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/url/${station.url}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    return data.now_playing;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}

// Функция для отображения информации о текущей песне на станции
async function renderCurrentSong(station) {
  const currentSong = await getCurrentSong(station);
  const currentSongElement = document.createElement('div');
  currentSongElement.textContent = `Сейчас играет: ${currentSong}`;
  stationsContainer.appendChild(currentSongElement);
}

// Функция для получения информации о следующей песне на станции
async function getNextSong(station) {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/url/${station.url}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    return data.playing_next;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}

// Функция для отображения информации о следующей песне на станции
async function renderNextSong(station) {
  const nextSong = await getNextSong(station);
  const nextSongElement = document.createElement('div');
  nextSongElement.textContent = `Следующая песня: ${nextSong}`;
  stationsContainer.appendChild(nextSongElement);
}

// Функция для получения информации о предыдущей песне на станции
async function getPrevSong(station) {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/url/${station.url}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    return data.playing_previous;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}

// Функция для отображения информации о предыдущей песне на станции
async function renderPrevSong(station) {
  const prevSong = await getPrevSong(station);
  const prevSongElement = document.createElement('div');
  prevSongElement.textContent = `Предыдущая песня: ${prevSong}`;
  stationsContainer.appendChild(prevSongElement);
}

// Обработчик события для ссылок на станции
stationsContainer.addEventListener('click', event => {
  event.preventDefault();
  const stationLink = event.target;
  const station = { name: stationLink.textContent, url: stationLink.href };
  renderCurrentSong(station);
  renderNextSong(station);
  renderPrevSong(station);
});


//Код JS не только отображает список станций, но и добавляет функционал плейлиста. После выбора станции из списка пользователь может увидеть информацию о текущей, следующей и предыдущей песнях на станции. Каждая информационная строка отображается в отдельном элементе div.