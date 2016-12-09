"use strict";

(function(global) {
	var Hoquet = function() {};

	Hoquet.prototype.render = function(a) {
		return arguments.length < 2 ? _render(a)
		: Array.prototype.map.call(arguments, _render, this).join("");
	};

	function isPrintable(tester) {
		return typeof tester === "string" || tester && isNumber(tester);
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function isInvalidTagName(tester) {
		return !tester || typeof tester !== "string" || isNumber(tester[0]);
	}

	function _render (a) {

		return isPrintable(a) ? a
		: !(a instanceof Array) ? ""
		: a[0] instanceof Array ? a.map(_render, this).join("")
		: isInvalidTagName(a[0]) ? new Error(a[0] + " is not a valid tag name.")
		: (function() {

			var
			last = a.length > 1 && a[a.length - 1],
			selfClosing = a.length > 2 ? false
			: typeof last === "undefined" ? false
			: last instanceof Array ? false
			: isPrintable(last) ? false
			: true;

			return a.map(function(form, i) {

				return i < 1 ? "<" + form
				: i === 1 &&
					form instanceof Object &&
					!(form instanceof Array) ? Object.keys(form).map(function(key) {
					return form[key] ? [
						" ",
						key,
						"=",
						"\"",
						( form[key] instanceof Array ? form[key].join(" ") : form[key] ),
						"\""
					].join("")
					: " " + key;
				}).join("") + (!selfClosing ? ">" : "")
				: (i === 1 && !selfClosing ? ">" : "") + (
					form instanceof Array && form.length ? _render(form)
					: isPrintable(form) ? form : ""
				);

			}).join("") + (
				!selfClosing ? "</" + a[0] + ">"
				: " />"
			);

		})();
	}

	if( typeof exports !== "undefined" ) {
		if( typeof module !== "undefined" && module.exports ) {
			exports = module.exports = new Hoquet;
		}
		//exports.hoquet = new Hoquet;
	}
	else {
		global.hoquet = new Hoquet;
	}

})( this );
