(function () {
    /* var ticker = document.getElementById("ticker");
console.log("ticker", ticker);
var left = ticker.offsetLeft;
console.log("left:", left);
function move() {
    left--;
    /*ist ein callback function , le browseer wird sesuchen 60 mal pro sekunde dises aufzurufen.
    Le Nbre de fois/le nbre de temps nest pas presicer*/
    // var firstHeadline = document.querySelector("#ticker a");
    /* var firstHeadline = ticker.querySelector("a");

    if (left <= -firstHeadline.offsetWidth) {
        left = 0; //left recommence a compte a 0 et lalignement des text seront left de 0
        ticker.appendChild(firstHeadline); //ajpute le premier element a la fin de la liste
    }

    // don't forget to add the unit! (px)
    ticker.style.left = left + "px";

    requestAnimationFrame(move);
}
move();*/

    //le code ci haut fontion bien mais nes pas efficient/pas pr un bon programmeur. Autre solition voir les ligne suivante

    var ticker = document.getElementById("ticker");

    // HTMLCollection are LIVE, +++++++++++++++++++++++++++++++++++++++++++++++++++ HTMCollection are live
    // therefore, links[0] will always be a reference to the currently first headline,
    // even when we move them around with appendChild.
    var links = ticker.getElementsByTagName("a");
    var left = ticker.offsetLeft;
    console.log("+++++++++++++++++++++++++", left);
    var rafId; // global scope. enregistre le nbre de fois que requestAnimationFrame est appele

    function move() {
        left--;

        // firstHeadline is completely offscreen
        if (left <= -links[0].offsetWidth) {
            left = 0; //left recommence a compte a 0 et lalignement des text seront left de 0
            ticker.appendChild(links[0]); //ajpute le premier element a la fin de la liste
        }

        // don't forget to add the unit! (px)
        ticker.style.left = left + "px";

        rafId = requestAnimationFrame(move); // returns a unique id
    }

    move();

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ suite et fin
    /*ticker.addEventListener("mouseenter", function () {
    console.log("mouseenter");

    // pause ticker
    cancelAnimationFrame(rafId);
});

ticker.addEventListener("mouseleave", function () {
    console.log("mouseleave");

    // TODO: resume ticker
    move();
});*/

    //++++++++++++++++++++++++++++ajoute la couleur bleu et souligne lorsquil ya event
    for (var link of links) {
        // console.log(link.textContent);

        link.addEventListener("mouseenter", function (event) {
            // link is a reference to the very last headline,
            // because the for-loop already went through all iterations
            // console.log(link);
            // but evt.target will get us the correct link

            event.target.style.textDecoration = "underline";
            event.target.style.color = "blue";
            cancelAnimationFrame(rafId);
        });

        link.addEventListener("mouseleave", function (event) {
            event.target.style.textDecoration = "none";
            event.target.style.color = "black";
            move();
        });
    }
})();
