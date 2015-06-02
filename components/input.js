import h from 'virtual-dom/h';

import Rx from 'rx';

import {$initThen, $sink} from '../util';


function inputElement(value, changes$) {
    return h('input', {
        type: 'text',
        value: value,
        oninput: $sink(changes$)
    });
}


function inputView() {
    const changes$ = new Rx.Subject;
    return {
        events: {
            changes$: changes$.asObservable()
        },
        render(value) {
            return inputElement(value, changes$);
        }
    };
}

function inputModel(intent) {
    return {
        value$: $initThen('', intent.changed$)
    };
}

function inputIntent(view) {
    return {
        changed$: view.events.changes$.
            map(ev => ev.target.value)
    };
}


// TODO: control disabled
// TODO: allow external setting of value
export function input() {

    const view = inputView();
    const intent = inputIntent(view);
    const model = inputModel(intent);

    return {
        model: model,
        tree$: model.value$.map(view.render)
    };
};
