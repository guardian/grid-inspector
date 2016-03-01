import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import Rx from 'rx';

import {TableComponent} from './components/table.js'


function intent(DOM) {
  return {};
}

function model(actions) {
  return Rx.Observable.just(1)
}

function view(state) {

  const table = TableComponent();

  return state.map(() =>
    h('div', [
      h('h1', 'Usage By Supplier'),
      table.DOM
    ])
  );
}

function main({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container')
});
