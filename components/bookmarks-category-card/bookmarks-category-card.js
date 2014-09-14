Polymer('bookmarks-category-card', {
  ready : function() {
    var _this = this;

    this.categoryLink = this.shadowRoot.querySelector('a');
    this.categoryLink.addEventListener('click', function(e){
      e.preventDefault();
      _this.fire('category-selected', {
        id : _this.category.id
      })
    });
  }
});