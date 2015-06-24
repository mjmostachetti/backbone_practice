$(document).ready(function(){
	var Counter = Backbone.Model.extend({
		defaults : {"value":0},
		urlRoot:"/counter",

	});

	var Texter = Backbone.Model.extend({
		defautls : {"text":""},
		urlRoot: "/text"
	})

	var counterModel1 = new Counter({ id : 1});
	var texterModel = new Texter({ id : 1 })

	Counter.prototype.inc = function(){
		var val = this.get("value")
		this.set("value",val+1)
		this.save();
	}

	Counter.prototype.dec = function(){
		var val = this.get("value")
		this.set("value",val-1)
		this.save();
	}

	counterModel1.fetch();
	var syncNum = 0;
	var CounterView = Backbone.View.extend({
		render: function(){
			var val = this.model.get("value")
			var btn = '<button id="inc">Increment</button>';
			var dec = '<button id="dec">Dec</button>'
			this.$el.html('<p>'+val+'</p>'+btn + dec);
		},
		initialize: function(){
			this.model.on('change', this.render, this),
			this.listenTo(this.model, 'sync', this.addNewP)
		},
		events : {
			'click #inc' : 'increment',
			'click #dec' : 'decrement'
		},
		increment : function(){
			this.model.inc()
		},
		decrement : function(){
			this.model.dec()
		},
		addNewP : function(){
			console.log('Sync Event Occurred');
			$("#counterdiv").append('<p id="syncer"></p>');
			$("#syncer").html(syncNum)
			syncNum++;
		}
	});

	var counterView1 = new CounterView({ model : counterModel1 })

	counterView1.render()
	console.log("counterView1.$el is : " + counterView1.$el)
	$("#counterdiv").append(counterView1.$el)

})