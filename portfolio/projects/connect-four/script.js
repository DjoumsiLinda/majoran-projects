(function () {
    var colIdx = 5;
    var rowIdx = 5;
    var echecBo = false;
    function anfang() {
        /*colIdx = prompt("Please enter a number of columns. Max number 9");
        rowIdx = prompt("Please enter a number of rows. max number 9");*/
        //console.log(colIdx, rowIdx);
        if (rowIdx >= 7 && rowIdx < 10) {
            var o = rowIdx - 6;
            var t = o * 10;
            $("#board").css({
                minHeight: 100 + t + "vh",
            });
        }

        if (
            (colIdx >= 1 && colIdx <= 9 && colIdx == parseInt(colIdx)) ||
            (rowIdx >= 1 && rowIdx <= 9 && rowIdx == parseInt(rowIdx))
        ) {
            //ajouter darbord les colonnes
            //console.log(colIdx, rowIdx);
            for (var e = 1; e <= colIdx - 1; e++) {
                var column = $("<div></div>").addClass("column");
                $("#board").prepend(column);
            }
            //ajouter ds chaque colonnes les hole et slote
            for (var z = 1; z <= rowIdx; z++) {
                var hole = $("<div></div>").addClass("hole");
                var slote = $("<div></div>").addClass("slot");
                slote.prepend(hole);
                $(".column").prepend(slote);
            }
            echecBo = true;
        } else {
            console.log("Max columns/rows ist 9 :)");
            $("#checker").css({
                visibility: "hidden",
            });
            $("#player").css({
                visibility: "hidden",
            });
            setTimeout(function () {
                $(".testWillkommen").css({
                    visibility: "visible",
                });
                $(".echec").css({
                    visibility: "visible",
                });
                $("document").addClass("echec");
            }, 1000);
            setTimeout(function () {
                $(".testWillkommen").css({
                    visibility: "hidden",
                });
                $(".echec").css({
                    visibility: "hidden",
                });
                $("document").removeClass("echec");
            }, 2000);
        }
    }
    anfang();
    if (echecBo === true) {
        $(".testWillkommen").css({
            visibility: "visible",
        });
        $(".willkommen").css({
            visibility: "visible",
        });
        $("document").addClass("willkommen");
        setTimeout(function () {
            $(".testWillkommen").css({
                visibility: "hidden",
            });
            $(".willkommen").css({
                visibility: "hidden",
            });
            $("document").removeClass("willkommen");
        }, 2000);
    }
})();

