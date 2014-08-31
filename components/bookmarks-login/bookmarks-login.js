Polymer('bookmarks-login', {
  ready : function() {

    var _this = this;

    this.tokenInput   = this.shadowRoot.getElementById('token');
    this.submitButton = this.shadowRoot.getElementById('submit');

    this.submitButton.addEventListener('click', function(){
      var token = _this.tokenInput.value;
      _this.fire('submit-token', {
        token : token
      });
    });
  }
});