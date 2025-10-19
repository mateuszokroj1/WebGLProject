
export default class SharedMutex {
    private _obj = new Int32Array(new SharedArrayBuffer(4));

    public async lock(): Promise<void> {
        while(true) {
            const previous_value = Atomics.compareExchange(this._obj, 0, 0, 1);

            if(previous_value === 0)
                return;

            await Atomics.waitAsync(this._obj, 0, 1).value;
        }
    }

    public release(): void {
        const previous_value = Atomics.store(this._obj, 0, 0);

        if(previous_value == 1)
            Atomics.notify(this._obj, 0, 1);
    }
}