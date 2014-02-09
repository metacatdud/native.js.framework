describe("Application", function() {
	
	it("should be init", function() {
	    expect(window.App).toBeDefined();
  	});

	it("should have entrypoint array with size of 2", function() {
	    expect(Object.prototype.toString.call(window.App.entrypoint)).toBe('[object Array]');
	    expect(window.App.entrypoint.length).toBe(2);
  	});

  	it("should load events", function() {
  		window.App.init();
  		expect(App.eventsStack).not.toBe({});;
  	});

  	it("should have no menu loaded", function() {
  		expect(App.menu.currentMenu).toBe('');;
  	});
  	it("should have no pages loaded", function() {
  		expect(App.page.activePage).toBe(null);;
  	});
})