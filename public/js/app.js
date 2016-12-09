(function ( window ) {
	"use strict";

	var laundry = $ns("co.nclk.laundry");
	var App = Object.create(null);

	function create(resourceTypeStore, cache) {
		var model = laundry.Model.create(
			resourceTypeStore,
			cache
		);
		var template = laundry.Template;
		var view = laundry.View.create(template);
		var controller = laundry.Controller.create(model, view);

		var app = Object.create(App, {
			model: { value: model },
			view: { value: view },
			controller: { value: controller }
		});

		return app
	}

	function init(config) {
		this.controller.init(config);
	}

	Object.defineProperty(App, "create", { value: create });
	Object.defineProperty(App, "init", { value: init });

	Object.defineProperty(laundry, "App", { value: App });

})( this );
