(function ( window ) {
	"use strict";

	// Get element(s) by CSS selector:
	window.qs = function (selector, scope) {
		return (scope || window.document).querySelector(selector);
	};
	window.qsa = function (selector, scope) {
		return (scope || window.document).querySelectorAll(selector);
	};

	// addEventListener wrapper:
	window.$on = function (target, type, callback, useCapture) {
		target instanceof NodeList ? Array.prototype.forEach.call(
			target,
			function(x) { window.$on(x, type, callback, useCapture); }
		)
		: target.addEventListener(type, callback, !!useCapture);
	};

	// Attach a handler to event for all elements that match the selector,
	// or whose parents match the selector now or in the future,
	// based on and up to a root element
	window.$delegate = function (root, selector, type, handler, depth) {
		window.$on(
			root,
			type,
			function (event) {
				var target = event.target;
				return (function(potentialElements) {
					return (function recur(el, depth) {
						return !el ? false
						: el === root ? false
						: ~Array.prototype.indexOf.call(
							potentialElements,
							el
						) && (target = el) || depth && recur(
							el.parentNode,
							depth - 1
						);
					})(target, typeof depth !== "undefined" ? depth : 0) && handler.call(
						target, event
					);
				})(qsa(selector, root));
			},
			type === 'blur' || type === 'focus'
		);
	};

	// Find the element's parent with the given tag name:
	// $parent(qs('a'), 'div');
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase()
				=== tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	window.$ns = function (ns, context) {
		var ns = !ns ? []
		: !ns.length ? []
		: typeof ns !== "string" ? []
		: ns.split(".");

		context = context || window;

		while (ns.length) {
			var name = ns.shift();
			Object.defineProperty(context, name, {
				value: context[name] || Object.create(null)
			});
			context = context[name];
		}
		return context;
	};

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	//NodeList.prototype.forEach = Array.prototype.forEach;
	// XXX: not sure we should be messing with the prototype
})( this );
