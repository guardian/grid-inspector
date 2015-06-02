import Rx from 'rx';


// FIXME: not exporting correctly?
// export var $combine = Rx.Observable.combineLatest;

export function $init(value) {
    return Rx.Observable.return(value);
};

// Note: lazyConcat must be a lazy lambda as JS doesn't support call-by-name
export function $initThen(value, nextValues$) {
    return $init(value).concat(nextValues$);
};


export function $sink(subject) {
    return (value) => subject.onNext(value);
};
