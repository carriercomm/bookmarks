Polymer('bookmarks-list', {
  ready : function() {
    var _this = this;
    this.ajax = this.shadowRoot.querySelector('core-ajax');

    this.ajax.addEventListener('core-response', function(e){
      var response = e.detail.response;
      if (response.is_error) {
        console.log('Error');
        return;
      }
      _this.bookmarks = response;
    });
  },
  getBookmarks : function() {
    this.ajax.url = 'http://devapi.saved.io/v1/bookmarks';
    this.ajax.params = {
      token : this.token
    };
    this.ajax.handleAs = 'json';
    this.ajax.method = 'GET';
    this.ajax.go();
  },
  tokenChanged : function(oldToken, newToken){
    if (newToken) {
      this.getBookmarks.call(this);
    }
  }
});