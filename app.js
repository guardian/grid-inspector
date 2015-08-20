import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import Rx from 'rx';
import moment from 'moment';

import {$initThen, $sink} from './util';

import {input} from './components/input';
import {select} from './components/select';
import {button} from './components/button';
import {ternaryCheckbox} from './components/checkbox/ternary';

import {search, listEnvironments} from './media-api';
import {getPicdarViewUri} from './picdar';

// TODO: searching... spinner
// TODO: limit number of results by screen size?

// TODO: vs/as web component?

// TODO: move to util
const $combine = Rx.Observable.combineLatest;


function $container(tagName, views$, attributes = {}) {
    return $combine(...views$, (...views) => {
        return h(tagName, attributes, views);
    });
}


function memoize(func) {
    var ret;
    var called = false;
    return (...args) => {
        if (! called) {
            ret = func(...args);
            called = true;
        }
        return ret;
    };
}



function linkElement(href, children) {
    return h('a', {href: href}, children);
}

function imageElement(src) {
    return h('img', {src: src});
}

function renderFilterGroup(content) {
    return h('span', {className: 'filter-group'}, content);
}



function hasLink(resource, rel) {
    return resource.getLink(rel).then(_ => true, _ => false);
}

function results() {
    const prevButton = button('Previous');
    const nextButton = button('Next');

    const queryUpdated$ = new Rx.Subject;

    function resultsView(resultsResource) {
        const itemsDom = resultsResource.data.map(imageResource => {
            const {metadata, thumbnail, cost, uploadTime} = imageResource.data;
            const valid = imageResource.data.valid ? 'valid' : 'invalid';
            // FIXME: should always have an empty set of identifiers and usageRights
            const usageRights = imageResource.data.usageRights || {};
            const identifiers = imageResource.data.identifiers || {};
            const picdarUrn = identifiers.picdarUrn;
            // FIXME: use getLink (annoying as it returns a Promise that needs flatMapping)
            const uiHref = imageResource.links.find(link => link.rel === 'ui:image').href;
            return h('tr', [
                h('td', {className: 'image-row__image'},
                  linkElement(uiHref,
                              imageElement(thumbnail.secureUrl))
                ),
                h('td', {className: `image-row__validity validity validity--${valid}`}, valid),
                h('td', {className: `image-row__cost cost cost--${cost}`}, cost),
                h('td', imageResource.data.uploadedBy.replace(/@guardian.co.uk/, '')),
                h('td', {className: `image-row__category`}, usageRights.category),
                h('td', {className: `image-row__supplier`}, usageRights.supplier),
                h('td', {className: `image-row__collection`}, usageRights.suppliersCollection),
                h('td', {className: `image-row__credit`}, metadata.credit),
                h('td', {className: `image-row__byline`}, metadata.byline),
                h('td', metadata.source),
                h('td', metadata.copyright),
                h('td', {className: `image-row__uploaded`},
                  linkElement(imageResource.uri,
                              moment(uploadTime).format('YYYY-MM-DD HH:mm'))
                ),
                h('td', [
                    linkElement(getPicdarViewUri(picdarUrn), [picdarUrn])
                ]),
                h('td', {
                    className: 'image-row__description',
                    title: metadata.description
                }, metadata.description)
            ]);
        });
        const headings = [
            h('tr', [
                h('th', 'thumbnail'),
                h('th', 'valid'),
                h('th', 'cost'),
                h('th', 'uploader'),
                h('th', 'category'),
                h('th', 'supplier'),
                h('th', 'collection'),
                h('th', 'credit'),
                h('th', 'byline'),
                h('th', 'source'),
                h('th', 'copyright'),
                h('th', 'uploaded'),
                h('th', 'picdarUrn'),
                h('th', 'description')
            ])
        ];
        const resultsDom = h('table', headings.concat(itemsDom));
        const end = resultsResource.offset + resultsResource.length;

        const prev$ = Rx.Observable.fromPromise(hasLink(resultsResource, 'prev')).
                  filter(linked => linked === true).
                  flatMap(prevButton.tree$);
        const next$ = Rx.Observable.fromPromise(hasLink(resultsResource, 'next')).
                  filter(linked => linked === true).
                  flatMap(nextButton.tree$);
        const links$ = Rx.Observable.concat(prev$, next$).toArray();

        return links$.map(links => {
            const dom = h('div', [
                `${resultsResource.total} results (${resultsResource.offset}-${end})`,
                resultsDom,
                ...links
            ]);

            return dom;
        });
    }


    return {
        intents: {
            linkFollowed$: Rx.Observable.merge(
                prevButton.intents.activated$.map(_ => 'prev'),
                nextButton.intents.activated$.map(_ => 'next')
            )
        },
        view: resultsView
    };
}

