/**
 * Snippet module
 * This module handles the code snippet
 *
 * Features
 * -> Add code snippet
 * -> List snippets
 * -> View snippets
 *
 * @author Tibi
 * @version 0.1.0
 */

(function(){
	"use strict";

	var Snippet = {};

	/**
	 * Snippet object default template
	 * @type {Object}
	 */
	Snippet = {
		collection: 'https://everymatrix01.firebaseio.com/snippets',
		handler: function (uri) {
			if (undefined !== uri ) {
				return new Firebase(this.collection + '/' + uri);
			}
			return new Firebase(this.collection)
		},
		events:{},
		eventsStack:{},
		currentEvent: null
	};

	Snippet.add = function(event){

		App.engine.template.setTemplate('[data-module="' + event.info.module + '"][data-view="' + event.info.action + '"]', '.panel-body');
		App.engine.template.load(event.info.module + '.' + event.info.action);

		//if (App.engine.template.target === '')
		Snippet.eventsStack.SnippetShow['info'] = event.info;
		document.dispatchEvent(Snippet.eventsStack.SnippetShow);
	};

	Snippet.view = function(event) {
		App.engine.template.setTemplate('[data-module="' + event.info.module + '"][data-view="' + event.info.action + '"]', '.panel-body');

		this.handler().on('value', function(res){
			if(null === res.val()) {
				App.engine.template.load(event.info.module + '.norecords');
			} else {
				App.engine.template.load(event.info.module + '.' + event.info.action, res.val());
			}
			Snippet.eventsStack.SnippetShow['info'] = event.info;
			document.dispatchEvent(Snippet.eventsStack.SnippetShow);
		});
	};

	Snippet.save = function(event) {
		var form = document.querySelector('[data-form="' + event.info.module + '.' + event.info.action +'"]'),
			submitData = {
				author: '',
				description: '',
				code: ''
			};

		submitData.author = form.querySelector('[data-value="author"]').value;
		submitData.description = form.querySelector('[data-value="description"]').value;
		submitData.code = form.querySelector('[data-value="code"]').value;
		
		if('' === submitData.code || '' === submitData.description || '' === submitData.author) {
			alert('Plese fill in the form')	
		} else {
			this.handler().push(submitData);
			form.querySelector('[data-value="author"]').value = '';
			form.querySelector('[data-value="description"]').value  = '';
			form.querySelector('[data-value="code"]').value  = '';
			alert('Code successfully added!');
		}
	}
	Snippet.details = function(event) {
		if(undefined !== event.info.extra.id) {
			this.handler(event.info.extra.id).on('value',function(res){
				App.engine.template.modal.load('snippet.modal', res.val());
			})
		}
	};

	Snippet.install = function (){
		console.log('[Snippet] Install events');

		if(undefined === this.eventsStack['SnippetLoad']){
			this.eventsStack['SnippetLoad'] = new Event('Snippet.load');
			document.addEventListener('Snippet.load', function(event){
				Snippet[event.info.action](event);
			});
		}

		if(undefined === this.eventsStack['SnippetShow']){
			this.eventsStack['SnippetShow'] = new Event('Snippet.show');
			
			document.addEventListener('Snippet.show', function(event){
				App.eventsStack.AppSignal.process = {
					menu: {
						activate: 'snippet.' + event.info.action
					}
				};
				document.dispatchEvent(App.eventsStack.AppSignal);
				
				App.eventsStack.AppSignal.process = {
					page: {
						activate: {
							name: event.info.module,
							action: event.info.action
						}
					}
				};
				document.dispatchEvent(App.eventsStack.AppSignal);
			});
		}
	};

	Snippet.events = {
		load: function(target, extra) {
			if(undefined === Snippet[target[1]]) {
				throw new Error ('[Snippet] Action [' + action + '] does not exist');
			}
			Snippet.currentEvent = {
				module: target[0],
				action: target[1],
				extra: extra
			};
			Snippet.eventsStack.SnippetLoad['info'] = Snippet.currentEvent;
			document.dispatchEvent(Snippet.eventsStack.SnippetLoad);
		}
	};

	/**
	 * Mount Snippet controllers events
	 */
	 Snippet.install();

	/**
	 * Load public data to window object
	 * @type {Object}
	 */
	console.log('[APP] -> Mounting [Snippet] controller');
	window.App.controller['snippet'] = Snippet.events;
}());