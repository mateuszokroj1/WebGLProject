export interface IInitializable {
    get isInitialized(): boolean;
    
    initialize(canvas: HTMLCanvasElement): Promise<void>;
}