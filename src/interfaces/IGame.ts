export default interface IGame {
  assignRenderer(): void;
    start(): void;
    stop(): void;
    zoom(): void;
    move(): void;

}