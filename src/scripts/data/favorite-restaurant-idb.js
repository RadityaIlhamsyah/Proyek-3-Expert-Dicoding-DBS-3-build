/* eslint-disable linebreak-style */
import { openDB } from 'idb';
import CONFIG from '../globals/config';
import LikeButtonPresenter from '../views/like-button-presenter';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const FavoriteRestaurantIdb = {
  async getRestaurant(id) {
    if (!id) return null;
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllRestaurants() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putRestaurant(restaurant) {
    if (!restaurant.id) return null;
    return (await dbPromise).put(OBJECT_STORE_NAME, restaurant);
  },

  async deleteRestaurant(id) {
    if (!id) return null;
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export const createLikeButtonPresenterWithRestaurant = async (restaurant) => {
  const likeButtonContainer = document.getElementById('likeButtonContainer');
  await LikeButtonPresenter.init({
    likeButtonContainer,
    restaurant,
    favoriteRestaurants: FavoriteRestaurantIdb,
  });
};

export default FavoriteRestaurantIdb;
