import { _ as _apply_decs_2311 } from "@swc/helpers/_/_apply_decs_2311";
let _initClass, _initProto;
let _Service, _Service_member;
class Service {
    static{
        ({ e: [_initProto], c: [_Service, _initClass] } = _apply_decs_2311(this, [
            sealed
        ], [
            [
                logged,
                2,
                "run"
            ]
        ]));
    }
    constructor(){
        _initProto(this);
    }
    run() {
        return 'ok';
    }
    static{
        _initClass();
        _Service_member = _Service;
    }
}
