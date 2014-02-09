/**
 * App 
 * Main application controller. 
 * Will add special events to DOM and launch default entrypoint.
 *
 * @author Tibi
 * @version 0.1.0
 * 
 */

(function(){
	"use strict";
	var App = {};
	
	/**
	 * App Application main object template
	 * @type {Object}
	 * 
	 * @param {object} entrypoint Specify an array ['module', 'action'] to be launched on app init
	 * @param {function} init Prepare app requirements
	 * @param {function} run Boot application
	 * @param {object} controller Store applications controller
	 * @param {object} engine Store framework functionality
	 * @param {object} eventsStack Store applications events
	 */
	App = {
		entrypoint: ['snippet', 'view'],
		init: function() {
			/**
			 * Load App required events
			 */
			this.events.load();
			this.events.signal();

			/**
			 * Run default action
			 */
			this.run();
		},
		run: function(){
			this.controller[this.entrypoint[0]].load(this.entrypoint);
		},
		controller: {},
		engine: {},
		eventsStack:{}
	};

	/**
	 * App.events Application events for handling UI
	 * -> load - Add a monitor over click event to determine it's action
	 * -> signal -> Add an UI interaction monitor
	 * 
	 * @type {Object}
	 */
	App.events = {
		load: function(){
			document.addEventListener('click', function(event){
				var element;
				element = (undefined === event.srcElement) ? event.target : event.srcElement;

				/**
				 * Prevent default input actions
				 */
				if ("input" === element.nodeName.toLowerCase() && "submit" === element.getAttribute("type")) {
					event.preventDefault();
					event.stopPropagation();
				}

				if ("button" === element.nodeName.toLowerCase()) {
					event.preventDefault();
					event.stopPropagation();
				}

				if ("a" === element.nodeName.toLowerCase()) {
					event.preventDefault();
					event.stopPropagation();
				}

				/**
				 * Fires controller action as specified in dataset
				 */
				if(undefined !== element.dataset.trigger) {
					if(undefined !== App.menu.currentMenu && App.menu.currentMenu !== element.dataset.trigger) {
						var targetArr = element.dataset.trigger.split('.');
						App.controller[targetArr[0]].load(targetArr, element.dataset);
					}
				}
			}, false);
		},
		signal: function() {
			if(undefined === App.eventsStack['SnippetLoad']){
				App.eventsStack['AppSignal'] = new Event('App.signal');
				App.eventsStack['AppSignal']['process'] = {};

				document.addEventListener('App.signal', function(event){
					var processAction = Object.keys(event.process),
						processData = Object.keys(event.process[processAction[0]]);

					if(undefined !== App[processAction[0]]) {
						if('function' === typeof App[processAction[0]][processData[0]]) {
							App[processAction[0]][processData[0]](event.process[processAction[0]][processData[0]]);
						} else {
							throw new Error('[Application] Action: ' + processData[0] + ' is not a function');
						}
					} else {
						throw new Error('[Application] Unknown action: ' + processAction[0]);
					}

				}, false);
			}
		}
	};

	/**
	 * App.menu.activate - Application menu handler. Will activate a menu item
	 * 
	 * @type {Object}
	 * 
	 * @param {String} menuitem The name of the menu item that was clicked
	 * @return {void}
	 */
	App.menu = {
		currentMenu: '',
		activate: function(menuitem){
			if(null !== document.querySelector('.navbar-nav .active')) {
				document.querySelector('.navbar-nav .active').setAttribute('class', '')
			}
			document.querySelector('[data-trigger="' + menuitem + '"]').parentNode.setAttribute('class', 'active');
			this.currentMenu = menuitem;
		}
	};

	/**
	 * App.menu - Application page handler. Will activate a page
	 * -> activePage {Object} Current active page container
	 * -> activate {Function} Activate the required page
	 * 		@param {String} [pageData] The name of the menu item that will be activated
	 * 	
	 * -> reset  {Function} Reset last active page contents
	 * 		@param {Object} this.activePage
	 * 
	 * @type {Object}
	 * 
	 * @param {String} menuitem The name of the menu item that was clicked
	 * @return {void}
	 */
	App.page = {
		activePage: null,
		activate: function(pageData){
			if(null !== this.activePage) {
				if(this.activePage.name === pageData.name && this.activePage.action === pageData.action) {
					//--- SKip
				} else {
					document.querySelector('[data-visibility="visible"].panel').setAttribute('data-visibility', 'hidden')
					this.reset(this.activePage);

					document.querySelector('[data-module="' + pageData.name + '"][data-view="' + pageData.action + '"]').setAttribute('data-visibility', 'visible');
					this.activePage = pageData;
				}
			} else {
				document.querySelector('[data-module="' + pageData.name + '"][data-view="' + pageData.action + '"]').setAttribute('data-visibility', 'visible');
				this.activePage = pageData;
			}
		},
		reset: function(element){
			document.querySelector('[data-module="' + element.name + '"][data-view="' + element.action + '"] .panel-body').innerHTML = "";
		}
	};

	/**
	 * Load public data to window
	 * @type {App}
	 */
	window.App = App;
}());