Polymer('bookmarks-login', {
  ready : function() {

    var _this = this;

    this.tokenInput   = this.shadowRoot.getElementById('token');
    this.submitButton = this.shadowRoot.getElementById('submit');

    this.addEventListener('init', function(){
      _this.init.call(_this);
    })
  },
  init : function() {
    var _this = this;
    var token = this.getToken.call();

    if (token) {

      this.testToken.call(this, token);

    } else {
      
      this.submitButton.addEventListener('click', function(){
        var token = _this.tokenInput.value;
        _this.testToken.call(_this, token);
      });

      this.displayForm = true;

    }
  },
  testToken : function(token) {
    this.setToken.call(this, token);
    this.fire('logged', {
      token : token
    });
  },
  getToken : function() {
    var token = null;
    if (typeof localStorage!='undefined') {
      token = localStorage.getItem('token');
    }
    return token;
  },
  setToken : function(token) {
    if (typeof localStorage!='undefined') {
      localStorage.setItem('token', token);
    }
  }
});