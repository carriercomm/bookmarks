Polymer('bookmarks-card', {
  ready : function() {
    if (this.bookmark.list_name)
      this.bookmark.list_name = this.bookmark.list_name.replace(/ /g, ' #');
  }
});