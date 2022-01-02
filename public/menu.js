(function () {
    var overlay = document.querySelector("#overlay");

    document.querySelector("#menu").addEventListener("click", function () {
        if (overlay.classList.contains("on")) {
            overlay.classList.remove("on");
        } else {
            overlay.classList.add("on");
        }
    });

    document.querySelector("#overlay").addEventListener("click", function () {
        overlay.classList.remove("on");
    });
    document.querySelector("#lef").addEventListener("click", function () {
        overlay.classList.remove("on");
    });
})();
