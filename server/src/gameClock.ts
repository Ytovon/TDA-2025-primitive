export class GameClock {
    private playerTimes: { [key: string]: number };
    private currentPlayer: string | null = null;
    private lastMoveTime: number | null = null;
    private interval: NodeJS.Timeout | null = null;
    private onTimeOut: (player: string) => void;
 
    constructor(private startingTime: number = 8 * 60 * 1000, onTimeOut: (player: string) => void) {
      this.playerTimes = {
        X: startingTime,
        O: startingTime,
      };
      this.onTimeOut = onTimeOut;
    }
 
    startTurn(player: 'X' | 'O') {
      if (this.currentPlayer) {
        this.stopClock();
      }
      this.currentPlayer = player;
      this.lastMoveTime = Date.now();
 
      this.interval = setInterval(() => {
        if (this.lastMoveTime !== null && this.currentPlayer) {
          const now = Date.now();
          const elapsed = now - this.lastMoveTime;
          this.playerTimes[this.currentPlayer] -= elapsed;
          this.lastMoveTime = now;
 
          if (this.playerTimes[this.currentPlayer] <= 0) {
            this.playerTimes[this.currentPlayer] = 0;
            this.stopClock();
            this.onTimeOut(this.currentPlayer);
          }
        }
      }, 100);
    }
 
    stopClock() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.lastMoveTime !== null && this.currentPlayer) {
        const now = Date.now();
        const elapsed = now - this.lastMoveTime;
        this.playerTimes[this.currentPlayer] -= elapsed;
        this.lastMoveTime = null;
      }
    }
 
    getTime(player: 'X' | 'O'): number {
      return this.playerTimes[player];
    }
 
    isTimeUp(player: 'X' | 'O'): boolean {
      return this.playerTimes[player] <= 0;
    }
  }
 
 