/**
 * @jest-environment jsdom
 */

const { canvas } = require("./canvas.js");
const canvasDoc = document.getElementById("canvas");

test("Mouse move event", () => {
    return canvas.then((result) => {
        expect(result).toBe(canvasDoc);
    });
});
