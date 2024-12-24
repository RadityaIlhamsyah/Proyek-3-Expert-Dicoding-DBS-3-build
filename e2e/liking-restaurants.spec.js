const assert = require('assert');
Feature('Liking Restaurants');

Scenario('should show the like button when the restaurant has not been liked before', async ({ I }) => {
  I.amOnPage('/'); // Menggunakan path relatif agar lebih dinamis.
  I.waitForElement('.restaurant-item__title a', 5); // Menunggu elemen muncul dengan timeout 5 detik.
  I.click(locate('.restaurant-item__title a').first());
  I.seeElement('#favoriteButton'); // Memastikan tombol like ada.
  I.see('Add to Favorites', '#favoriteButton');
});

Scenario('should be able to like the restaurant', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-item__title a', 5);
  const firstRestaurant = await I.grabTextFrom(locate('.restaurant-item__title a').first()); // Menggunakan await agar sinkron.

  I.click(locate('.restaurant-item__title a').first());
  I.seeElement('#favoriteButton');
  I.click('#favoriteButton'); // Melakukan like.

  I.wait(2); // Menunggu proses selesai.
  I.amOnPage('/#/favorite');
  I.waitForElement('.restaurant-item__title a', 5);

  const matchedRestaurant = await I.grabTextFrom(locate('.restaurant-item__title a').first());
  assert.strictEqual(firstRestaurant, matchedRestaurant); // Pencocokan nama restoran.
});

Scenario('should remove the restaurant from the favorites list', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-item__title a', 5);
  I.click(locate('.restaurant-item__title a').first());
  I.click('#favoriteButton'); // Melakukan like agar bisa di-unlike.

  I.amOnPage('/#/favorite');
  I.waitForElement('.restaurant-item__title a', 5);
  I.click(locate('.restaurant-item__title a').first());
  I.click('#favoriteButton'); // Melakukan unlike.

  I.amOnPage('/#/favorite');
  I.see("You haven't added any restaurants to your favorites yet.", '.restaurants-empty'); // Memastikan kosong.
});
