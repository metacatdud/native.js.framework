/**
 * Template engine
 *
 * Feature
 * -> Load tempalte
 * -> Bind data to template
 *
 * @version 0.1.0
 * @author Tibi
 */

(function(){
	"use strict";
	
	var Template = {};

	Template = {
		target: {},
		source: {}
	};

	/**
	 * Template.load Set current module.action template
	 * 
	 * @param {String} htmlElement selector name
	 * @param {Object} data object data to be mapped onto html
	 * @type {Object}
	 */
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

	/**
	 * Template.setTemplate Set current module.action template
	 * 
	 * @param {String} template selector name
	 * @param {String} customPlaceHolder optional if target template is deeper
	 * @type {Object}
	 */
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
	
	/**
	 * Template.map Map data over html
	 * 
	 * @param {Object} data Object to fill modal box with
	 * @param {Function} callback Send response to a request
	 * @type {Object}
	 */
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

	/**
	 * Template.modal Wrapper over Bootstrap modal box
	 * 
	 * @method load
	 * @param {String} modalName Valid selector for a modal box html node
	 * @param {Object} data Object to fill modal box with
	 * @type {Object}
	 */
	Template.modal = {
		load: function(modalName, data) {
			var modalBox,
				i_data;

			$('[data-name="snippet.modal"]').on('shown.bs.modal', function (){
				$('.prettyprinted').removeClass('prettyprinted');
			});

			$('[data-name="snippet.modal"]').on('hidden.bs.modal', function (res){
				Template.modal.unload(modalBox);
			});

			modalBox = $('[data-name="' + modalName + '"]');

			for(i_data = 0; i_data < Object.keys(data).length; i_data += 1) {
				modalBox.find('[data-value="' + Object.keys(data)[i_data] + '"]').html(data[Object.keys(data)[i_data]]);
				if('code' === Object.keys(data)[i_data]) {
					$('pre code').each(function(i,e) {
						hljs.highlightBlock(e);
					});
				}
			}
			modalBox.modal('show');
		},
		unload: function(modalObject) {
			modalObject.find('[data-value]').html('');
		}
	};

	/**
	 * Template.utils Check if template exists
	 * @type {Object}
	 */
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