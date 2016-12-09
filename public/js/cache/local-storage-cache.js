(function ( window ) {
	"use strict";

	var cache = $ns("co.nclk.laundry.cache", window);
	var LocalStorageCache = Object.create(cache.Cache);
	var initialized = false;

	function get(uri) {
		var keyspace = this.keyspace,
		    expiryKey = [keyspace, uri].join("~"),
		    expiry = parseInt(localStorage[expiryKey]);

		initialized || this.init();

		if (expiry) {
			if (!~expiry || (new Date).getTime() < expiry) {
				return JSON.parse(localStorage[[keyspace, uri].join("")]);
			}
			else {
				delete localStorage[uri];
				delete localStorage[expiryKey];
			}
		}
	}

	function set(uri, data, ttl) {
		data = JSON.stringify(data);

		if (ttl === false || ttl === 0)
			return data;

		var ttl = typeof ttl !== "undefined" ? ttl : this.ttl,
		    expiry = !~ttl ? ttl : (new Date).getTime() + ttl;

		window.localStorage[[this.keyspace, uri].join("~")] = expiry;
		return window.localStorage[[this.keyspace, uri].join("")] = data;

	}

	function prune() {
		var keyspace = this.keyspace,
		    idx = keyspace.length;

		Object.keys(window.localStorage).filter(function(k) {
			return k.length && k.indexOf(keyspace) === 0;
		}).filter(function(k) {
			return k.charAt(idx) === "~";
		}).forEach(function(k) {
			if ((new Date).getTime() >= parseInt(localStorage[k])) {
				delete window.localStorage[[keyspace, k.substring(idx + 1)].join("")];
				delete window.localStorage[k];
			}
		});
	}

	function create(keyspace, ttl, gcRate) {
		var cache = Object.create(LocalStorageCache, {
			keyspace: { value: keyspace || "" },
			ttl: { value: ttl },
			gcRate: { value: gcRate }
		});

		return cache;
	}

	function init() {
		initialized = true;
		this.gcRate > 0 && window.setInterval(function() {
			this.prune();
		}.bind(this), this.gcRate);

		return this;
	}

	Object.defineProperty(LocalStorageCache, "create", { value: create });
	Object.defineProperty(LocalStorageCache, "init", { value: init });
	Object.defineProperty(LocalStorageCache, "prune", { value: prune });
	Object.defineProperty(LocalStorageCache, "get", { value: get });
	Object.defineProperty(LocalStorageCache, "set", { value: set });

	cache.LocalStorageCache = LocalStorageCache;

})( this );
