(() => {
    const _resolveImport = file => {
        return (function recur(doc) {
            const imports = doc.querySelectorAll(`link[rel="import"]`);
            return Array.prototype.reduce.call(imports, function(p, c) {
                return p || (
                    ~c.href.indexOf(file)
                        ? c.import
                        : recur(c.import)
                );
            }, null);
        })(window.document);
    }

    const _getCookie = (name) => document.cookie.split(";")
        .map(
            x => x.split("=")
        ).reduce(
            (p, c) => c[0] === name ? c[1] : p, ""
        );

    window.Sut = window.Sut || Object.create(null);

    Object.defineProperty(window.Sut, "_resolveImport", {
        value: _resolveImport
    });

    Object.defineProperty(window.Sut, "_getCookie", {
        value: _getCookie
    });
})();