(function () {
    var currentPlayer = "player-1";
    var victory = false;
    // all our 42 slots
    var slots = $(".slot");
    var aktcolumn;

    // 1. approach: "brutefore": check every possible winning diagonal
    // Here is an array of all the possible winning diagonals:
    /*var diags = [
        // from left bottom to right top
        [3, 8, 13, 18],
        [4, 9, 14, 19, 24],
        [5, 10, 15, 20, 25, 30],
        [11, 16, 21, 26, 31, 36],
        [17, 22, 27, 32, 37],
        [23, 28, 33, 38],
        // from left top to right bottom
        [2, 9, 16, 23],
        [1, 8, 15, 22, 29],
        [0, 7, 14, 21, 28, 35],
        [6, 13, 20, 27, 34, 41],
        [12, 19, 26, 33, 40],
        [18, 25, 32, 39],
    ];*/

    /* function checkDiagonalVictory() {
        for (var i = 0; i < diags.length; i++) {
            console.log("CHECK");
            var array = diags[i].map(function (number) {
                return slots.eq(number);
            });
            console.log("array: ", array);
            var erg = checkVictory(array);
            if (erg === true) {
                return true;
            }
        }
        return false;
    }*/

    // 2. approach: "col+row / col-row"
    function checkDiagonalVictory(colIdx, rowIdx) {
        //console.log(rowIdx, colIdx);
        var colonnes = $(".column");
        var lignes = colonnes.eq(0).children();
        var arraySum = [];
        var arrayDiff = [];

        for (var a = 0; a < colonnes.length; a++) {
            for (var b = 0; b < lignes.length; b++) {
                // - calculate the sum of colIdx + rowIdx
                if (colIdx + rowIdx === a + b) {
                    arraySum.push(a * lignes.length + b);
                }
                if (colIdx - rowIdx === a - b) {
                    // - calculate the diff of colIdx - rowIdx
                    arrayDiff.push(a * lignes.length + b);
                }
            }
        }
        if (arraySum.length >= 4) {
            //console.log("Summe: ", arraySum);
            var arr = arraySum.map(function (number) {
                return slots.eq(number);
            });
            //console.log("array: ", arr);
            var erg = checkVictory(arr);
            if (erg === true) {
                //console.log("Diagonale ist: true ");
                return true;
            }
        }
        if (arrayDiff.length >= 4) {
            //console.log("Diffe: ", arrayDiff);
            var arr2 = arrayDiff.map(function (number) {
                return slots.eq(number);
            });
            // console.log("array: ", arr2);
            var erg2 = checkVictory(arr2);
            if (erg2 === true) {
                //console.log("Diagonale ist: true ");
                return true;
            }
        }
        return false;
    }

    function switchPlayer() {
        var player1 = $("#player-1");
        var player2 = $("#player-2");
        if (currentPlayer === "player-1") {
            currentPlayer = "player-2";
            player2.css({
                backgroundColor: "yellow",
            });
            player1.css({
                backgroundColor: "white",
            });
        } else {
            currentPlayer = "player-1";
            player1.css({
                backgroundColor: "red",
            });
            player2.css({
                backgroundColor: "white",
            });
        }
    }
    function animationVictory() {
        var colonnes = $(".column");
        var slots;
        var colIndex = [];
        var arrIndex = [];
        for (var z = 0; z <= colonnes.length; z++) {
            slots = colonnes.eq(z).children();
            for (var i = 0; i < slots.length; i++) {
                var h = i + 1;
                var slotsInRow = $(".slot:nth-child(" + h + ")");
                //console.log(slotsInRow);
                if (slots.eq(i).hasClass(currentPlayer)) {
                    if (
                        checkDiagonalVictory(z, i) === true ||
                        checkVictory(slots) === true ||
                        checkVictory(slotsInRow) === true
                    ) {
                        colIndex.push(z);
                        arrIndex.push(i);
                        //console.log("test ", colIndex, arrIndex);
                    }
                }
            }
        }
        for (var l = 0; l < arrIndex.length; l++) {
            var help = $(colonnes[colIndex[l]]).children();
            help.eq(arrIndex[l]).removeClass("holeSpring");
        }

        setTimeout(function () {
            for (var t = 0; t < arrIndex.length; t++) {
                var help2 = $(colonnes[colIndex[t]]).children();
                help2.eq(arrIndex[t]).addClass("holeSpring");
            }
        }, 10);
    }

    function checkVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if ($(slots[i]).hasClass(currentPlayer)) {
                count++;

                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    function gewinner() {
        $(".test").css({
            visibility: "visible",
        });
        $("#victory p").text(
            "🎈🎊🎊🎉🎉🎊🎊🎊🎉🎈🎈🎊🎊🎈" +
                currentPlayer +
                " hat gewonnen!" +
                "🎈🎊🎊🎉🎉🎊🎊🎊🎉🎈🎈🎊🎊🎈"
        );

        $("#play").on("click", function () {
            // console.log("Play Again :)");
            $(".test").css({
                visibility: "hidden",
            });
            resetPlay();
        });
        $("#ergebnis").on("click", function () {
            //console.log("Ergebnis sehen:)");
            $(".test").css({
                visibility: "hidden",
            });
            animationVictory();
        });
    }

    function resetPlay() {
        var columns = $(".column");
        var player1 = "player-1";
        var player2 = "player-2";
        var slots;
        for (var z = 0; z <= columns.length; z++) {
            slots = columns.eq(z).children();
            for (var i = 0; i < slots.length; i++) {
                if (slots.eq(i).hasClass(player1)) {
                    slots.eq(i).removeClass(player1);
                    slots.eq(i).removeClass("holeSpring");
                } else if (slots.eq(i).hasClass(player2)) {
                    slots.eq(i).removeClass(player2);
                    slots.eq(i).removeClass("holeSpring");
                }
            }
        }
        victory = false;
        var checker = $(".holeChecker");
        if (currentPlayer === "player-1") {
            checker.css({
                backgroundColor: "red",
            });
        } else {
            switchPlayer();
        }
    }
    function impossible() {
        if (
            $(".player-1, .player-2").length ===
            $(".column").length * $(".column").eq(0).children().length
        ) {
            //console.log("IMPOSSIBLE ");
            currentPlayer = "Niemand";
            gewinner();
        }
    }
    function move(curPlayer) {
        var checker = $(".holeChecker");
        var l = 470;
        var t;
        //var deplace = l;
        aktcolumn = 4;
        if (curPlayer === "player-1") {
            $(".holeChecker").css({
                backgroundColor: "yellow",
            });
        } else {
            $(".holeChecker").css({
                backgroundColor: "red",
            });
        }
        //console.log(currentPlayer);
        $(document).on("mousemove", function (event) {
            var co = $(".column");
            var link = $(co[0]).offset().left;
            var right = $(co[co.length - 1]).offset().left;
            // console.log(link, right, event.clientX);
            if (event.clientX >= link && event.clientX <= right) {
                l = event.clientX - 40;
                //deplace = Math.round(l / 10) * 10;
                l = l + "px";
                t = 20 + "px";
            }
            // console.log("mousemove", l, deplace);
            checker.css({
                left: l,
                top: t,
            });
        });
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ keydown
        /*$(document).on("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                console.log("Arrowleft: ", deplace);
                if (deplace >= 150 && deplace <= 740) {
                    deplace = deplace - 90;
                    l = deplace + "px";
                    t = 20 + "px";
                    aktcolumn--;
                }
                console.log("mousemove", l, event.clientX, event.clientY);
                checker.css({
                    left: l,
                    top: t,
                });
                if (deplace > 740) {
                    deplace = 150;
                    aktcolumn = 5;
                } else if (deplace < 150) {
                    deplace = 740;
                    aktcolumn = 1;
                }
            }
            if (event.key === "ArrowRight") {
                console.log("ArrowRight: ", deplace);
                if (deplace >= 30 && deplace <= 740) {
                    deplace = deplace + 90;
                    l = deplace + "px";
                    t = 20 + "px";
                    aktcolumn = aktcolumn + 1;
                }
                //console.log("mousemove", l, event.clientX, event.clientY);
                checker.css({
                    left: l,
                    top: t,
                });
                if (deplace >= 740 || deplace > 570) {
                    deplace = 30;
                    aktcolumn = 5;
                } else if (deplace < 30) {
                    deplace = 700;
                    aktcolumn = 1;
                }
            }
        });*/
    }

    function play() {
        $(".column").on("click", function () {
            if (victory === false) {
                //console.log(currentPlayer, "clicked on column", this);
                var col = $(this); // column that the player clicked on
                var slotsInCol = col.children(); // all slots in the column
                //console.log("slotsInCol", slotsInCol);
                move(currentPlayer);

                for (var i = slotsInCol.length - 1; i >= 0; i--) {
                    var slot = slotsInCol.eq(i);

                    // check if slot is free
                    if (
                        !slot.hasClass("player-1") &&
                        !slot.hasClass("player-2")
                    ) {
                        slot.addClass(currentPlayer);
                        break;
                    }
                }

                // column is already full
                if (i === -1) {
                    return;
                }

                var rowIdx = i + 1;
                var colIdx = $(".column").index(col);
                var slotsInRow = $(".slot:nth-child(" + rowIdx + ")");

                //console.log("slotsInRow", slotsInRow);
                victory =
                    checkVictory(slotsInCol) ||
                    checkVictory(slotsInRow) ||
                    checkDiagonalVictory(colIdx, rowIdx - 1); //||
                // checkDiagonalVictory(); // if you chose the 1st approach (no arguments)
                // checkDiagonalVictory(colIdx, rowIdx) // if you chose the 2nd approach (2 arguments);
                if (victory === true) {
                    animationVictory();
                    switchPlayer();
                    setTimeout(function () {
                        gewinner();
                    }, 1000);
                } else {
                    //si le jeux est impossible, il faudra reset
                    impossible();
                }

                switchPlayer();
            }
        });
        $(".buttonReset").on("click", function () {
            resetPlay();
        });
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ keydown
        $(document).on("keydown", function (evt) {
            if (evt.key === "Enter") {
                console.log("Enter: ", aktcolumn);
            }
        });
    }
    move("player-2");
    play();
})();
