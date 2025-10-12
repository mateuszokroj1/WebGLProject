export default class Mutex {
    private is_locked: boolean = false;
    
    async lock(): Promise<void> {
        while (this.is_locked) {
            await new Promise(resolve => setTimeout(resolve, 5));
        }

        this.is_locked = true;
        return;
    }

    release(): void {
        this.is_locked = false;
    }
}