import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    serviceWorker: {
      register: true
    },
    adapter: adapter()
  }
};

export default config;
