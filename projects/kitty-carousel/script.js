console.log("SANITY CHECK");

// IIFE (immediately function expression)
(function () {
    var slider = document.getElementById("slider");
    var images = slider.getElementsByTagName("img");
    var dot = document.getElementById("dots");
    var dots = dot.getElementsByClassName("dot");
    var transitioning = false;

    var timeoutId = null;

    var activeIdx = 0;

    //Dot erstelen
    for (var i = 0; i < images.length; i++) {
        var div = document.createElement("div");
        div.classList.add("dot");
        dot.appendChild(div);
    }
    //active la premire image
    dots[0].classList.add("on");

    function moveSlides(idx) {
        if (length == images.length) {
            idx = 0;
        }
        transitioning = true;

        // TODO: remove `on` class from inactive dot
        dots[activeIdx].classList.remove("on");
        images[activeIdx].classList.add("exit");

        if (typeof idx === "number") {
            activeIdx = idx;
        } else if (activeIdx < images.length - 1) {
            activeIdx++;
        } else {
            activeIdx = 0;
        }

        // TODO: add `on` class to active dot
        dots[activeIdx].classList.add("on");
        images[activeIdx].classList.add("onscreen");

        timeoutId = setTimeout(moveSlides, 5000);
    }

    timeoutId = setTimeout(moveSlides, 5000);

    slider.addEventListener("transitionend", function (event) {
        if (event.target.classList.contains("exit")) {
            event.target.classList.remove("onscreen");
            event.target.classList.remove("exit");
        }
    });

    Array.from(dots).forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
            console.log("user clicked on dot", idx);

            // TODO: if we have a currently active transition -> ignore click
            if (idx === activeIdx || transitioning === false) {
                console.log("user clicked on active dot -> ignoring click...");
                return;
            }

            // make sure to clear the old setTimeout,
            // to not have multiple timeout loops running in parallel
            clearTimeout(timeoutId);
            dot.classList.add("on");
            images[idx].classList.add("onscreen");

            // TODO: trigger slide animation to slide with idx
            moveSlides(idx);
        });
    });
})();
