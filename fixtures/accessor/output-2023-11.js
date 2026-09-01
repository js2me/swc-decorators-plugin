import { _ as _apply_decs_2311 } from "@swc/helpers/_/_apply_decs_2311";
let _init_value, _init_extra__init_value;
class Store {
    static{
        ({ e: [_init_value, _init_extra__init_value] } = _apply_decs_2311(this, [], [
            [
                observable,
                1,
                "value"
            ]
        ]));
    }
    #___private_value_1 = (()=>{
        const _value = _init_value(this, 1);
        _init_extra__init_value(this);
        return _value;
    })();
    get value() {
        return this.#___private_value_1;
    }
    set value(_v) {
        this.#___private_value_1 = _v;
    }
}
