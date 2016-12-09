(function( window ) {
	"use strict";

	var laundry = $ns("co.nclk.laundry", window);
	var Store = Object.create(null);

	Object.defineProperty(
		Store,
		"MAX_CONTENT_LENGTH",
		{ value: (1 << 16) - 1 }
	);

	Object.defineProperty(Store, "find", { value: find });
	Object.defineProperty(Store, "create", { value: create });
	Object.defineProperty(Store, "getURI", { value: getURI });
	Object.defineProperty(Store, "postURI", { value: postURI });

	function create(name, baseURI) {

		if (!name || typeof name !== "string")
			throw TypeError("name {string} required");

		else if (typeof baseURI !== "string")
			throw TypeError("baseURI {string} required (but may be empty)");

		return Object.create(Store, {
			name: { value: name },
			baseURI: { value: baseURI }
		});
	}

	function postURI(uri, data, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open("post", uri);
		xhr.addEventListener("readystatechange", function(e) {
			switch (xhr.readyState) {
			case xhr.DONE:
				if (xhr.status < 300) {
					var data = JSON.parse(xhr.responseText);
					callback(null, data);
				}
				else {
					callback(
						new Error(
							"Response code was " + xhr.status
						)
					);
				}
				break;
			}
		}.bind(this));

		if (data)
			xhr.send(JSON.stringify(data));
		else
			callback(null, null);
	}

	function getURI(uri, callback) {

		var store = this;
		var xhr = new XMLHttpRequest();

		xhr.open("get", uri);
		xhr.addEventListener("readystatechange", function(e) {
			switch (this.readyState) {
			case this.HEADERS_RECEIVED:
				// Disallow loading of content larger
				// than MAX_CONTENT_LENGTH
				var length = this.getResponseHeader(
					"Content-Length"
				);
				if (length > Store.MAX_CONTENT_LENGTH) {
					this.abort();
					callback(
						new Error([
							"Response's Content-Length",
							"must be less than",
							Store.MAX_CONTENT_LENGTH,
							"and its Content-Length was",
							length
						].join(" "))
					);
				}
				break;
			case this.DONE:
				if (this.status === 200) {
					var responseText = 
						this.responseText;
					try {
						var data = JSON.parse(
							responseText
						);
						store.cache && store.cache.set(uri, responseText);
				        callback(null, data);
					}
					catch (e) { callback(e); }
				}
				else {
					callback(
						new Error([
							"Response status was",
							this.status
						].join(" "))
					);
				}
				break;
			}
		});

		xhr.setRequestHeader(
			"Accept",
			"application/json;charset=utf-8"
		);

		xhr.send();
	}

	function find(query, callback) {

		if (!Function.prototype.isPrototypeOf(callback))
			return false;

		var uri = !query ? this.baseURI
			: [this.baseURI, laundry.Query.create(query)].join("?");

		this.getURI(uri, callback);
	};

	Object.defineProperty(laundry, "Store", { value: Store });

})( this );
