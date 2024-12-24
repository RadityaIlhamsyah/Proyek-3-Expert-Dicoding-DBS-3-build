import LikeButtonPresenter from '../../scripts/views/like-button-presenter';
import FavoriteRestaurantIdb from '../../scripts/data/favorite-restaurant-idb';

const TestFactories = {
  async createLikeButtonPresenterWithRestaurant({ id }) {
    await LikeButtonPresenter.init({
      likeButtonContainer: document.querySelector('#likeButtonContainer'),
      restaurant: { id },
      favoriteRestaurants: FavoriteRestaurantIdb,
    });
  },
};

export default TestFactories;
