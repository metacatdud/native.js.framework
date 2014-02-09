(function(){
	"use strict";
	
	var Template = {};

	Template = {
		target: {},
		source: {}
	};

	Template.load = function(htmlElement, data){

		this.source = document.querySelector('[data-template="' + htmlElement + '"].template').firstElementChild.cloneNode(true);
		if(undefined !== data) {
			this.map(data, function(res){
				Template.target.innerHTML = res;
			});
		} else {
			this.target.appendChild(this.source);
		}
	};

	Template.setTemplate = function(template, customPlaceHolder){
		var selector;

		selector = template;
		if(undefined !== customPlaceHolder) {
			selector = selector + ' ' + customPlaceHolder
		}
		if(true === this.utils.checkTemplate(selector)) {
			this.target = document.querySelector(selector);
		} else {
			throw new Error ('[Template] Specified selector is not valid. [Selector]-> ' + selector);
		}
	};
	
	Template.map = function(data, callback){
		var key,
			keys,
			i_data,
			output = '',
			clone;

		for(key in data) {
			clone = Template.source.cloneNode(true);
			//clone.setAttribute('data-id', key);
			clone.querySelector('[data-id]').setAttribute('data-id', key);
			keys = Object.keys(data[key]);

			for(i_data = 0; i_data < Object.keys(data[key]).length; i_data += 1) {
				if(null !== clone.querySelector('[data-value="' + keys[i_data] + '"]')) {
					if(true === clone.querySelector('[data-value="' + keys[i_data] + '"]').hasAttribute('short')){
						clone.querySelector('[data-value="' + keys[i_data] + '"]').innerHTML = data[key][keys[i_data]].substring(0,50)+'...';
					} else {
						clone.querySelector('[data-value="' + keys[i_data] + '"]').innerHTML = data[key][keys[i_data]];
					}
				}
			}

			output += clone.outerHTML;
		}
		callback(output);
	};

	Template.modal = {
		load: function(modalName, data) {
			var modalBox,
				i_data;

			$('[data-name="snippet.modal"]').on('show.bs.modal', function (){
				prettyPrint();
				$('.prettyprinted').removeClass('prettyprinted');
			});

			$('[data-name="snippet.modal"]').on('hidden.bs.modal', function (res){
				Template.modal.unload(modalBox);
			});

			modalBox = $('[data-name="' + modalName + '"]');

			for(i_data = 0; i_data < Object.keys(data).length; i_data += 1) {
				modalBox.find('[data-value="' + Object.keys(data)[i_data] + '"]').html(data[Object.keys(data)[i_data]]);
			}
			modalBox = $('[data-name="' + modalName + '"]');
			modalBox.modal('show');


		},
		unload: function(modalObject) {
			modalObject.find('[data-value]').html('');
		}
	};

	Template.utils = {
		checkTemplate: function(selector){
			return (null === document.querySelector(selector)) ? false : true;
		}
	};
	/**
	 * Load public data to window
	 * @type {Object}
	 */
	console.log('[APP] -> Mounting [Template] engine');
	window.App.engine['template'] = Template;
}());