(function ( window ) {
	"use strict";

	var laundry = $ns("co.nclk.laundry", window);
	var Model = Object.create(null);

	function create(resourceTypeStore, cache) {
		return Object.create(Model, {
			resourceTypeStore: { value: resourceTypeStore },
			cache: { value: cache }
		});
	}

	function setStoreContainer(types) {
		var model = this;
		var baseURI = model.resourceTypeStore.baseURI;

		var container = Object.keys(types).map(function(rt) {
			return [
				types[rt].relation,
				laundry.Store.create(
					rt, [baseURI + types[rt].context, null].join("/")
				)
			];
		}).reduce(function(obj, t) {
			return Object.defineProperty(
				obj, t[0], { value: t[1] }
			);
		}, Object.create(null));

		Object.defineProperty(
			model, "storeContainer", { value: container }
		);
	}

	function getResourceTypes(force, callback) {
		var cache = !force && this.maybeCache(uri);
		var model = this;

		return cache ? callback(null, cache)
		: this.resourceTypeStore.find({}, function(e, data) {
			if (!e) {
				model.maybeCache("resource-types", data);
				if (!model.storeContainer) {
					model.setStoreContainer(data);
				}
			}

			return callback(e, data);
		});
	}

    function getConfigProfile(name, callback) {
        getResourceByKey("config_profile", name, callback);
    }

    function getConfigProfiles(query, callback) {
        return this.getResources("config_profile", query, callback);
    }

    function getConfigProfileProgramMaps(query, callback) {
        return this.getResources("config_profile_program_map", query, callback);
    }

    function getTestRuns(query, callback) {
        return this.getResources("test_run", query, callback);
    }

    function getResources(relation, query, callback) {
        var store = this.storeContainer[relation];
        return store.find(query, callback);
    }

    function getResourceByKey(relation, value, callback) {
        return this.storeContainer[relation].getURI(
            this.storeContainer[relation].baseURI + value,
            callback
        );
    }

   // function getPrograms(query, callback) {
   //     var model = this;
   //     return this.storeContainer.program.find(
   //         query, function(e, resultSet) {
   //             resultSet.results.forEach(function(program) {
   //                 model.getConfigProfile(
   //                     program.name,
   //                     "default",
   //                     function(e, cp) {
   //                         program.defaultConfigProfile = cp;
   //                         callback(null, resultSet);
   //                     }
   //                 );
   //             });
   //         }
   //     );
   // }

    function getDefaultConfigProfiles(program_name, callback) {
        var model = this;
        model.getConfigProfileProgramMaps(
            { program: program_name },
            function(e, rs) {
                        console.log(e);
                var cp_names = rs.results.map(
                    function(x) { return x.config_profile; }
                );
                model.getConfigProfiles(
                    { name: cp_names },
                    function(e, resultSet) {
                        !e && callback(null, resultSet);
                    }
                );
            }
        );
    }

    function getPrograms(query, callback) {
        var model = this;
        return this.storeContainer.program.find(
            query, function(e, resultSet) {
                callback(null, resultSet);
                //resultSet.results.forEach(function(program) {
                //    model.getConfigProfileProgramMaps(
                //        { program: program.name },
                //        function(e, rs) {
                //            var cp_names = rs.results.map(
                //                function(x) { return x.config_profile; }
                //            );
                //            model.getConfigProfiles(
                //                { name: cp_names },
                //                function(e, rs) {
                //                    !e && (program.defaultConfigProfiles =
                //                            rs.results);
                //                    callback(null, resultSet);
                //                }
                //            );
                //        }
                //    );
                //});
            }
        );
    }

    function runProgram(data, callback) {
        var store = this.resourceTypeStore;
        return store.postURI(
            store.baseURI + "/actions/run",
            data,
            callback
        );
    }

	function maybeCache(uri, data) {
		return !this.cache ? false
		: !data ? this.cache.get(uri)
		: this.cache.set(uri, data);
	}

	Object.defineProperties(Model, {
		create: { value: create },
		maybeCache: { value: maybeCache },
		getResourceTypes: { value: getResourceTypes },
		getResources: { value: getResources },
		getPrograms: { value: getPrograms },
		runProgram: { value: runProgram },
        getTestRuns: { value: getTestRuns },
        getConfigProfiles: { value: getConfigProfiles },
        getConfigProfileProgramMaps: { value: getConfigProfileProgramMaps },
        getDefaultConfigProfiles: { value: getDefaultConfigProfiles },
		getConfigProfile: { value: getConfigProfile },
		setStoreContainer: { value: setStoreContainer }
	});
	Object.defineProperty(laundry, "Model", { value: Model });

})( this );
