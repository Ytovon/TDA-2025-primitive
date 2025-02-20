import { createCanvas, CanvasRenderingContext2D } from "canvas";

class BitmapGenerator {
  private static readonly CANVAS_SIZE = 300;
  private static readonly GRID_SIZE = 20;
  private static readonly LINE_WIDTH = 3;
  private static readonly GRID_COLOR = "#444";
  private static readonly X_COLOR = "#f00";
  private static readonly O_COLOR = "#0070bb";
  private static readonly BG_COLOR = "#000";

  static generateBitmap(board: (string | null)[][]): string  {
    const canvas = createCanvas(this.CANVAS_SIZE, this.CANVAS_SIZE);
    const ctx = canvas.getContext("2d");

    this.drawBackground(ctx);
    this.drawGrid(ctx);
    this.drawSymbols(ctx, board);

    return canvas.toBuffer("image/png").toString("base64");
  }

  private static drawBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.BG_COLOR;
    ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
  }

  private static drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.GRID_COLOR;
    for (let i = 0; i <= this.CANVAS_SIZE; i += this.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.CANVAS_SIZE);
      ctx.moveTo(0, i);
      ctx.lineTo(this.CANVAS_SIZE, i);
      ctx.stroke();
    }
  }

  private static drawSymbols(ctx: CanvasRenderingContext2D, board: (string | null)[][]): void {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const symbol = board[row][col];
        if (symbol === "X") {
          this.drawX(ctx, col, row);
        } else if (symbol === "O") {
          this.drawO(ctx, col, row);
        }
      }
    }
  }

  private static drawX(ctx: CanvasRenderingContext2D, col: number, row: number): void {
    ctx.lineWidth = this.LINE_WIDTH;
    ctx.strokeStyle = this.X_COLOR;
    ctx.beginPath();
    ctx.moveTo(col * this.GRID_SIZE + 5, row * this.GRID_SIZE + 5);
    ctx.lineTo(col * this.GRID_SIZE + 15, row * this.GRID_SIZE + 15);
    ctx.moveTo(col * this.GRID_SIZE + 15, row * this.GRID_SIZE + 5);
    ctx.lineTo(col * this.GRID_SIZE + 5, row * this.GRID_SIZE + 15);
    ctx.stroke();
  }

  private static drawO(ctx: CanvasRenderingContext2D, col: number, row: number): void {
    ctx.lineWidth = this.LINE_WIDTH;
    ctx.strokeStyle = this.O_COLOR;
    ctx.beginPath();
    ctx.arc(col * this.GRID_SIZE + 10, row * this.GRID_SIZE + 10, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default BitmapGenerator;