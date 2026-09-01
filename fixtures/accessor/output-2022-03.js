import { _ as _apply_decs_2203_r } from "@swc/helpers/_/_apply_decs_2203_r";
var _init_value, _initProto;
class Store {
    static{
        ({ e: [_init_value, _initProto] } = _apply_decs_2203_r(this, [
            [
                observable,
                1,
                "value"
            ]
        ], []));
    }
    #___private_value_1 = (_initProto(this), _init_value(this, 1));
    get value() {
        return this.#___private_value_1;
    }
    set value(_v) {
        this.#___private_value_1 = _v;
    }
}
