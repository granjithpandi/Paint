/*  
	Author Details
	==============
	Author: Ranjith Pandi

	Author URL: http://ranjithpandi.com

	Attribution is must on every page, where this work is used.

	For Attribution removal request. please consider contacting us through http://ranjithpandi.com/#contact
*/

;(function($) {

	var defaults = {
		color: '#FF0000',
		lineWidth: 5
	};

	var Paint = {
		init: function($ele, options) {
			var self = this;
			self.$ele = $ele;
			self.options = $.extend({}, defaults, options);
			self.initializeToolbar();
			self.initPaint();
		},

		initializeToolbar: function(){
			var self = this;
			var color = self.options.color;
			var lineWidth = self.options.lineWidth;
			var toolsArr = [];
			toolsArr.push('<div class="toolbar-item"><div class="tools" data-type="paint">Marker</div><div class="tools" data-type="eraser">Eraser</div>');
			toolsArr.push('<div>Line Width <input type="range" id="brushWidth" name="points" value="'+lineWidth+'" min="1" max="15"></div>');
			toolsArr.push('<div>Color <input type="color" id="brushColor" name="brushColor" value="'+color+'"></div>');
			toolsArr.push('</div>');

			self.$ele.before(toolsArr.join(''));
			$(".toolbar-item div.tools").on('click', function(){
				self.setTools($(this));
			});

			$("#brushWidth").on('change', function(){
				self.setWidth($(this).val());
			});

			$("#brushColor").on('change', function(){
				self.setColor($(this).val());
			});
		},

		setColor: function(val){
			var self = this;
			self.$ele.css('cursor', 'url(images/brush.png), auto');
			self.ctx.globalCompositeOperation = "source-over";
			self.options.color = val;
			self.ctx.lineWidth = self.options.lineWidth;
			self.ctx.strokeStyle = val;
		},

		setWidth: function(val){
			var self = this;
			self.$ele.css('cursor', 'url(images/brush.png), auto');
			self.ctx.globalCompositeOperation = "source-over";
			self.ctx.strokeStyle = self.options.color;
			self.options.lineWidth = val;
			self.ctx.lineWidth = val;
		},

		setTools: function($cur){
			var self = this;
			var type = $cur.data('type');
			if(type == "eraser"){
				self.$ele.css('cursor', 'url(images/eraser.png), auto');
				self.ctx.globalCompositeOperation = 'destination-out'
				self.ctx.strokeStyle = 'rgba(0,0,0,1)';
			}else{
				self.$ele.css('cursor', 'url(images/brush.png), auto');
				self.ctx.globalCompositeOperation = "source-over";
				self.ctx.strokeStyle = self.options.color;
				self.ctx.lineWidth = self.options.lineWidth;
			}
		},

		initPaint: function(){
			var self = this;
			self.canvas = self.$ele[0];
			self.position = {x: self.$ele.offset().left, y: self.$ele.offset().top};
			self.ctx = self.canvas.getContext('2d');
			self.ctx.strokeStyle = self.options.color;
			self.ctx.lineWidth = self.options.lineWidth;
			self.drawing = false;
			self.initEvents();
		},

		initEvents: function(){
			var self = this;
			self.$ele.on('mousedown', function(){
				self.startDraw(event);
			}).on('mousemove', function(){
				self.draw(event);
			}).on('mouseup mouseout', function(){
				self.stopDraw();
			});
		},

		startDraw: function(ev) {
			var self = this;
			var mouseX = ev.pageX - self.position.x;
			var mouseY = ev.pageY - self.position.y;
			self.ctx.beginPath();
			self.ctx.moveTo(mouseX, mouseY);
			self.drawing = true;
		},

		draw: function(ev) {
			var self = this;
			if(self.drawing) {
				var mouseX = ev.pageX - self.position.x;
				var mouseY = ev.pageY - self.position.y;
				self.ctx.lineTo(mouseX, mouseY);
				self.ctx.stroke();
			}
		},

		stopDraw: function() {
			var self = this;
			if(self.drawing){
				self.drawing = false;
			}
		}
	};

	$.fn.paint = function(options) {
		return this.each(function() {
			var paintObj = Object.create(Paint);
			paintObj.init($(this), options);
		});
	};

})(jQuery)