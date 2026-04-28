// ================================================================
// router.js — Hash-Based SPA Router
// ================================================================
// FitTrack is a Single Page Application (SPA): the browser loads
// index.html ONCE and then dynamically swaps the content area
// without reloading the page.
//
// Navigation works via URL hash (#):
//   http://localhost:3000/#dashboard   → shows the dashboard
//   http://localhost:3000/#workouts    → shows the workouts page
//
// WHY hash routing? Because the hash part of the URL is handled
// entirely by the browser — the server doesn't see it, so no special
// server config is needed. Every link is just an <a href="#page">.
//
// ADDING A NEW PAGE:
//   1. Call Router.addRoute('my-page', handlerFunction) in app.js or pages.js
//   2. Add <a href="#my-page"> somewhere in the navbar (index.html)
//   That's it — the router handles the rest.
// ================================================================

const Router = {
  // Stores all registered routes as { routeName: handlerFunction }
  routes: {},

  // Register a new page route
  // path:    the hash name, e.g. 'dashboard' (without the #)
  // handler: async function(container, params) { ... }
  addRoute(path, handler) {
    this.routes[path] = handler;
  },

  // Programmatically navigate to a route
  navigate(path) {
    window.location.hash = path;
  },

  // Called every time the URL hash changes
  async handleRoute() {
    // window.location.hash is '#dashboard' — slice(1) removes the '#'
    const hash = window.location.hash.slice(1) || 'home';

    // Support sub-routes like #admin/USER_ID → route='admin', params=['USER_ID']
    const [route, ...params] = hash.split('/');

    const handler = this.routes[route];

    if (handler) {
      // The handler receives the <div id="app-content"> element so it can
      // render HTML into it directly (no framework needed)
      const container = document.getElementById('app-content');
      try {
        await handler(container, params);
      } catch (error) {
        console.error('[Router] Route handler error for route:', route, error);
        container.innerHTML = `
          <div class="container mt-5">
            <div class="alert alert-danger">
              <h4>Error loading page</h4>
              <p>${error.message}</p>
            </div>
          </div>
        `;
      }
    } else {
      // Unknown route — redirect to home rather than showing a blank page
      this.navigate('home');
    }
  },

  // Set up the event listeners that trigger route changes
  init() {
    // hashchange fires whenever the user clicks a link or calls navigate()
    window.addEventListener('hashchange', () => this.handleRoute());
    // load fires on the initial page load so the correct page shows immediately
    window.addEventListener('load', () => this.handleRoute());
  }
};

// Start the router immediately when this script loads
Router.init();
