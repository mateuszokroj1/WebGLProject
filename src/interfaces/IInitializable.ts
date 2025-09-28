export interface IInitializable<TArgument> {
    get isInitialized(): boolean;
    
    initialize(argument: TArgument): Promise<void>;
}