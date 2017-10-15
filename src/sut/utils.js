(() => {

    const _getCookie = (name) => document.cookie.split(";")
        .map(
            x => x.split("=")
        ).reduce(
            (p, c) => c[0] === name ? c[1] : p, ""
        );

    const _fetch = (el, req, options, reject, resolve) => {

        el.dispatchEvent(new CustomEvent("request", {
            composed: true,
            bubbles: true
        }));

        fetch(req, options).then(resp => {
            if (!resp.ok) {
                el.dispatchEvent(new CustomEvent("response", {
                    composed: true,
                    bubbles: true
                }));
                reject(resp);
            } else resp.json().then(data => {
                el.dispatchEvent(new CustomEvent("response", {
                    composed: true,
                    bubbles: true
                }));
                resolve(data);
            });
        });
    };

    window.Sut = window.Sut || Object.create(null);
    window.Utils = Object.create(null);

    Object.defineProperty(window.Utils, "_getCookie", {
        value: _getCookie
    });
    Object.defineProperty(window.Utils, "fetch", {
        value: _fetch
    });
})();
