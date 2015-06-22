var TextModel = Backbone.Model.extend({
    defaults : {
    	"value" : "",
    	"viewNum" : 0,
    },
    replace : function (str) {
      this.set("value", str);
    }
});

var TextView = Backbone.View.extend({
    render: function () {
        var textVal = this.model.get("value");
        var viewNumVal = this.model.get("viewNum")
        var btn = '<button>Clear</button>';
        var input = '<input type="text" value="' + textVal + '" />';
        this.$el.html("<div id="+viewNumVal+">"+textVal+"<br><div>" + input + btn + "</div></div>");
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        // last argument 'this' ensures that render's
        // 'this' means the view, not the model
    },
    events : {
        "click button" : "clear",
        "keypress input" : "updateOnEnter"
    },
    replace : function () {
        var str = this.$el.find("input").val();
        this.model.replace(str);
    },
    clear: function () {
        this.model.replace("");
    },
    updateOnEnter: function (e){
        if(e.keyCode == 13) {
            this.replace();
        }
    }
});

var TextCollection = Backbone.Collection.extend({
	model : TextModel
})

var viewNum = 0;
var TextCollectionView = Backbone.View.extend({
    render : function () {
        var btn = '<button id="addbutton">Add Text</button>';
        var div = '<div id="text-list"></div>';
        var del = '<button id="del">Delete Text</button>';
        this.$el.html(div + btn + del);
    },
    initialize : function () {
        this.listenTo(this.collection, 'add', this.addView);
        this.listenTo(this.collection, 'remove', this.delView);
        this.viewz = [];
    },
    events : {
        "click #addbutton" : "addModel",
        "click #del" : "delModel"
    },
    addModel : function () {
        this.collection.add({});
        // collection adds a model, fires add event, then listener calls this.addView(model)
    },
    delModel : function(){
    	/*
    	console.log(this.collection.length)
    	var len = this.collection.length
    	viewNum--;
    	this.collection.remove(this.collection.at(len-1));
    	*/
    	this.collection.pop();
    },
    addView : function (newModel) {
        newModel.set("value","Enter something here...");
        viewNum++;
        newModel.set("viewNum",viewNum)
        var view = new TextView({
        	model : newModel,
        	viewNum : viewNum
        });
        console.log(view)
        view.render();
        this.viewz.push(view)
        console.log(this.viewz)
        this.$("#text-list").append(view.$el);
    },
    delView : function(remModel){
    	/*
    	console.log("Removed models vewNum = " + remModel.attributes.viewNum)
    	this.$('#'+remModel.attributes.viewNum).remove()
    	*/
    	this.viewz.pop().remove()
    }
});

$(document).ready(function(){
	var textCollection = new TextCollection();

	var textCollectionView = new TextCollectionView({ collection : textCollection});

	textCollectionView.render();

	$("#listdiv").append(textCollectionView.$el);
})
