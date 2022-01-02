// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Hambuger Menu

// Lorque lutilisateur clique sur le button hamburgermenu, il faudra
//ajouter une class on ds le html sur la meme ligne que le id overlay car ds le css
//le overlay a ete implimente et grace a la class on lutilisateur pourra voir tout les element
// inscrit ds le overlay
var overlay = document.querySelector("#overlay");

//lutilisateur clique sur le button hamburgermenu, il faudra ajoute une class on
document.querySelector(".hamburgermenu").addEventListener("click", function () {
    overlay.classList.add("on");
});

//lutilisateur clique sur un des elements(setting, upgrade,...), il faudra quitte de la class on
document.querySelector("#overlay").addEventListener("click", function () {
    overlay.classList.remove("on");
});

//lutilisateur clique sur le button X, il faudra quitte de la class on
document.querySelector(".btnX").addEventListener("click", function () {
    overlay.classList.remove("on");
});

// 4. think about event bubbling:
// - menu should NOT close when user clicks somewhere inside the menu
// - you might need to add another event listener on #menu to prevent event bubbling

/*document.querySelector("#menu").addEventListener("click", function (event) {
    event.stopPropagation();
});*/
