Polymer('bookmarks-app', {
  ready : function() {
    this.menu  = this.shadowRoot.querySelector('core-menu');
    this.pages = this.shadowRoot.querySelector('core-animated-pages');
    this.login = this.shadowRoot.querySelector('bookmarks-login');

    this.params = {
      routes : {
        'latest'      : 'latest',
        'login'       : 'login',
        'categories'  : 'categories',
        ''            : 'latest'
      }
    }

    this.addEvents.call(this);
    this.login.init();
  },
  addEvents : function() {
    var _this = this;

    this.menu.addEventListener('core-select', function(e){
      var pageId = e.detail.item.id;
      _this.changePage.call(_this, pageId);
    });

    this.login.addEventListener('logged', function(e){
      _this.user = {
        token : e.detail.token
      };

      _this.changePage.call(_this, 'home');
    });
  },
  changePage : function(pageId, changeRoute) {
    var tagetPage = this.shadowRoot.querySelector('section#' + pageId);
    if (tagetPage) {
      var indexPage = Array.prototype.indexOf.call(tagetPage.parentNode.children, tagetPage);
      this.pages.selected = indexPage;
    }
    if (changeRoute !== false) {
      var route = this.getRouteFromPageId.call(this, pageId);
      this.changeRoute.call(this, route);
    }
  },
  getRouteFromPageId : function(pageId) {
    var route = null;
    for (var r in this.params.routes) {
      if (this.params.routes[r] === pageId) {
        route = r;
        break;
      }
    }
    if (!route) route = '';
    return route;
  },
  changeRoute : function(route) {
    this.route = route;
  },
  routeChanged : function(oldRoute, newRoute) {
    var pageId = this.params.routes[newRoute];
    if (!pageId) pageId = this.params.routes[''];
    this.menu.selected = pageId;
    this.changePage.call(this, pageId, false);
  }
});