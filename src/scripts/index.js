import 'regenerator-runtime'; // Mendukung async/await
import 'lazysizes'; // Optimisasi gambar lazy loading
import '../styles/main.scss';
import '../styles/responsive.scss';
import App from './views/app';
import swRegister from './utils/sw-register';
import UrlParser from './utils/url-parser';
import routes from './routes/routes';

// Lazy load halaman berdasarkan rute
const loadPage = async (url) => {
  try {
    const parsedUrl = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[parsedUrl];

    if (!page) {
      console.error('Page not found for URL:', parsedUrl);
      return routes['/'];
    }

    return page;
  } catch (error) {
    console.error('Error loading page:', error);
    return routes['/'];
  }
};

// Inisialisasi aplikasi
const app = new App({
  button: document.querySelector('#hamburgerButton'),
  drawer: document.querySelector('#navigationDrawer'),
  content: document.querySelector('#mainContent'),
});

// Event listener untuk perubahan hash
const handleRouteChange = async () => {
  const loadedPage = await loadPage(window.location.hash);
  app.setPage(loadedPage);
  await app.renderPage();
};

// Event listener untuk perubahan hash
window.addEventListener('hashchange', handleRouteChange);

// Event listener untuk load pertama kali
window.addEventListener('load', async () => {
  await handleRouteChange();
  await swRegister(); // Daftarkan service worker
});
