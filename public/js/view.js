(function ( window ) {
    "use strict";

    var View = Object.create(null, {
        events: { value: Object.create(null) },
        renderings: { value: Object.create(null) }
    });
    var events = [
        "LIST_RESOURCES",
        "RUN_PROGRAM",
        "PROGRAM_DEFAULT_CONFIGS",
        "LIST_PROGRAMS"
    ];
    var renderings = [
        "INIT",
        "TREE_NAV",
        "RESULT_SET",
        "SELECT_TEST_RUN",
        "DEFAULT_CONFIGS",
        "ERROR"
    ];

    var cardTabIndex = 1;

    events.forEach(function(x, idx) {
        Object.defineProperty(View.events, x, {
            value: idx,
            enumerable: true
        });
    });

    renderings.forEach(function(x, idx) {
        Object.defineProperty(View.renderings, x, {
            value: idx,
            enumerable: true
        });
    });

    function create(template) {
        var view = Object.create(View, {
            template: { value: template },
            keyMap: { value: [] },
            $body: { value: qs("body") }
        });

        return view;
    }

    function init(config) {
        this.render(this.renderings.INIT);
        // doing this here because this is where we get
        // access to `config` and also because we
        // haven't initialized the template yet.
        Object.defineProperties(this, {
            $container: { value: qs("body .container") },
            $treeNav: { value: qs("#tree-nav") },
            $resultSetContainer: { value: qs(".result-set-container") },
            $error: { value: qs("#error") }
        });
    }

    function render(cmd, param) {
        var template = this.template;
        switch (cmd) {
        case this.renderings.INIT:
            this.$body.innerHTML = template.engine.render(
                template.init
            );
            break;
        case this.renderings.SELECT_TEST_RUN:
            var selector = ".test_run a[data-id=" + param.id + "]";
            var $anchor = qs(selector, this.$resultSetContainer);
            // select the test run?
            break;
        case this.renderings.DEFAULT_CONFIGS:
            var $li = $parent(
                qs("li.program a[data-program_name=\"" +
                        param[0] + "\"]",
                    this.$resultSetContainer),
                "li"
            );
            var $detFinns = qs("form", $li);
            if (!$detFinns) {
                $li.insertAdjacentHTML(
                    "beforeend",
                    template.engine.render(
                        template.programResultSetItemForm(
                            param[0], param[1].results
                        )
                    )
                );
            }
            //var $editors = qsa(".extra-env", $detFinns);
            //Array.prototype.forEach.call($editors, function(x) {
            //    var json = JSON.parse(x.innerHTML);
            //    x.innerHTML = "";
            //    var editor = new JSONEditor(x, {
            //        mode: "text"
            //    });
            //    editor.set(json);
            //});
            break;
        case this.renderings.TREE_NAV:
            qs("ul", this.$treeNavUL)
                .innerHTML = template.engine.render(
                    template.treeNavItems(param[0])
                );
            var $anchor = qs(
                "a[data-relation=" + param[1] + "]",
                this.$treeNav
            );
            $anchor.click();
            $anchor.focus();
            window.$anchor = $anchor;
            break;
        case this.renderings.RESULT_SET:
            this.$resultSetContainer
                .innerHTML = template.engine.render(
                    template.resultSet.apply(null, param)
                );
            var $anchor = qs(
                "ul a[data-relation=" + param[1] + "]",
                this.$treeNav
            );
            $anchor.focus();
            break;
        case this.renderings.ERROR:
            this.$container.insertAdjacentHTML(
                "afterbegin",
                template.engine.render(
                    template.error(param)
                )
            );
            break;
        default:
            break;
        }
    }

    function delegateKeyCmd(root, target, handler, depth) {
        var view = this;
        ["keyup","keydown"].forEach(function(et) {
            $delegate(
                root, target, et,
                function(e) {
                    e = e || event;
                    view.keyMap[e.keyCode] = e.type === "keydown";
                    handler.bind(this)(e);
                },
                depth
            );
        });
    }

    function keyCmd(target, handler) {
        var view = this;
        ["keyup","keydown"].forEach(function(et) {
            $on(target, et, function(e) {
                e = e || event;
                view.keyMap[e.keyCode] = e.type === "keydown";
                handler.bind(this)(e);
            });
        });
    }

    function delegateNavClick(relation, handler) {
            $delegate(
                this.$treeNav,
                "ul > li.resource-type [data-relation=" +
                    relation  + "]",
                "click",
                function(e) {
                    var type = e.target;
                    handler();
                }
            );
    }

    function bind(event, handler, param) {
        var view = this;
        switch (event) {
        case this.events.LIST_RESOURCES:
            delegateNavClick.bind(this)(param, handler);
            $delegate(
                this.$resultSetContainer,
                ".list-group-item a",
                "click",
                function(e) {
                    var $targ = e.target;
                    $targ = $targ.nodeName === "LI" ? $targ
                    : $parent($targ, "li");
                    var $hidden = qs(".toggleable", $targ);
                    $hidden && (
                        $hidden.style.display =
                            $hidden.style.display === "none" ? "block"
                            : "none"
                    );
                }, 0
            );
            break;
        case this.events.PROGRAM_DEFAULT_CONFIGS:
            $delegate(
                this.$resultSetContainer,
                ".list-group-item.program a",
                "click",
                function(e) {
                    var $detFinns =
                        qs(
                            "form",
                            $parent(e.target, "li")
                        );
                    if (!$detFinns) {
                        var pname = e.target.dataset.program_name;
                        handler(pname);
                    }
                }
            );
            break;
        case this.events.LIST_PROGRAMS:
            delegateNavClick.bind(this)("program", handler);
            break;
        case this.events.RUN_PROGRAM:
            $delegate(
                this.$resultSetContainer,
                ".program > form button.run-program",
                "click",
                function(e) {
                    e.preventDefault();
                    var $button = e.target;
                    var $form = $parent($button, "form");
                    var $envs = qsa(".extra-env", $form);
                    //var env = $env.innerHTML;
                    var env = Array.prototype.map.call(
                        $envs,
                        function($x) {
                            return JSON.parse($x.innerHTML);
                        }
                    );
                    var program_name = $button.dataset.program_name;
                    handler(program_name, env);
                }
            );
            break;
        default:
            view.render(
                view.renderings.ERROR,
                new Error("Cannot bind to undefined event: " + event)
            );
            break;
        }
    }

    Object.defineProperty(View, "create", { value: create });
    Object.defineProperty(View, "init", { value: init });
    Object.defineProperty(View, "keyCmd", { value: keyCmd });
    Object.defineProperty(View, "delegateKeyCmd", { value: delegateKeyCmd });
    Object.defineProperty(View, "bind", { value: bind });
    Object.defineProperty(View, "render", { value: render });

    $ns("co.nclk.laundry").View = View;

})( this );
