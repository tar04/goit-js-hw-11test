import { Notify } from 'notiflix';
import getRefs from './getRefs';
import { PixabayAPI } from './api/PixabayAPI';
import createGalleryCards from '../templates/gallery-card.hbs';
// import SimpleLightbox from '../../node_modules/simplelightbox/dist/simple-lightbox';
// ./simplelightbox/dist/simple-lightbox.esm
// import SimpleLightbox from 'simplelightbox';
const { form, gallery, loadMoreBtn } = getRefs();
const pixabayAPI = new PixabayAPI();
const STORAGE_KEY = 'currentQuery';

form.addEventListener('submit', searchOnSubmit);
loadMoreBtn.addEventListener('click', loadMore);

function searchOnSubmit(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements[0].value.trim();
  pixabayAPI.query = searchQuery;

  if (!searchQuery) {
    notifyError();
    return;
  }

  pixabayAPI
    .fetchPhotos(searchQuery)
    .then(data => {
      // const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = data
      console.log('data.hits[0]:', data);
      console.log('data.hits.length:', data.hits);

      if (!data.hits.length) {
        clearGallery();
        notifyError();
        e.target.reset();
        return;
      }

      gallery.innerHTML = createGalleryCards(data.hits);
      const gallerySimpleLightbox = new SimpleLightbox('.gallery a');

      loadMoreBtn.classList.remove('is-hidden');
      // if (storedQuery !== searchQuery) {
      //   sessionStorage.setItem(STORAGE_KEY, searchQuery);
      //   clearGallery();
      //   Notify.info(`Hooray! We found ${data.totalHits} images.`);
      // }
      // console.log('searchOnSubmit -> data:', data.length);
    })
    .catch(error => {
      console.error(error);
      notifyError();
    });
}

function loadMore() {
  pixabayAPI.page += 1;
  pixabayAPI
    .fetchPhotos()
    .then(data => {
      let cardsShown = pixabayAPI.page * pixabayAPI.limit;
      console.log('loadMore -> cardsShown:', cardsShown);
      console.log('loadMore -> pixabayAPI.page:', pixabayAPI.page);

      console.log('loadMore -> data.totalHits:', data.totalHits);

      if (cardsShown >= data.totalHits) {
        loadMoreBtn.classList.add('is-hidden');
      }
      gallery.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
      const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
    })
    .catch(error => {
      console.log(error);
      return;
    });
}

function getCardMarkup() {}

function clearGallery() {
  gallery.innerHTML = '';
}

function notifyError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
// console.log('refs:', refs.form.elements[1].textContent);

// import './task2.css';
// import { fetchUsers } from './api/api';

// // При натисканні на look for потрібно вивести юзерів
// // в блок data. Та потім реалізувати пошук на стороні клієнта
// // за імʼям.
// // 'https://jsonplaceholder.typicode.com/users' - api

// const formRef = document.querySelector('#form');
// const data = document.querySelector('div.data');
// const input = document.querySelector('input.validate');

// formRef.addEventListener('submit', lookForUsers);
// input.addEventListener('input', filterUsers);

// function filterUsers(evt) {
//   const filter = evt.currentTarget.value;
//   const usersData = sessionStorage.getItem('users');

//   if (!usersData) return;

//   renderUsers(JSON.parse(usersData).filter(user => user.name.includes(filter)));
// }

// function lookForUsers(e) {
//   e.preventDefault();
//   fetchUsers().then(renderUsers);
// }

// function renderUsers(users) {
//   if (!sessionStorage.getItem('users'))
//     sessionStorage.setItem('users', JSON.stringify(users));

//   const usersMarkup = `
//         <ul>
//             ${users.map(createUserMarkup).join('')}
//         </ul>
//     `;

//   data.replaceChildren();

//   data.insertAdjacentHTML('beforeend', usersMarkup);
// }

// function createUserMarkup({ name }) {
//   return `<li>${name}</li>`;
// }

// export function fetchUsers() {
//   return fetch('https://jsonplaceholder.typicode.com/users')
//     .then(r => {
//       if (!r.ok) {
//         throw new Error('Error');
//       }

//       return r.json();
//     })
//     .catch(err => console.log(err.message));
// }
