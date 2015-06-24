var TextModel = Backbone.Model.extend({
    defaults : {
    	"value" : "",
    	"editNum" : 0,
    	"lastValue": ""
    },
    replace : function (str) {
      this.set("value", str);
    },
    editNumUp : function(){
    	var oldNum = this.get("editNum")
    	this.set("editNum",oldNum + 1)
    }
});

var TextView = Backbone.View.extend({
		
		template : _.template("<div> <%=textVal%> <br><div><input type=\'text\' value=\'<%=textVal%>\' /><button>Clear</button></div></div>"),

    render: function () {
        var textVal = {
        	textVal : this.model.get("value")
        };
        //var btn = '<button>Clear</button>';
        //var input = '<input type="text" value="' + textVal + '" />';
        //this.$el.html("<div>"+textVal+"<br><div>" + input + btn + "</div></div>");
        this.$el.html(this.template(textVal))
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.set("lastValue",this.model.get("value"))
        // last argument 'this' ensures that render's
        // 'this' means the view, not the model
    },
    events : {
        "click button" : "clear",
        "keypress input" : "updateOnEnter",

    },
    replace : function () {
        var str = this.$el.find("input").val();
        this.model.replace(str);
    },
    clear: function () {
        this.model.replace("");
        this.model.editNumUp();
        this.model.set('lastValue','')
        console.log(this.model.changed)
        console.log("This view has been edited " + this.model.get("editNum"))
    },
    updateOnEnter: function (e){
    		//this.replace();
        if(e.keyCode == 13) {
        	//set value to the current
        	console.log("this.model.lastVal : " + this.model.get('lastValue'));
        	console.log("this.model.get('value') : " + this.model.get("value"));
        	console.log(this.model.changed)
        	if(this.model.get("lastValue") !== this.model.get("value")){
            this.replace();
            this.model.editNumUp();
            this.model.set('lastValue',this.model.get("value"))
            console.log("This is the last val : " + this.model.lastVal)
        		console.log("This view has been edited " + this.model.get("editNum"))
        	}
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
    	this.collection.pop();
    },
    addView : function (newModel) {
        newModel.set("value","Enter something here...");
        viewNum++;
        var view = new TextView({
        	model : newModel
        });
        console.log(view)
        view.render();
        this.viewz.push(view)
        console.log(this.viewz)
        this.$("#text-list").append(view.$el);
    },
    delView : function(remModel){
    	this.viewz.pop().remove()
    }
});

$(document).ready(function(){
	var textCollection = new TextCollection();

	var textCollectionView = new TextCollectionView({ collection : textCollection});

	textCollectionView.render();

	$("#listdiv").append(textCollectionView.$el);
})
