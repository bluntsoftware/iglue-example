(function () {
    var AssetService =  RestCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + 'assets');
        }
    });
    window.assetService = new AssetService();
})(jQuery);