Polymer('bookmarks-app', {
  ready : function() {
    this.pages    = this.shadowRoot.querySelector('core-animated-pages');
    this.appPages = this.shadowRoot.querySelector('bookmarks-pages');
    this.login    = this.shadowRoot.querySelector('bookmarks-login');
    this.ajax     = this.shadowRoot.querySelector('core-ajax');

    this.user = {};
    this.user.token = this.getToken.call(this);

    if (!this.user.token) pageId = 'login';
    else                  pageId = 'pages';

    this.changePage.call(this, pageId);

    this.addEvents.call(this);
  },
  addEvents : function() {
    var _this = this;

    this.login.addEventListener('submit-token', function(e){
      _this.testToken.call(_this, e.detail.token, function(){
        _this.appPages.fire('load');
        _this.changePage.call(_this, 'pages');
      },
      function(){
        console.log('Token error');
      });
    });
  },
  changePage : function(pageId, changeRoute, loadData) {
    var tagetPage = this.shadowRoot.querySelector('section#' + pageId);
    if (tagetPage) {
      var indexPage = Array.prototype.indexOf.call(tagetPage.parentNode.children, tagetPage);
      this.pages.selected = indexPage;
    }
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
    this.user.token = token;
    if (typeof localStorage!='undefined') {
      localStorage.setItem('token', token);
    }
  }
});