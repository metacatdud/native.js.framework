/**
 * Credits module
 * Simple module to ilustrate some scalability
 *
 * Features
 * -> View credits
 *
 * @author Tibi
 * @version 0.1.0
 */

(function(){
	"use strict";

	var Credits = {};

	Credits = {
		events: {},
		eventsStack: {},
		currentEvent: null
	};

	Credits.view = function(event) {
		App.engine.template.setTemplate('[data-module="' + event.info.module + '"][data-view="' + event.info.action + '"]', '.panel-body');
		App.engine.template.load(event.info.module + '.' + event.info.action);

		//if (App.engine.template.target === '')
		Credits.eventsStack.CreditsShow['info'] = event.info;
		document.dispatchEvent(Credits.eventsStack.CreditsShow);
	}

	Credits.install = function (){
		console.log('[Credits] Install events');

		if(undefined === this.eventsStack['CreditsLoad']){
			this.eventsStack['CreditsLoad'] = new Event('Credits.load');
			document.addEventListener('Credits.load', function(event){
				Credits[event.info.action](event);
			});
		}
		if(undefined === this.eventsStack['CreditsShow']){
			this.eventsStack['CreditsShow'] = new Event('Credits.show');
			document.addEventListener('Credits.show', function(event){
				App.eventsStack.AppSignal.process = {
					menu: {
						activate: event.info.module + '.' + event.info.action
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
	}

	Credits.events = {
		load: function(target, extra) {
			if(undefined === Credits[target[1]]) {
				throw new Error ('[Credits] Action [' + action + '] does not exist');
			}
			Credits.currentEvent = {
				module: target[0],
				action: target[1],
				extra: extra
			};
			Credits.eventsStack.CreditsLoad['info'] = Credits.currentEvent;
			document.dispatchEvent(Credits.eventsStack.CreditsLoad);
		}
	};
	/**
	 * Mount Credits controllers events
	 */
	 Credits.install();

	/**
	 * Load public data to window object
	 * @type {Object}
	 */
	console.log('[APP] -> Mounting [Credits] controller');
	window.App.controller['credits'] = Credits.events;

}());