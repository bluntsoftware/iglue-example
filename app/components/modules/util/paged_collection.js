var PagedCollection =  RestCollection.extend({
    init:function(url) {
        this._super(url);
        this.page = 1;
        this.rows = 20;
        this.sord = 'ASC';
        this.sidx = 'id';
        this.criteria = {};
        this.projection = {};
        this.totalpages = 0;
        this.totalrecords = 0;
        this.or = false;
    },
    setRows:function(rows){
        this.rows = rows;
        return this;
    },
    setPage:function(page){
        var totalPages = Number(this.totalpages);
        var pageNumber = Number(page);
        if(pageNumber > totalPages){ pageNumber = totalPages;}
        if(pageNumber < 1){ pageNumber =1;}
        this.page = Number(pageNumber);
        return this;
    },
    nextPage:function(){
        return this.setPage(Number(this.page)+1);
    },
    previousPage:function(){
        return this.setPage(Number(this.page)-1);
    },
    addColumn:function(field){
       this.projection[field] = 1;
        return this;
    },
    find:function(cb){
        var that = this;
        var or = this.criteria['$or'];
        if(or){
            var and = this.criteria['$and'];
            if(!and){
                and = [];
            }
            and.push({'$or':or});
            this.criteria = {'$and':and};
        }
        var criteria = this.criteria;
        var data = {
            page:this.page,
            rows:this.rows,
            sord:this.sord,
            sidx:this.sidx,
            or:this.or,
            filterByFields: JSON.stringify(criteria),
            projection:JSON.stringify(this.projection)
        };

        return this._super(data,function(data){
            that.totalpages = data.totalpages;
            that.totalrecords = data.totalrecords;
            if(cb){
                cb(data);
            }
        });
    },
    toggleSort:function(){
      if(this.sord === 'ASC'){
          this.sord =  'DESC';
      } else{
          this.sord =  'ASC';
      }
        return this;
    },
    ascending:function(){
         this.sord = 'ASC';
        return this;
    },
    descending:function(){
        this.sord = 'DESC';
        return this;
    },
    orMode:function(){
        this.or = true;
        return this;
    },

    qry:function(){
        this.criteria = {};
        this.projection = {};
        this.or = false;
        return this;
    },
    rowS:function(rows){
      this.rows = rows;
      return this;
    },
    sidX:function(id){
        this.sidx = id;
        return this;
    },
    //{'name':{'$regex' :  val, '$options' : 'i'}}
    add:function(searchField,searchOper,searchString){
        var condition = {}, criteria = {};
        if(searchOper === 'icn'){
            condition = {'$regex':searchString,'$options':'i'};
        }else{
            condition['$' + searchOper] = searchString;
        }
        criteria[searchField] = condition;

         var and = this.criteria['$and'];
         if(!and){
             and = [];
         }
         and.push(criteria);
        this.criteria['$and'] = and;
        //this.criteria = $.extend(this.criteria,{'$and':criteria});
        return this;
    },
    addOr:function(searchField,searchOper,searchString){
        var condition = {}, criteria = {};
        if(searchOper === 'icn'){
            condition = {'$regex':searchString,'$options':'i'};
        }else{
            condition['$' + searchOper] = searchString;
        }
        criteria[searchField] = condition;
        var or = this.criteria['$or'];
        if(!or){
            or = [];
        }
        or.push(criteria);
        this.criteria['$or'] = or;
        return this;
    },
    cn:function(field,value){
         return this.add(field,'cn',value);
    },
    icn:function(field,value){
        return this.add(field,'icn',value);
    },
    bw:function(field,value){
        return this.add(field,'bw',value);
    },
    ew:function(field,value){
        return this.add(field,'ew',value);
    },
    eq:function(field,value){
        return this.add(field,'eq',value);
    },
    ne:function(field,value){
        return this.add(field,'ne',value);
    },
    nc:function(field,value){
        return this.add(field,'nc',value);
    },
    en:function(field,value){
        return this.add(field,'en',value);
    },
    bn:function(field,value){
        return this.add(field,'bn',value);
    },
    gt:function(field,value){
        return this.add(field,'gt',value);
    },
    ge:function(field,value){
        return this.add(field,'ge',value);
    },
    lt:function(field,value){
        return this.add(field,'lt',value);
    },
    le:function(field,value){
        return this.add(field,'le',value);
    },
    in:function(field,value){
        return this.add(field,'in',value);
    },
    nn:function(field,value){
        return this.add(field,'nn',value);
    }

});
