

export class Logger {
    // private _nameModul: string;
    constructor(private _nameModul: string = 'Logger') {
    }
    set name(name: string) {
        this._nameModul = name;
        // this.debug('Logger  Started');
    }

    get name() {
        return this._nameModul;
    }
    /**
     * debug
     */
    public debug(message: any, ...arg: any) {
        if (arg.length > 0) {
            console.log(`INFO ${this.getTime()} [${this._nameModul}] ${message}`, ...arg);
        } else {
            console.log(`INFO ${this.getTime()} [${this._nameModul}] ${message}`);
        }
    }

    /**
     * info
     */
    public info(message: any, ...arg: any) {
        if (arg.length > 0) {
            console.log(`INFO ${this.getTime()} [${this._nameModul}] ${message}`, ...arg);
        } else {
            console.log(`INFO ${this.getTime()} [${this._nameModul}] ${message}`);
        }
    }

    /**
     * error
     */
    public error(message: any, ...arg: any) {
        if (arg.length > 0) {
            console.log(`%cERROR ${this.getTime()} [${this._nameModul}] ${message}`, 'color: #ff3928', ...arg);
        } else {
            console.log(`%cERROR ${this.getTime()} [${this._nameModul}] ${message}`, 'color: #ff3928');
        }
    }

    /**
    * warn #ff9528
    */
    public warn(message: any, ...arg: any) {
        if (arg.length > 0) {
            console.log(`%cINFO ${this.getTime()} [${this._nameModul}] ${message}`, 'color: #ff9528', ...arg);
        } else {
            console.log(`%cINFO ${this.getTime()} [${this._nameModul}] ${message}`, 'color: #ff9528');
        }
    }

    public getTime(): string {
        const d = new Date();
        const h = d.getHours();
        const H = (h < 10) ? '0' + h : h;
        const m = d.getMinutes();
        const M = (m < 10) ? '0' + m : m;
        const s = d.getSeconds();
        const S = (s < 10) ? '0' + s : s;
        const Ms = d.getMilliseconds();
        return `${H}:${M}:${S}.${Ms}`;
    }
}
