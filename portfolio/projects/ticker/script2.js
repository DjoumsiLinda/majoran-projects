(function () {
    //ici je cherche a sauvegarde la valeur de le car les deux js doivent ccer le meme moment
    var tick = document.getElementById("ticker");
    var le = tick.offsetLeft;

    //cloner le id=ticket du html
    var ticker = document.getElementById("ticker").cloneNode(true);
    //effacer le id du ticket ds le html
    ticker.id = "";
    //effacer tt les element(left, right, ..) utiliser ds le css
    //effacer le positionement de gauche du ticker car il a ete utilise ds le css
    ticker.style.left = "";

    //ajouter le ticker ds le document/html
    document.body.appendChild(ticker);

    //creer une nouvelle class nomme unten et travaille avec
    ticker.classList.add("unten");
    var rechts = ticker.getElementsByTagName("a");

    console.log(ticker);
    // HTMLCollection are LIVE, +++++++++++++++++++++++++++++++++++++++++++++++++++ HTMCollection are live
    // therefore, links[0] will always be a reference to the currently first headline,
    // even when we move them around with appendChild.
    //var links = ticker.getElementsByTagName("a");
    var right = le;
    var rafId; // global scope. enregistre le nbre de fois que requestAnimationFrame est appele

    function move() {
        right--;
        if (right <= -rechts[0].offsetWidth) {
            right = 0; //right recommence a compte a 0 et lalignement des text seront left de 0
            ticker.prepend(rechts[5]); //ajpute le dernier element au debut de la liste
        }

        // don't forget to add the unit! (px)
        ticker.style.right = right + "px";

        rafId = requestAnimationFrame(move); // returns a unique id
    }

    move();

    //++++++++++++++++++++++++++++ajoute la couleur bleu et souligne lorsquil ya event
    for (var recht of rechts) {
        // console.log(link.textContent);

        recht.addEventListener("mouseenter", function (event) {
            // recht is a reference to the very last headline,
            // because the for-loop already went through all iterations
            // console.log(link);
            // but evt.target will get us the correct link

            event.target.style.textDecoration = "underline";
            event.target.style.color = "blue";
            cancelAnimationFrame(rafId);
        });

        recht.addEventListener("mouseleave", function (event) {
            event.target.style.textDecoration = "none";
            event.target.style.color = "black";
            move();
        });
    }
})();
