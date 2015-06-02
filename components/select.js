import h from 'virtual-dom/h';

import Rx from 'rx';

import {$initThen, $sink} from '../util';


function optionElement(name, value, selected = false) {
    return h('option', {
        name: name,
        selected: selected
    }, `${value}`);
    // Note: ^ must be a string to result in text node
}

function selectElement(options, value, changes$) {
    const optionEls = options.map(option => {
        return optionElement(option, option, option === value);
    });
    return h('select', {
        onchange: $sink(changes$)
    }, optionEls);
}

function selectView(options) {
    const changes$ = new Rx.Subject;
    return {
        events: {
            changes$: changes$.asObservable()
        },
        render(value) {
            return selectElement(options, value, changes$);
        }
    };
}

function selectModel(intent, initialOption) {
    return {
        value$: $initThen(initialOption, intent.changeOption$)
    };
}

function selectIntent(view) {
    return {
        changeOption$: view.events.changes$.
            map(ev => ev.target.value)
    };
}

export function select(options, initialOption) {
    const view = selectView(options);
    const intent = selectIntent(view);
    const model = selectModel(intent, initialOption);

    return {
        model: model,
        tree$: model.value$.map(view.render)
    };
};
