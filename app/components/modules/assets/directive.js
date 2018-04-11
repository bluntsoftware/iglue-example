var angularAssetEditor = function($timeout) {
    return {
        restrict: "E",
        replace: true,
        transclude: false,
        controller: function ($scope,$element, $attrs ,$transclude ) {
            angular.element(document).ready(function() {
                $timeout(function(){
                    window.assetEditor.init($element);
                    return function (scope, element, attrs, controller) {

                    }
                });
            });
        }
    }
};
catwalkApp.directive('imageUrl', function() {
    return {

        restrict: 'E',
        scope:{
            srcUrlVar:'='
        },
        link: function (scope, element, attrs, ngModel) {
            var base_path = '';
            if(attrs.basePath){
                base_path =  attrs.basePath;
            }
            window.assetEditor.chooseImage(element).done(function(path){
                element.val(base_path + path);
                element.change();
            });
        },
        template:'<input  class="form-control" type="text">',
        replace:true,
        transclude:true
    };
});
