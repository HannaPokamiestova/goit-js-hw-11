import { fetchImages } from './js/fetchImages';
import Notiflix from 'notiflix';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadBtn: document.querySelector('.js-load-more'),
};

const PER_PAGE = 40;
const searchParams = {
  currentPage: 1,
  query: '',
  totalPages: 0,
};

refs.searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  searchParams.currentPage = 1;
  searchParams.query = event.currentTarget.elements.searchQuery.value.trim();
  refs.loadBtn.style.display = 'none';
  refs.gallery.innerHTML = '';
  fetchImages(searchParams.query, searchParams.currentPage, PER_PAGE).then(
    data => {
      if (!data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      printGalleryItems(data.hits);
      setLoadMore(data.totalHits);
    }
  );
}

function printGalleryItems(hits) {
  const markup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
<div class="photo-card">
<img src="${webformatURL}" alt="${tags}" loading="lazy" /> <div class="info">
<p class="info-item">
<b>Likes</b>
<span class="quantity">${likes}</span>
</p>
<p class="info-item">
        <b>Views</b>
<span class="quantity">${views}</span> </p>
<p class="info-item">
<b>Comments</b>
<span class="quantity">${comments}</span>
</p>
<p class="info-item">
        <b>Downloads</b>
<span class="quantity">${downloads}</span> </p>
</div> </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function setLoadMore(totalHits) {
  searchParams.totalPages = totalHits / PER_PAGE;
}

if (searchParams.currentPage < searchParams.totalPages) {
  refs.loadBtn.style.display = 'block';

  return;
}

refs.loadBtn.style.display = 'none';
Notiflix.Notify.info(
  "We're sorry, but you've reached the end of search results."
);

refs.loadBtn.addEventListener('click', onLoadClick);

function onLoadClick() {
  searchParams.currentPage++;
  fetchImages(searchParams.query, searchParams.currentPage, PER_PAGE).then(
    data => {
      printGalleryItems(data.hits);
      setLoadMore(data.totalHits);
    }
  );
}
