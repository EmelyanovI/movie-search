const bodyNode = document.body;

const searchInputNode = document.getElementById("searchInput");
const searchButtonNode = document.getElementById("searchButton");
const searchResultNode = document.getElementById("searchResult");

const movieCloseButtonNode = document.getElementById("movieButtonClose");
const moviePageNode = document.querySelector(".movie-page");

// Объявление пометок
const BODY_OVERFLOW_HIDDEN_CLASSNAME = "body_fixed";
const MOVIE_VISIBLE_CLASSNAME = "movie-page_active";

// Отрисовываем страницу с информацией о фильме
const renderMovieInfo = (result) => {
  let movieHTML = "";

  if (!result || typeof result !== "object") {
    console.error("Неверный формат данных фильма.");
    return;
  }

  movieHTML =
    movieHTML +
    `<div class="movie-content">
    <button id="movieButtonClose" class="movie__button-close">✖</button>
    <div class="movie__info">
        <img src="${result.Poster}" alt="" class="info__image" />
        <div class="info-wrapper">
            <h2 class="info__title">${result.Title}</h2>
            <ul class="info__ratings">
            <li class="rating">
                <p class="label rating__label">IMDB</p>
                <span class="rating__value">${result.imdbRating}</span>
            </li>
            <li class="rating">
                <p class="label rating__label">Metascore</p>
                <span class="rating__value">${result.Metascore}</span>
            </li>
            </ul>
            <ul class="info__list">
            <li class="list__property">
                <p class="label">Year: </p>
                <span class="property__value">${result.Year}</span>
            </li>
            <li class="list__property">
                <p class="label">Rated: </p>
                <span class="property__value">${result.Rated}</span>
            </li>
            <li class="list__property">
                <p class="label">Runtime: </p>
                <span class="property__value">${result.Runtime}</span>
            </li>
            <li class="list__property">
                <p class="label">Genre: </p>
                <span class="property__value">${result.Genre}</span>
            </li>
            <li class="list__property">
                <p class="label">Director: </p>
                <span class="property__value">${result.Director}</span>
            </li>
            <li class="list__property">
                <p class="label">Writers: </p>
                <span class="property__value">${result.Writer}</span>
            </li>
            <li class="list__property">
                <p class="label">Actors: </p>
                <span class="property__value">${result.Actors}</span>
            </li>
            </ul>
        </div>
    </div>
    <p class="label movie__info-plot">${result.Plot}</p>
</div>
`;

  moviePageNode.innerHTML = movieHTML;
};

// Получаем IMDb ID от кликнутого фильма
const suggestedMoviesHandler = (event) => {
  const suggestMovieNode = event.target.closest(".result__movie");
  const movieImdbId = suggestMovieNode.dataset.imdbid;
  //   const movieImdbId = suggestMovieNode.getAttribute("imdbid");

  if (movieImdbId) {
    return movieImdbId;
  } else {
    console.error("Неверный movieImdbId");
  }
};

// Открываем окно с информацией о фильме
const showMovieContent = (movieImdbId) => {
  if (!movieImdbId || typeof movieImdbId !== "string" || !movieImdbId.trim()) {
    console.error("Неверный IMDb ID фильма.");
    return;
  }

  fetch(`https://www.omdbapi.com/?apikey=67fb7cd7&i=${movieImdbId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при выполнении запроса к серверу.");
      }
      return response.json();
    })
    .then((result) => {
      openMovieContent();
      renderMovieInfo(result);
    })
    .catch((error) => {
      console.error("Произошла ошибка!", error);
    });
};

// Открываем окно с подробностями о фильме: меняем атрибут на visible, фиксируем body, запускаем функцию отрисовки фильма
const openMovieContent = (movieImdbId) => {
  if (!moviePageNode || !bodyNode) {
    console.error("moviePageNode и bodyNode не определены");
    return;
  }

  moviePageNode.style.visibility = "visible";
  bodyNode.classList.add(BODY_OVERFLOW_HIDDEN_CLASSNAME);
  showMovieContent(movieImdbId);
};

// Закрываем окно с подробностями о фильме: меняем атрибут на hidden, включаем скролл в body
const closeMovieContent = () => {
  if (!moviePageNode || !bodyNode) {
    console.error("moviePageNode и bodyNode не определены");
    return;
  }

  moviePageNode.style.visibility = "hidden";
  bodyNode.classList.remove(BODY_OVERFLOW_HIDDEN_CLASSNAME);
};

const getMovieCards = () => {
  searchResultNode.addEventListener("click", (event) => {
    const movieCard = event.target.closest(".result__movie");

    if (movieCard) {
      const movieImdbId = movieCard.getAttribute("imdbid");
      showMovieContent(movieImdbId);
    }
  });
};

// Получаем массив movies из функции findMovies и отрисовываем список подходящих фильмов
const renderSuggestMovies = (movies) => {
  let moviesHTML = "";

  if (!Array.isArray(movies) || movies.length === 0) {
    alert(
      "Фильмы не найдены. Проверьте правильность ввода. Пишите на английском без очепяток."
    );
    return;
  }

  movies.forEach((movie) => {
    const posterLink = movie.Poster;
    const title = movie.Title;
    const year = movie.Year;
    const type = movie.Type;
    const imdbID = movie.imdbID;

    moviesHTML =
      moviesHTML +
      `<li class="result__movie" imdbid="${imdbID}">
              <img src="${posterLink}" alt="Movie Poster" class="movie__image" />
              <div class="movie__description">
                  <h2 class="description__title">${title}</h2>
                  <div class="description__year">${year}</div>
                  <div class="description__type">${type}</div>
              </div>
          </li>`;
  });

  searchResultNode.innerHTML = moviesHTML;

  getMovieCards();
};

// Берем поисковый запрос из searchMovieHandler и создаем массив movies, который затем передаем в функцию renderSuggestMovies
const findMovies = (searchRequest) => {
  if (
    !searchRequest ||
    typeof searchRequest !== "string" ||
    !searchRequest.trim()
  ) {
    alert("Неверный поисковый запрос.");
    return;
  }

  fetch(`https://www.omdbapi.com/?apikey=67fb7cd7&s=${searchRequest}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при выполнении запроса к серверу.");
      }
      return response.json();
    })
    .then((result) => {
      const movies = result.Search;
      renderSuggestMovies(movies);
    })
    .catch((err) => {
      console.error("Произошла ошибка!", err);
    });
};

// Берем поисковый запрос из инпута и передаем в функцию findMovies
const searchMovieHandler = () => {
  const searchRequest = searchInputNode.value;
  findMovies(searchRequest);
};

// Слушатель события по клику на кнопке SEARCH запускает фунцкию отрисовки списка фильмов
searchButtonNode.addEventListener("click", searchMovieHandler);

bodyNode.addEventListener("click", (event) => {
  if (event.target.id === "movieButtonClose") {
    closeMovieContent();
  }
});