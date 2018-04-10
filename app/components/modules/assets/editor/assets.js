(function () {
    function AssetEditor() {
        this.shortCuts = true;
    }
    AssetEditor.prototype.enableShortCuts = function(){
        this.shortCuts = true;
    };
    AssetEditor.prototype.disableShortCuts = function(){
        this.shortCuts = false;
    };
    //input must be inside a div <div class="form-group">
    AssetEditor.prototype.chooseImage = function(input){
        var deferred = $.Deferred();
        var span =  jQuery('<span class="input-group-btn"></span>');
        var button = jQuery('<button class="btn btn-default  fa fa-image fileBrowser"></button>');
        span.append(button);
        jQuery(input).parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").append(span);
        jQuery(button).unbind('click').bind('click',function(e){
            e.preventDefault();
            window.assetEditor.browseFiles(function(path){
                deferred.resolve(path);
            });
        });
        return deferred.promise();
    };

    AssetEditor.prototype.chooseFolder = function(input){
        var deferred = $.Deferred();
        var span =  jQuery('<span class="input-group-btn"></span>');
        var button = jQuery('<button class="btn btn-default btn-sm fa fa-image fileBrowser"></button>');
        span.append(button);
        jQuery(input).parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").append(span);
        jQuery(button).unbind('click').bind('click',function(e){
            e.preventDefault();
            window.assetEditor.browseFolders().done(function(path){
                deferred.resolve(path);
            });
        });
        return deferred.promise();
    };



    AssetEditor.prototype.browse = function () {
        var that = this;
        var editor = $('<div class="browser"></div>');
        that.init(editor);
        var deferred = $.Deferred();
        bootbox.dialog({
                title: "File Manager",
                message: editor,
                size: 'large',
                className: 'asset-browse',
                onEscape: function (result) {
                },
                buttons: {
                    success: {
                        label: "Choose",
                        className: "btn-success",
                        callback: function () {
                            deferred.resolve(that);
                        }
                    }
                }
            }
        );
        return deferred.promise();
    };
    AssetEditor.prototype.browseFolders = function () {
        var deferred = $.Deferred();
        this.browse().done(function(){
             deferred.resolve($('#dir').html());
        });
        return deferred.promise();
    };
    AssetEditor.prototype.browseFiles = function (cb) {
         this.browse().done(function(){
             if(cb){
                 //cb('assets/get?file=' + $('#dir').html());
                 cb('assets/' + $('#dir').html());
             }
         });
    };
    AssetEditor.prototype.refreshFileTreeContextMenu=function(){
        var self = this;
        jQuery.contextMenu({
            selector: ".directory",
            callback: function(key, options) {
                var item = $(this).find(">:first-child");
                var rel = item.attr('rel');
                switch(key){
                    case 'newfolder':
                        self.newFolder(rel,function(){
                            item.click();
                        });
                        break;
                    case 'deleteFolder':

                        bootbox.confirm({
                            title:"Delete Folder",
                            width: "200px",
                            message: "Are you sure you want to delete this folder ?",
                            buttons: {
                                confirm: {
                                    label: 'Yes',
                                    className: 'btn-warning'
                                },
                                cancel: {
                                    label: 'No',
                                    className: 'btn-success'
                                }
                            },
                            callback: function (result) {
                                 if(result){
                                     var api = new RestCollection(self.getBaseUrl() + 'assets');
                                     api.call('remove?file='+ rel ,'','post',function(data){
                                         item.parent().remove();
                                     });
                                 }
                            }
                        });

                        break;
                    case 'permissions':
                         alert("Show Permissions Dialog");
                        break;
                    default:
                        var m = "clicked: " + key + " on " + db + "-" + collection;
                        window.console && console.log(m) || alert(m);
                }
            },
            items: {
                permissions: {name: "Permissions", icon:'fa-lock'},
                newfolder: {name: "New Folder", icon:'fa-folder'},
                deleteFolder: {name: "Delete Folder",icon:'fa-remove'}

            }
        });
        jQuery.contextMenu({
            selector: ".file",
            callback: function(key, options) {
                var item = $(this).find(">:first-child");
                var rel = item.attr('rel');
                switch(key){

                    case 'deleteFile':
                        var api = new RestCollection(self.getBaseUrl() + 'assets');
                        api.call('remove?file='+ rel ,'','post',function(data){
                            item.parent().remove();
                        });
                        break;
                    default:
                        var m = "clicked: " + key + " on " + db + "-" + collection;
                        window.console && console.log(m) || alert(m);
                }
            },
            items: {
                deleteFile: {name: "Delete File",icon:'fa-remove'}
            }
        });
    };

    AssetEditor.prototype.refreshTree = function () {
        var that = this;
        var fileTree =$('#file-tree-holder');
        fileTree.html('');
        fileTree.html('<div id="jsfiletree" ></div>');
        $('#jsfiletree').fileTree({
            root:'',
            script: that.getBaseUrl() + 'assets/filetree'
        },function(file) {
            $('#fileDetail').html('<img  class="image-detail" src="' + that.getBaseUrl() + "assets/get?file=" + file + '"></img>');
            $('.image-detail').css('width',450);
        }).on('filetreeclicked', function(e, data) {
            $('#dir').html(data.rel);
        }).on('filetreeexpand filetreecollapse',function(e, data) {
            $('#dir').html(data.rel);
            $('#fileDetail').html('<input id="upload-files" name="file" multiple type="file" class="file file-loading" >');
            $("#upload-files").fileinput({
                uploadUrl:  that.getBaseUrl() + 'assets/multi_upload',
                uploadExtraData: function (previewId, index) {
                    return {"dir":data.rel};
                }
            });
        }).on('filebatchuploadcomplete', function(event, files, extra) {
            that.refreshTree();
        });

        that.resize();
        that.refreshFileTreeContextMenu();
    };

    AssetEditor.prototype.getBaseUrl = function(){
        if(!base_url){base_url = '../';}
        return base_url;
    };
    AssetEditor.prototype.newFolder = function (rel,cb) {
        var that = this;
        bootbox.dialog({
                title: "New Folder",
                message:
                '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-2 control-label" for="propPageName">Name</label> ' +
                '<div class="col-md-8"> ' +
                '<input id="propFolderName" name="propFolderName" type="text" placeholder="New Folder Name" class="form-control input-md"> ' +
                '</div>' +
                '</div>' +
                '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Save",
                        size: 'large',
                        className: "btn-default",
                        callback: function () {
                            var newDirName = rel + $('#propFolderName').val() ;
                            var api = new RestCollection(that.getBaseUrl() + 'assets');
                            api.call('mkdirs',{'dir':newDirName},'post',function(){
                                  if(cb){
                                     cb();
                                  }
                            });
                        }
                    }
                }
            }
        );
    };
    AssetEditor.prototype.init = function (element) {
        var that = this;
        $(element).load("modules/assets/editor/asset_editor.html", function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success"){
                    that.refreshTree();
            }else if(statusTxt == "error"){
                console.log("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
        jQuery(window).resize(function() {
            that.resize();
        });
        that.resize();
    };
    AssetEditor.prototype.resize = function(){
        var newHeight =  jQuery(window).height() - 90;
        jQuery('#file-tree-holder').css('height', newHeight);
        jQuery('#main-file-content').css('min-height', newHeight-120);

    };

    window.assetEditor = new AssetEditor();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.assetEditor );
})(jQuery);