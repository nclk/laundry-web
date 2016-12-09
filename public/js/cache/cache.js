(function ( window ) {
	"use strict";

	var Cache = Object.create(null);

	function get(key) {}

	function set(key, data) {
		return data;
	}

	function create() {
		return Object.create(Cache);
	}

	Object.defineProperty(Cache, "create", { value: create });
	Object.defineProperty(Cache, "get", { value: get });
	Object.defineProperty(Cache, "set", { value: set });

	$ns("co.nclk.laundry.cache", window).Cache = Cache;

})( this );
