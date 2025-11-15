// Router for SPA navigation
const Router = {
  routes: {},

  // Add route
  addRoute(path, handler) {
    this.routes[path] = handler;
  },

  // Navigate to route
  navigate(path) {
    window.location.hash = path;
  },

  // Handle route change
  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [route, ...params] = hash.split('/');

    const handler = this.routes[route];

    if (handler) {
      const container = document.getElementById('app-content');
      try {
        await handler(container, params);
      } catch (error) {
        console.error('Route handler error:', error);
        container.innerHTML = `
          <div class="container mt-5">
            <div class="alert alert-danger">
              <h4>Error</h4>
              <p>${error.message}</p>
            </div>
          </div>
        `;
      }
    } else {
      this.navigate('home');
    }
  },

  // Initialize router
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }
};

// Initialize router
Router.init();
