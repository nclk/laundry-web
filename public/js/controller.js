(function ( window ) {
    "use strict";

    function create(model, view) {
        return Object.create(Controller, {
            model: { value: model },
            view: { value: view }
        });
    }

    function bindNavList(ctrl, relation, modelFunction) {
        ctrl.view.bind(
            ctrl.view.events.LIST_RESOURCES,
            function() {
                modelFunction(
                    { order: "created"
                    , direction: "desc"
                    }, function(e, resultSet) {
                        ctrl.view.render(
                                ctrl.view.renderings.RESULT_SET,
                                [resultSet, relation]
                        );
                    }
                );
            }, relation
        );
    }

    function bindAll(config) {
        var ctrl = this;

        bindNavList(
            this, "test_run", this.model.getTestRuns.bind(this.model)
        );
        bindNavList(
            this, "program", this.model.getPrograms.bind(this.model)
        );
        bindNavList(
            this, "config_profile",
            this.model.getConfigProfiles.bind(this.model)
        );

        this.view.bind(
            this.view.events.PROGRAM_DEFAULT_CONFIGS,
            function(pname) {
                ctrl.model.getDefaultConfigProfiles(
                    pname,
                    function(e, configs) {
                        ctrl.view.render(
                            ctrl.view.renderings.DEFAULT_CONFIGS,
                            [pname, configs]
                        );
                    }
                );
            }
        );

        this.view.bind(
            this.view.events.RUN_PROGRAM,
            function(pname, env) {
                console.log(pname, env);
                ctrl.model.runProgram({
                    program_name: pname,
                    env: env
                }, function(e, data) {
                    ctrl.model.getTestRuns(
                        {order: "created", direction: "desc"},
                        function(e, resultSet) {
                            ctrl.view.render(
                                ctrl.view.renderings.RESULT_SET,
                                [resultSet, "test_run"]
                            );
                            ctrl.view.render(
                                ctrl.view.renderings.SELECT_TEST_RUN,
                                data
                            );
                        }
                    );
                });
            }
        );

        //this.view.bind(
        //    this.view.events.TOGGLE_RESOURCE, null
        //);

    }

    function initializeResourceTypes(relationList) {
        var ctrl = this;
        this.model.getResourceTypes(true, function(e, types) {
            if (!e) {
                var resourceTypes = Object.keys(types).reduce(
                    function(obj, type) {
                        return ~relationList.indexOf(
                            types[type].relation
                        ) ? Object.defineProperty(
                            obj, type, {
                                value: types[type],
                                enumerable: true
                            }
                        )
                        : obj;
                    },
                    Object.create(null)
                );
                ctrl.view.render(
                    ctrl.view.renderings.TREE_NAV,
                    [resourceTypes, "test_run"]
                );
            }
            else ctrl.view.render(ctrl.view.renderings.ERROR, e);
        });
    }

    function init(config) {
        this.view.init(config);
        this.initializeResourceTypes([
            "program",
            //"config_profile",
            "test_run"
        ]);
        //this.lastCards(DEFAULT_CARD_COUNT, config.sourceLang);
        this.bindAll(config);
    }

    var laundry = $ns("co.nclk.laundry", window);
    var Controller = Object.create(null);

    Object.defineProperty(Controller, "create", { value: create });
    Object.defineProperty(Controller, "init", { value: init });
    Object.defineProperty(Controller, "bindAll", { value: bindAll });
    Object.defineProperty(
        Controller,
        "initializeResourceTypes",
        { value: initializeResourceTypes }
    );
    Object.defineProperty(laundry, "Controller", { value: Controller });

})( this );
