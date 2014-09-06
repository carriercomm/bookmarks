Polymer('bookmarks-app', {
  ready : function() {
    this.menu  = this.shadowRoot.querySelector('core-menu');
    this.pages = this.shadowRoot.querySelector('core-animated-pages');

    this.currentPage = null;
    this.bookmarks = [];

    this.addEvents();

    this.changePage('bookmarks-list');
  },
  addEvents : function() {

    var _this = this;

    this.addEventListener('load', function(){
      _this.changePage(_this.currentPage);
    });

    this.menu.addEventListener('core-select', function(e){
      var pageId = e.detail.item.id;
      if (e.detail.isSelected)
        _this.changePage(pageId);
    });

    this.addEventListener('category-selected', function(e){
      var categoryName = e.detail.name;
      this.bookmarks = null;
      this.getCategory(categoryName);
      this.changePage('bookmarks-list', false);
      this.menu.selected = null;
    });

    /*this.ajax.addEventListener('core-response', function(e){
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
    });*/
  },
  changePage : function(pageId, loadData) {
    var tagetPage = this.shadowRoot.querySelector('section#' + pageId);
    if (tagetPage) {
      var indexPage = Array.prototype.indexOf.call(tagetPage.parentNode.children, tagetPage);
      this.pages.selected = indexPage;
    }

    if (loadData !== false) {
      switch (pageId) {
        case 'bookmarks-list':
          this.bookmarks = null;
          this.getBookmarks();
          break;
        case 'categories':
          this.categories = null;
          this.getCategories();
      }
    }

    this.currentPage = pageId;
  },
  getBookmarks : function() {
    var _this = this;
    chrome.bookmarks.getTree(function(results){
      _this.loadBookmarks(results);
    });
  },
  loadBookmarks : function(results) {
    var bookmarks = this.extractBookmarks(results);
    this.bookmarks = bookmarks.slice(0, 20);
  },
  extractBookmarks : function(group, array) {
    if (!array) array = [];
    for (var i = 0, len = group.length; i < len; i++) {
      var element = group[i];
      if (element.url) {
        array.push(element);
      } else if (element.children) {
        array = this.extractBookmarks(element.children, array);
      }
    }
    return array;
  },
  getCategory : function(categoryName) {
    /*var params = {
      token : this.user.token
    };
    this.callAjax.call(this, 'http://devapi.saved.io/v1/bookmarks/' + categoryName, 'get-category', params, 'json', 'GET');*/
  },
  getCategories : function() {
    /*var params = {
      token : this.user.token
    };
    this.callAjax.call(this, 'http://devapi.saved.io/v1/lists', 'get-categories', params, 'json', 'GET');*/
  }
});