(function ( window ) {
	"use strict";

	var laundry = $ns("co.nclk.laundry", window);
	var Query = Object.create(laundry.Serializable);

	function _escapeDot(key) {
		return key; encodeURIComponent(key).replace(/\./g,"~");
	}

	function _queryToString(query, key) {
        return Array.isArray(query) ? key + "=" + query.join("&" + key + "=")
        : query === Object(query) ?
		    Object.keys(query).map(function(k) {
		    	var newKey = key ? [key, _escapeDot(k)].join(".") : _escapeDot(k);
		    	return query[k] === Object(query[k]) ? _queryToString(
		    		query[k], newKey
		    	)
		    	: [newKey, _queryToString(query[k])].join("=");
		    }).join("&")
		: encodeURIComponent(query);
	}

	function _queryToString2(query, key) {

		var keys = [];
		
		if (query !== Object(query))
			return encodeURIComponent(query);

		for (var i in query) {
			keys.unshift(i);
		}

		return keys.map(function(k) {
			var newKey = key ? [key, _escapeDot(k)].join(".") : _escapeDot(k);
			return query[k] === Object(query[k]) ? _queryToString(
				query[k], newKey
			)
			: [newKey, _queryToString(query[k])].join("=");
		}).join("&");
	}

	Object.defineProperty(Query, "toString", {
		value: function(onlyOwnProperties) {
			return onlyOwnProperties ? _queryToString(this)
			: _queryToString2(this);
		}
	});

	Object.defineProperty(Query, "create", {
		value: function(q) {
			return Object.keys(q).reduce(function(a,b) {
				return Object.defineProperty(a, b, {
					value: q[b],
					enumerable: true
				});
			}, Object.create(this));
		}
	});

	Object.defineProperty(laundry, "Query", { value: Query });

})( this );
