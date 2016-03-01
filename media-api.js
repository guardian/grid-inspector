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
   search: function search(env) {
    const apiUrl = "https://api.media.gutools.co.uk";
    const api = client.resource(apiUrl);

    return Rx.Observable.fromPromise(
      api.follow('search').get({
        length: 100,
        usageStatus: 'pending',
        usagePlatform: 'digital',
        orderBy: '-usages.lastModified'
      }, {withCredentials: true})
    );
  }
};
