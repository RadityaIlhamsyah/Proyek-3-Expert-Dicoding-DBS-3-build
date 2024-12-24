class LikeButtonPresenter {
  static async init({ likeButtonContainer, restaurant, favoriteRestaurants }) {
    this._likeButtonContainer = likeButtonContainer;
    this._restaurant = restaurant;
    this._favoriteRestaurants = favoriteRestaurants;

    await this._renderButton();
  }

  static async _renderButton() {
    const likeButtonContainer = this._likeButtonContainer;
    const restaurant = this._restaurant;
    const favoriteRestaurants = this._favoriteRestaurants;

    const existingRestaurant = await favoriteRestaurants.getRestaurant(restaurant.id);

    const button = likeButtonContainer.querySelector('#favoriteButton') || document.createElement('button');
    button.id = 'favoriteButton';
    likeButtonContainer.innerHTML = ''; // Clear container
    likeButtonContainer.appendChild(button);

    if (existingRestaurant) {
      this._renderLiked(button, restaurant, favoriteRestaurants);
    } else {
      this._renderLike(button, restaurant, favoriteRestaurants);
    }
  }

  static _renderLike(button, restaurant, favoriteRestaurants) {
    button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
    button.removeEventListener('click', this._handleClick); // Remove previous listeners

    this._handleClick = async () => {
      await favoriteRestaurants.putRestaurant(restaurant);
      await this._renderButton();
    };

    button.addEventListener('click', this._handleClick);
  }

  static _renderLiked(button, restaurant, favoriteRestaurants) {
    button.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
    button.removeEventListener('click', this._handleClick); // Remove previous listeners

    this._handleClick = async () => {
      await favoriteRestaurants.deleteRestaurant(restaurant.id);
      await this._renderButton();
    };

    button.addEventListener('click', this._handleClick);
  }
}

export default LikeButtonPresenter;
