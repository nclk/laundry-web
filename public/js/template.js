(function ( window ) {
    "use strict";

    var laundry = $ns("co.nclk.laundry");
    var Template = Object.create(laundry.HoquetTemplate);

    var voidAnchor = "javascript:void(0);";

    var init = [
      [ "div", { style: "margin: 20px" }
      , [ "div"
        , { class: "container" }
        , [ "div"
          , { class: "row" }
          , [ "nav"
            , { class: "col-md-3"
              , id: "tree-nav"
              }
            , [ "ul"
              , { class: "nav nav-pills nav-stacked" }
              , []
              ]
            ]
          , [ "div"
            , { class: "col-md-9 result-set-container" }
            , []
            ]
          ]
        ]
      ]
    ];

    function resultSet(rs, relation) {
        relation = relation || "default";
        return [
          [ "ol"
          , { class: "list-group"
            }
          , rs && rs.results.map(
                function(item) { return resultSetItem(item, relation) }
            )
          ]
        ];
    }

    function resultSetItem(item, relation) {
        return [
            [ "program", programResultSetItem ],
            [ "test_run", testRunResultSetItem ],
            [ "config_profile", defaultResultSetItem ],
            [ "default", defaultResultSetItem ]
        ].map(function(rel) {
            return relation == rel[0] &&
                [ "li"
                , { class: ["list-group-item", rel[0]]
                  }
                , rel[1](item) ];
        }).filter(function(x) { return x; });
    }

    function testRunResultSetItem(item) {
        return [
          [ "label"
          , [ "a"
            , { href: voidAnchor
              , "data-id": item.id
              }
            , [item.program_name, item.id].join(": ")
            ]
          ]
        , [ "p"
          , { class: [successStatusClass(item)
                     , "text-uppercase"
                     ]
            , style: "float:right;padding:2px 5px"
            }
          , item.status
          ]
        , [ "div"
          , { class: ["toggleable"]
            , style: ["display:none;"]
            }
          , [ "table"
            , { class: ["table", "table-striped"] }
            //, [ "thead"
            //  , [ "tr"
            //    , Object.keys(item).map(function(k) {
            //          return [ "td", {}, k ];
            //      })
            //    ]
            //  ]
            , [ "tbody"
              , Object.keys(item).map(function(k) {
                    return k !== "env" && 
                      k !== "related-resources" &&
                      item[k] && [
                      [ "tr"
                      , [ "th", {}, k ]
                      ,  [ "td", {}, item[k] ]
                      ]
                    ]
                })
              ]
            ]
          ]
        ];
    }

    function successStatusClass(item) {
        var n = item.num_failures;
        return "bg-" + (!n && item.status == "running" ? "primary"
            : !n ? "success"
            : "danger"
        );
    }

    function programResultSetItem(item) {
        return [
          [ "label"
          , [ "a"
            , { href: voidAnchor
              , "data-program_name": item.name
              }
            , item.name
            ]
          ] 
        ]
    }

    function programResultSetItemForm(pname, configs) {
        return (
          [ "form"
          , { class: ["toggleable"]
            //, style: ["display:none;"]
            }
          , [ "div"
            , configs.map(function(x) {
                  return [ "pre"
                         , { contenteditable: true
                           , class: ["extra-env"]
                           }
                         , JSON.stringify(x.data, false, 2)
                         ];
              })
            , [ "button"
              , { class: ["run-program","btn","btn-primary"]
                , "data-program_name": pname
                , type: "button"
                }
              , "Run"
              ]
            ]
          ]
        );
    }

    function defaultResultSetItem(item) {
        return [ "p", "created: " + item.created ];
    }

    function error(err) {
        return [ "div"
               , { class: "alert alert-danger" }
               , err.stack
               ];
    }

    function treeNavItems(resourceTypes) {
        return Object.keys(resourceTypes).reverse().map(function(type) {
            return [ "li"
                   , { class: "resource-type nav-item" }
                   , [ "a"
                     , { href: voidAnchor
                       , class: "nav-link"
                       , "data-relation": resourceTypes[type].relation
                       }
                     , type
                     ]
                   ];
        });
    }

    Object.defineProperties(Template, {
        init: { value: init },
        treeNavItems: { value: treeNavItems },
        resultSet: { value: resultSet },
        programResultSetItemForm: { value: programResultSetItemForm },
        error: { value: error }
    });
    Object.defineProperty(laundry, "Template", { value: Template });

})( this );

