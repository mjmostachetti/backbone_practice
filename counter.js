var Counter = Backbone.Model.extend({
    defaults : {"value" : 0}
});

var CounterView = Backbone.View.extend({
    render: function () {
        var val = this.model.get("value");
        var btn = '<button id="up">Increment</button>';
        var btndec = '<button id="down">Decrement</button>';
        var clear = '<button id="clear">Clear</button>';
        this.$el.html('<p>'+val+'</p>' + btn + btndec + clear);
    }
});

$(document).ready(function() {
	var counterModel = new Counter();

	var counterView = new CounterView({model : counterModel});
	counterView.render();
	counterModel.on("change", function () {
  	counterView.render();
	});
	counterView.$el.on("click","#up", function () {
    var mod = counterView.model;
    var currVal = mod.get("value");
    mod.set("value",currVal+1);
	});
	counterView.$el.on("click","#down", function(){
		var currVal = counterView.model.get("value")
		if(currVal <= 0){
			console.log('can\' decrement below zero!')
		}
		else{
			counterView.model.set("value",currVal-1)
		}
	})
	counterView.$el.on("click","#clear", function () {
    var mod = counterView.model;
    mod.set("value",0);
	});


	$("#counterdiv").append(counterView.$el);
})





