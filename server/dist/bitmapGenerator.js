import { createCanvas } from "canvas";
class BitmapGenerator {
    static generateBitmap(board) {
        // Create a 300x300 canvas
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext("2d");
        // Draw the grid
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 300, 300);
        ctx.strokeStyle = "#444";
        // Draw the grid lines
        for (let i = 0; i <= 300; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 300);
            ctx.moveTo(0, i);
            ctx.lineTo(300, i);
            ctx.stroke();
        }
        // Draw the symbols (X and O)
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const symbol = board[row][col];
                if (symbol === "X") {
                    ctx.lineWidth = 3; // Set the line thickness to 3 units
                    ctx.strokeStyle = "#f00";
                    ctx.beginPath();
                    ctx.moveTo(col * 20 + 5, row * 20 + 5);
                    ctx.lineTo(col * 20 + 15, row * 20 + 15);
                    ctx.moveTo(col * 20 + 15, row * 20 + 5);
                    ctx.lineTo(col * 20 + 5, row * 20 + 15);
                    ctx.stroke();
                }
                else if (symbol === "O") {
                    ctx.lineWidth = 3; // Set the line thickness to 3 units
                    ctx.strokeStyle = "#0070bb";
                    ctx.beginPath();
                    ctx.arc(col * 20 + 10, row * 20 + 10, 5, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
        // Return the Base64-encoded bitmap
        return canvas.toBuffer("image/png").toString("base64");
    }
}
export default BitmapGenerator;
//# sourceMappingURL=bitmapGenerator.js.map