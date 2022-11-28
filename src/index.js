import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();

  clearInfo();

  if (inputValue === '') {
    return;
  }

  fetchCountries(inputValue)
    .then(country => {
      if (country.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (country.length >= 2 && country.length <= 10) {
        return arrayOfCountries(country);
      }
      if (country.length === 1) {
        return cardOfCountry(country);
      }
    })
    .catch(error => {
      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}

function arrayOfCountries(country) {
  const arraOfCountries = country
    .map(
      ({ flags, name }) =>
        `<li class="country-item">
            <img  src="${flags.svg}" 
            alt="${name.official}" 
            class="country-img"
            width="40"
            >
            
            <p class="country-list-text">${name.common}</p>
        </li>`
    )
    .join('');
  refs.countryList.innerHTML = arraOfCountries;
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
        width="70"
        >
        ${name.common}
      </h2>
      <p class="info-capital"><b>Capital: </b>${capital}</p>
      <p class="info-opulation"><b>Population: </b>${population}</p>
      <p class="info-languages"><b>Languages: </b>${Object.values(languages)}</p>
        `
    )
    .join('');
  refs.countryInfo.innerHTML = card;
}

function clearInfo() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
