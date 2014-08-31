Polymer('bookmarks-app', {
  ready : function() {
    this.menu  = this.shadowRoot.querySelector('core-menu');
    this.pages = this.shadowRoot.querySelector('core-animated-pages');
    this.login = this.shadowRoot.querySelector('bookmarks-login');
    this.ajax  = this.shadowRoot.querySelector('core-ajax');

    this.user = {};
    this.user.token = this.getToken.call(this);

    this.currentPage = null;

    this.params = {
      routes : {
        'latest'      : 'bookmarks-list',
        'login'       : 'login',
        'categories'  : 'categories',
        ''            : 'bookmarks-list'
      }
    }

    this.addEvents.call(this);
  },
  addEvents : function() {
    var _this = this;

    this.menu.addEventListener('core-select', function(e){
      var pageId = e.detail.item.id;
      if (e.detail.isSelected)
        _this.changePage.call(_this, pageId);
    });

    this.login.addEventListener('submit-token', function(e){
      _this.testToken.call(_this, e.detail.token, function(){
        _this.changePage.call(_this, 'home');
      },
      function(){
        console.log('Token error');
      });
    });

    this.addEventListener('category-selected', function(e){
      var categoryName = e.detail.name;
      this.bookmarks = null;
      this.getCategory.call(this, categoryName);
      this.changePage.call(this, 'bookmarks-list', false, false);
      this.changeRoute.call(this, 'category/'+categoryName);
      this.menu.selected = null;
    });

    this.ajax.addEventListener('core-response', function(e){
      var response = e.detail.response;
      if (response.is_error) {
        console.log('Error');
        return;
      }

      var dataType = _this.ajax.getAttribute('data-type');

      switch (dataType) {
        case 'get-bookmarks':
          _this.bookmarks = response;
          break;
        case 'get-category':
          _this.bookmarks = response;
          break;
        case 'get-categories':
          _this.categories = response;
      }
    });
  },
  testToken : function(token, success, error) {
    this.setToken.call(this, token);
    success.call(this);
  },
  getToken : function() {
    var token = null;
    if (typeof localStorage!='undefined') {
      token = localStorage.getItem('token');
    }
    return token;
  },
  setToken : function(token) {
    this.user.token = e.detail.token;
    if (typeof localStorage!='undefined') {
      localStorage.setItem('token', token);
    }
  },
  changePage : function(pageId, changeRoute, loadData) {
    if (!this.user.token && pageId !== 'login') {
      pageId = 'login';
    }
    var tagetPage = this.shadowRoot.querySelector('section#' + pageId);
    if (tagetPage) {
      var indexPage = Array.prototype.indexOf.call(tagetPage.parentNode.children, tagetPage);
      this.pages.selected = indexPage;
    }
    var route = this.getRouteFromPageId.call(this, pageId);

    if (loadData !== false) {
      switch (pageId) {
        case 'bookmarks-list':
          this.bookmarks = null;
          this.getBookmarks.call(this);
          break;
        case 'categories':
          this.categories = null;
          this.getCategories.call(this);
      }
    }

    this.currentPage = pageId;
    if (changeRoute !== false) {
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

    if (newRoute.indexOf('category/') > -1)
      return;

    var pageId = this.params.routes[newRoute];
    if (!pageId) pageId = this.params.routes[''];
    this.menu.selected = pageId;
    if (this.currentPage !== pageId)
      this.changePage.call(this, pageId, false);
  },
  getBookmarks : function() {
    var params = {
      token : this.user.token
    };
    this.callAjax.call(this, 'http://devapi.saved.io/v1/bookmarks', 'get-bookmarks', params, 'json', 'GET');
  },
  getCategory : function(categoryName) {
    var params = {
      token : this.user.token
    };
    this.callAjax.call(this, 'http://devapi.saved.io/v1/bookmarks/' + categoryName, 'get-category', params, 'json', 'GET');
  },
  getCategories : function() {
    var params = {
      token : this.user.token
    };
    this.callAjax.call(this, 'http://devapi.saved.io/v1/lists', 'get-categories', params, 'json', 'GET');
  },
  callAjax : function(url, dataType, params, handleAs, method) {
    this.ajax.url = url;
    if (params)   this.ajax.params = params;
    if (dataType) this.ajax.setAttribute('data-type', dataType);
    if (handleAs) this.ajax.handleAs = handleAs;
    if (method)   this.ajax.method = method;
    this.ajax.go();
  }
});