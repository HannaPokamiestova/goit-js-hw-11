import axios from 'axios';

const URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page, perPage) {
  const key = '36660815-e6e20e8460ba8bd16a81efb15';

  try {
    const response = await axios.get(
      `${URL}? key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}& per_page=${perPage}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
