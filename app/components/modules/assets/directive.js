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
            var input = element.find('input');
            window.assetEditor.chooseImage(input).done(function(path){
                input.val(path);
                input.change();
            });
        },
        template:'<div class="form-group"><input  ng-model="srcUrlVar" class="form-control" type="text"></div>',
        replace:true,
        transclude:true
    };
});
