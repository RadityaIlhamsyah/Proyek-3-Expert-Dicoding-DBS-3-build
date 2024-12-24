// tests/restaurant-like-button.js
import { createLikeButtonPresenterWithRestaurant } from '../src/scripts/data/favorite-restaurant-idb';
import LikeButtonPresenter from '../src/scripts/views/like-button-presenter';
import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';

describe('Restaurant Like Button', () => {
  // Test for Like Button Presenter
  describe('Like Button Presenter', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="likeButtonContainer"></div>';
    });

    it('should call init method of LikeButtonPresenter', async () => {
      // Mock the init method to track if it's called
      const mockInit = jest.spyOn(LikeButtonPresenter, 'init').mockImplementation(() => {});

      // Mock FavoriteRestaurantIdb.getRestaurant to return a mock restaurant
      jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue({ id: 1 });

      // Create the LikeButtonPresenter with mock data
      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      // Check if init was called with the expected arguments
      expect(mockInit).toHaveBeenCalledWith({
        likeButtonContainer: expect.any(HTMLDivElement),
        restaurant: { id: 1 },
        favoriteRestaurants: FavoriteRestaurantIdb,
      });
    });

    it('should render the button correctly when not liked', async () => {
      // Mock to simulate that the restaurant is not in the favorites
      jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue(undefined);

      // Create LikeButtonPresenter and check if it renders the "Add to Favorites" button
      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      const favoriteButton = document.getElementById('favoriteButton');
      expect(favoriteButton).toBeTruthy();
      expect(favoriteButton.innerHTML).toContain('Add to Favorites');
    });

    it('should render the button correctly when liked', async () => {
      // Mock to simulate that the restaurant is in the favorites
      jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue({ id: 1 });

      // Create LikeButtonPresenter and check if it renders the "Remove from Favorites" button
      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      const favoriteButton = document.getElementById('favoriteButton');
      expect(favoriteButton).toBeTruthy();
      expect(favoriteButton.innerHTML).toContain('Remove from Favorites');
    });
  });

  // Test for Unlike Functionality
  describe('Unlike Restaurant', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="likeButtonContainer"></div>';
    });

    it('should be able to unlike a restaurant that has been liked', async () => {
      // Simulate restaurant is already liked
      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      // Get the favorite button
      const favoriteButton = document.getElementById('favoriteButton');

      // Click the button to unlike
      favoriteButton.dispatchEvent(new Event('click'));

      // Check if restaurant is removed from favorites
      const restaurant = await FavoriteRestaurantIdb.getRestaurant(1);
      expect(restaurant).toBeFalsy();
    });

    it('should not throw error when trying to unlike a restaurant that is not in favorites', async () => {
      // Simulate restaurant is not in favorites
      jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue(undefined);

      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      const favoriteButton = document.getElementById('favoriteButton');

      // Ensure no error is thrown when trying to unlike
      await expect(async () => {
        favoriteButton.dispatchEvent(new Event('click'));
      }).not.toThrow();
    });

    it('should show "Add to Favorites" button after unliking a restaurant', async () => {
      // Simulate restaurant is already liked
      await createLikeButtonPresenterWithRestaurant({ id: 1 });

      const favoriteButton = document.getElementById('favoriteButton');

      // Click the button to unlike
      favoriteButton.dispatchEvent(new Event('click'));

      // Wait for button re-render
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Check if button changes to "Add to Favorites"
      const updatedFavoriteButton = document.getElementById('favoriteButton');
      expect(updatedFavoriteButton.innerHTML).toContain('Add to Favorites');
    });
  });
});
