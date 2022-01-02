console.log($);

var panes = $(".panes");
var after = $(".after");
var bar = $(".bar");
var mouse = false;

bar.on("mousedown", function () {
    console.log("mousedown on bar");
    mouse = true;
});

$(document).on("mouseup", function () {
    console.log("mouseup");
    mouse = false;
});
$(document).on("mousemove", function (evt) {
    if (mouse === false) {
        return;
    }

    var left = evt.pageX - panes.offset().left;

    // tt dabord verifie si le mouvement de la souris est dans le cadre de limage
    //belibiege argument/teil sichbar machen clipPath: "inset( top bottom right left)"
    if (left >= 0 && left <= panes.outerWidth()) {
        bar.css({ left: left });
        after.css({
            clipPath: "inset(0 0 0 " + left + "px)",
        });
    }
});
