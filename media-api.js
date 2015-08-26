import {Client} from 'theseus';
import {Http} from 'any-http-reqwest';

import apiUriByEnv from './config/media-api.json!';


const client = new Client({
    promise: Promise,
    http: new Http({
        withCredentials: true
    })
});

function isDefined(val) {
    return typeof val !== 'undefined';
}

function cleanUndefinedProps(dirty) {
    return Object.keys(dirty).reduce((clean, key) => {
        if (isDefined(dirty[key])) {
            clean[key] = dirty[key];
        }
        return clean;
    }, {});
}

function getPicdarParams(hasIdentifier) {
    if (isDefined(hasIdentifier)) {
        if (hasIdentifier) {
            return {hasIdentifier: 'picdarUrn'};
        } else {
            return {missingIdentifier: 'picdarUrn'};
        }
    }

    return {};
}

export function listEnvironments() {
    return Object.keys(apiUriByEnv);
};

export function search(env, {query, valid, free, picdar, costModelDiff, offset = 0, length = 10}) {
    const apiUrl = apiUriByEnv[env];
    const api = client.resource(apiUrl);

    let queryParams = {
        // TODO: expose flag in UI
        // missingIdentifier: 'picdarUrn',
        // hasIdentifier: 'picdarUrn',
        q: query,
        offset,
        length,
        valid,
        free,
        costModelDiff
    };

    const cleanQueryParams = cleanUndefinedProps(queryParams);
    const picdaredQueryParams = Object.assign({}, cleanQueryParams, getPicdarParams(picdar));

    return api.follow('search').get(picdaredQueryParams, {withCredentials: true});
};
