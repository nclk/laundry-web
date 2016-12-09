(function ( window ) {
	"use strict";

	var laundry = $ns("co.nclk.laundry", window);
	var HoquetTemplate = Object.create(laundry.Serializable);
	var hoquet = (function() {
		if (
		 	!window.hoquet ||
			typeof window.hoquet.render !== "function" ||
			window.hoquet.render(["p",""]) !== "<p></p>"
		) throw TypeError("HoquetTemplate requires access to {hoquet}");

		return window.hoquet;
	})();

	Object.defineProperty(HoquetTemplate, "engine", { value: hoquet });
	Object.defineProperty(laundry, "HoquetTemplate", { value: HoquetTemplate });

})( this );
