import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();
  clearInfo();
     if (inputValue === '') {
      return;
    }

  fetchCountries(inputValue)
    .then(countriesListCreate)
    .catch(countriesListError);
}

function countriesListCreate(country) {
  const countryLength = country.length;
  if (countryLength > 10) {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (countryLength > 1 && countryLength <= 10) {
    return arrayOfCountries(country);
  }
  if (countryLength === 1) {
    return cardOfCountry(country);
  }
  
}

function countriesListError(error) {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}

function arrayOfCountries(country) {
  const arraOfCountries = country
    .map(
      ({ flags, name }) =>
        `<li class="country-item">
            <img  src="${flags.svg}" 
            alt="${name.official}" 
            class="country-img"
            width="60" >
            <p class="country-list-text">${name.official}</p>
        </li>`
    )
    .join('');
  countriesList.innerHTML = arraOfCountries;
}

function cardOfCountry(country) {
  const card = country
    .map(
      ({ flags, name, capital, population, languages }) =>
        `
      <h2 class="info-name">
        <img class="info-img" 
        src="${flags.svg}" 
        alt=" ${name.common}"
        width="100">
        ${name.common}
      </h2>
      <p class="info-capital"><b>Capital: </b>${capital}</p>
      <p class="info-opulation"><b>Population: </b>${population}</p>
      <p class="info-languages"><b>Languages: </b>${Object.values(languages)}</p>
        `
    )
    .join('');
  countryInfo.innerHTML = card;
}

function clearInfo() {
  countryInfo.innerHTML = '';
  countriesList.innerHTML = '';
}
