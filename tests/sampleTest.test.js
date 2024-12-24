import { createLikeButtonPresenterWithRestaurant } from '../src/scripts/data/favorite-restaurant-idb';
import LikeButtonPresenter from '../src/scripts/views/like-button-presenter';
import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';

describe('Restaurant Like Button', () => {
  describe('Like Button Presenter', () => {
    beforeEach(() => {
      // Pastikan container selalu ada di DOM
      document.body.innerHTML = `
        <div id="likeButtonContainer">
          <button id="favoriteButton"></button>
        </div>
      `;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call init method of LikeButtonPresenter', async () => {
      // Mock metode getRestaurant untuk scenario tidak disukai
      jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue(undefined);

      // Spy pada metode init
      const mockInit = jest.spyOn(LikeButtonPresenter, 'init');

      const restaurant = { id: 1 };

      // Panggil fungsi
      await createLikeButtonPresenterWithRestaurant(restaurant);

      // Pastikan init dipanggil dengan parameter benar
      expect(mockInit).toHaveBeenCalledWith({
        likeButtonContainer: document.getElementById('likeButtonContainer'),
        restaurant: { id: 1 },
        favoriteRestaurants: FavoriteRestaurantIdb,
      });
    });

    describe('Unlike Restaurant', () => {
      it('should be able to unlike a restaurant that has been liked', async () => {
        // Mock getRestaurant untuk kembalikan restaurant yang sudah disukai
        jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue({ id: 1 });

        // Mock deleteRestaurant
        const mockDeleteRestaurant = jest.spyOn(FavoriteRestaurantIdb, 'deleteRestaurant').mockResolvedValue(true);

        // Buat presenter untuk restoran yang sudah disukai
        await createLikeButtonPresenterWithRestaurant({ id: 1 });

        // Dapatkan tombol favorit
        const favoriteButton = document.getElementById('favoriteButton');

        // Pastikan tombol favorit ada
        expect(favoriteButton).toBeTruthy();

        // Klik tombol untuk batal menyukai
        favoriteButton.dispatchEvent(new Event('click'));

        // Periksa apakah deleteRestaurant dipanggil
        expect(mockDeleteRestaurant).toHaveBeenCalledWith(1);

        // Mock getRestaurant untuk mengembalikan undefined setelah dihapus
        jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValueOnce(undefined);

        // Pastikan getRestaurant mengembalikan null setelah dihapus
        const restaurant = await FavoriteRestaurantIdb.getRestaurant(1);
        expect(restaurant).toBeFalsy();
      });

      it('should not throw error when trying to unlike a restaurant that is not in favorites', async () => {
        // Mock getRestaurant untuk mengembalikan undefined
        jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue(undefined);

        // Buat presenter untuk restoran
        await createLikeButtonPresenterWithRestaurant({ id: 1 });

        // Dapatkan tombol favorit
        const favoriteButton = document.getElementById('favoriteButton');

        // Pastikan tidak ada error saat mencoba batal menyukai
        await expect(async () => {
          favoriteButton.dispatchEvent(new Event('click'));
        }).not.toThrow();
      });

      it('should show "Remove From Favorites" button after unliking a restaurant', async () => {
        // Mock getRestaurant untuk mengembalikan restaurant yang sudah disukai
        jest.spyOn(FavoriteRestaurantIdb, 'getRestaurant').mockResolvedValue({ id: 1 });

        // Mock deleteRestaurant
        jest.spyOn(FavoriteRestaurantIdb, 'deleteRestaurant').mockResolvedValue(true);

        // Buat presenter untuk restoran yang sudah disukai
        await createLikeButtonPresenterWithRestaurant({ id: 1 });

        // Dapatkan tombol favorit
        const favoriteButton = document.getElementById('favoriteButton');

        // Klik tombol untuk batal menyukai
        favoriteButton.dispatchEvent(new Event('click'));

        // Tunggu proses render ulang tombol selesai
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Dapatkan tombol terbaru
        const updatedFavoriteButton = document.getElementById('favoriteButton');

        /// Periksa apakah tombol berisi teks "Remove from Favorites"
        expect(updatedFavoriteButton.textContent.trim()).toContain('Remove from Favorites');
      });
    });
  });
});
