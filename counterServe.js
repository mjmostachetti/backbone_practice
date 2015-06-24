$(document).ready(function(){
	var Counter = Backbone.Model.extend({
		defaults : {"value":0},
		urlRoot:"/counter"
	});

	var Texter = Backbone.Model.extend({
		defaults : {
			"text":"",
			"newText" : ""
		},
		urlRoot: "/text",
		concat : function(){
			var textz = this.get('text')
			var newTextz = this.get("newText")
			this.set("text",textz+newTextz)
			this.save()
		}
	})

	var counterModel1 = new Counter({ id : 1});
	var counterModel2 = new Counter;
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
	counterModel2.fetch();

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

	var textView = Backbone.View.extend({
		render : function(){
			this.$el.html('<input type="text" value="textVal"><button>')
		},
		initialize : function(){
			this.listenTo(this.model, 'sync', this.concat)
		},
		events : {
			'click button' : 'adder'
		},
		adder : function(){
			this.model.set('newText',this.$el.find('input').val())
			this.model.concat()
		}
	})

	var counterView1 = new CounterView({ model : counterModel1 })
	var counterView2 = new CounterView({ model : counterModel2 })
	var textView1 = new textView({ model : texterModel })

	counterView1.render()
	counterView2.render()
	textView1.render()

	console.log("counterView1.$el is : " + counterView1.$el)
	$("#counterdiv").append(counterView1.$el)
	$("#counterdiv").append(counterView2.$el)
	$("#textdiv").append(textView1.$el)
})