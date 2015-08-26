import h from 'virtual-dom/h';

import Rx from 'rx';

import {labelledCheckbox} from './labelled';


const $combine = Rx.Observable.combineLatest;

export function flagCheckbox(label, initialState = false) {
    const cb = labelledCheckbox(label, initialState);
    return {
        model: {
            value$: cb.model.checked$.map(checked => checked ? true : undefined)
        },
        tree$: cb.tree$.map(view => h('span', view))
    };
};
