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
          _this.displayBookmarks();
        }
      }
    });

    this.mainContent.addEventListener('category-selected', function(e){
      if (e.detail.id) {
        _this.getCategory(e.detail.id);
      }
    });
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
          this.getCategory(0);
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
  displayBookmarks : function(results) {
    this.bookmarksLimit += 20;
    this.bookmarks = this.bookmarksCollection.slice(0, this.bookmarksLimit);
  },
  loadBookmarks : function(results) {
    if (!this.bookmarksCollection) {
      var data = this.extractBookmarks(results);
      this.bookmarksCollection  = data.bookmarks;
      this.categoriesCollection = data.categories;
    }
    this.displayBookmarks();
  },
  extractBookmarks : function(group, bookmarks, categories) {
    if (!bookmarks)  bookmarks = [];
    if (!categories) categories = [];
    var currentCategories = {
      id       : group.id,
      title    : group.title,
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
  getCategory : function(id) {
    var _this = this;
    chrome.bookmarks.getChildren(id.toString(), function(results){
      if (results) {
        _this.loadCategories(results);
      }
    });
  },
  loadCategories : function(list) {
    this.categories = list;
  }
});