function page() {
    const docKeyPress$ = Rx.Observable.fromEvent(document, 'keydown');
    const docShiftKeyPress$ = docKeyPress$.filter(ev => ev.shiftKey);
    const keyPrev$ = docShiftKeyPress$.filter(ev => ev.keyIdentifier === 'PageUp');
    const keyNext$ = docShiftKeyPress$.filter(ev => ev.keyIdentifier === 'PageDown');

    return {
        intents: {
            keyPrev$,
            keyNext$
        }
    };
}


const view = function() {
    const wholePage   = page();
    const resultsList = results();

    const queryInput       = input();
    const validityChoice   = ternaryCheckbox('valid', 'invalid');
    const costChoice       = ternaryCheckbox('free', 'pay');
    const picdarChoice     = ternaryCheckbox('picdar', 'non-picdar');
    const resultSizeChoice = select([10, 50, 100], 100);
    const envChoice        = select(listEnvironments(), 'PROD');
    const q = {
        env$:    envChoice.model.value$,
        length$: resultSizeChoice.model.value$,
        query$:  queryInput.model.value$,
        valid$:  validityChoice.model.value$,
        free$:   costChoice.model.value$,
        picdar$: picdarChoice.model.value$
    };

    // Stream of results from the query filters
    const searches$ = $combine(
        q.env$,
        q.length$,
        q.query$.map(q => q.trim()).throttle(500),
        q.valid$,
        q.free$,
        q.picdar$,
        (env, length, query, valid, free, picdar) => [{length, query, valid, free, picdar}, env]
    ).map(([params, env]) => {
        // Important: memoize result to avoid being re-evaluated when
        // this is merged and flatMapped over
        return memoize((/* lastSearch */) => {
            return Rx.Observable.fromPromise(search(env, params));
        });
    });

    // Stream of functions mapping previous search result to requests
    // of link follows
    const keyNav$ = Rx.Observable.merge(
        wholePage.intents.keyPrev$.map(_ => 'prev'),
        wholePage.intents.keyNext$.map(_ => 'next')
    );
    const nav$ = Rx.Observable.merge(
        keyNav$,
        resultsList.intents.linkFollowed$
    ).map(rel => {
        // Important: memoize result to avoid being re-evaluated when
        // this is merged and flatMapped over
        return memoize((lastSearch) => {
            return Rx.Observable.fromPromise(lastSearch.follow(rel).get());
        });
    });

    const results$ = Rx.Observable.merge(searches$, nav$).
        // Note: ok to seed with dummy search state as searches$ will
        // trigger first and it ignores the previous state
        scan(Rx.Observable.return({}), (acc, f) => acc.flatMap(f)).
        mergeAll();


    function renderTree() {
        const choicesViews$ = [
            validityChoice.tree$,
            costChoice.tree$,
            picdarChoice.tree$,
            envChoice.tree$,
            resultSizeChoice.tree$
        ].map(choice$ => choice$.map(renderFilterGroup));

        const queryView$ = $container('form', [
            queryInput.tree$,
            ...choicesViews$
        ]);

        const resultsView$ = results$.flatMapLatest(results => {
            return resultsList.view(results);
        });

        return $container('main', [queryView$, resultsView$]);
    }

    return {
        tree: renderTree
    };
};



const out = document.getElementById('out');

// TODO: use current DOM content:
// https://github.com/marcelklehr/vdom-virtualize/
const initialDom = h();

const theView = view();

theView.tree().
    startWith(initialDom).
    bufferWithCount(2, 1).
    map(([last, current]) => diff(last, current)).
    reduce((out, patches) => patch(out, patches), out).
    subscribe();
