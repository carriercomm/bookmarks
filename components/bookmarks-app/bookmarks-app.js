Polymer('bookmarks-app', {
  ready : function() {
    this.menu        = this.shadowRoot.querySelector('core-menu');
    this.pages       = this.shadowRoot.querySelector('core-animated-pages');
    this.mainContent = this.shadowRoot.querySelector('core-scaffold::shadow core-header-panel[main]');

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

    this.mainContent.addEventListener('scroll', function(e){
      if (e.detail && e.detail.target) {
        var scroll = (e.detail.target.clientHeight + e.detail.target.scrollTop) / e.detail.target.scrollHeight;
        if (scroll > 0.9 && _this.bookmarksCollection) {
          _this.loadBookmarks();
        }
      }
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
          this.bookmarksLimit = 0;
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
      if (results) {
        _this.loadBookmarks(results[0]);
      }
    });
  },
  loadBookmarks : function(results) {
    if (!this.bookmarksCollection) {
      var data = this.extractBookmarks(results);
      this.bookmarksCollection  = data.bookmarks;
      this.categoriesCollection = data.categories;
    }
    this.bookmarksLimit += 20;
    this.bookmarks = this.bookmarksCollection.slice(0, this.bookmarksLimit);
  },
  extractBookmarks : function(group, bookmarks, categories) {
    if (!bookmarks)  bookmarks = [];
    if (!categories) categories = [];
    var currentCategories = {
      title : group.title,
      children : []
    };
    if (group.children) {
      for (var i = 0, len = group.children.length; i < len; i++) {
        var element = group.children[i];
        if (element.url) {
          bookmarks.push(element);
        } else if (element.children) {
          var subData = this.extractBookmarks(element, bookmarks, []);
          bookmarks = subData.bookmarks;
          currentCategories.children.push(subData.categories);
        }
      }
    }
    categories = currentCategories;
    return {
      bookmarks : bookmarks,
      categories : categories
    };
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