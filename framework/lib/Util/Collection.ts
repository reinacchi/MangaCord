export class Collection<T> extends Map<string, T> {
    constructor() {
        super();
    }

    public filter(func: (i: T) => boolean): T[] {
        const arr: any[] = [];

        for (const item of this.values()) {
            if (func(item)) {
                arr.push(item);
            }
        }

        return arr;
    }

    public find(func: (i: T) => boolean): T | undefined {
        for (const item of this.values()) {
            if (func(item)) {
                return item;
            }
        }

        return undefined;
    }

    public map<R>(func: (i: T) => R): R[] {
        const arr: any[] = [];

        for (const item of this.values()) {
            arr.push(func(item));
        }

        return arr;
    }

    public some(func: (i: T) => boolean): boolean {
        for (const item of this.values()) {
            if (func(item)) {
                return true;
            }
        }

        return false;
    }
}
