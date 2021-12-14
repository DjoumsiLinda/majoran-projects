(function () {
    // client-side JavaScript.
    // canvas logic goes here (mouse event listeners)...

    const canvas = document.getElementById("canvas");
    const inputField = $(".petition .imageCanvas input");
    let ctx = canvas.getContext("2d");
    let checkDraw = false;
    let x = 0;
    let y = 0;

    canvas.addEventListener("mousedown", function (event) {
        //event.offsetX: read-only property of the MouseEvent interface provides the offset in the X coordinate of the mouse pointer between that event and the padding edge of the target node.
        x = event.offsetX; //x_von
        y = event.offsetY; //y_von
        checkDraw = true;
    });
    canvas.addEventListener("mousemove", function (event) {
        if (checkDraw) {
            //method Zeichnen zeichnen die line
            //event.offsetX, event.offsetY represente le x_bis et le y_bis
            zeichnen(x, y, event.offsetX, event.offsetY);
            x = event.offsetX; //x_von
            y = event.offsetY; //y_von
        }
    });

    canvas.addEventListener("mouseup", function (event) {
        if (checkDraw) {
            //event.offsetX, event.offsetY represente le x_bis et le y_bis
            zeichnen(x, y, event.offsetX, event.offsetY);
            x = 0;
            y = 0;
            checkDraw = false;
            signatures();
        }
    });

    function zeichnen(x_von, y_von, x_bis, y_bis) {
        ctx.strokeStyle = "black"; // line color
        ctx.lineWidth = 3; // line thickness; we can leave out the unit
        ctx.beginPath();
        ctx.moveTo(x_von, y_von);
        ctx.lineTo(x_bis, y_bis);
        ctx.stroke();
        ctx.closePath();
    }
    function signatures() {
        inputField.val(canvas.toDataURL());
        //console.log(inputField.val());
    }
})();
