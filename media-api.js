import {Client} from 'theseus';
import {Http} from 'any-http-reqwest';

import apiUriByEnv from './media-api.config.json!';


const client = new Client({
    promise: Promise,
    http: new Http
});

function isDefined(val) {
    return typeof val !== 'undefined';
}

export function listEnvironments() {
    return Object.keys(apiUriByEnv);
};

export function search(env, {query, valid, free, picdar, offset = 0, length = 10}) {
    const apiUrl = apiUriByEnv[env];
    const api = client.resource(apiUrl);

    let queryParams = {
        // TODO: expose flag in UI
        // missingIdentifier: 'picdarUrn',
        // hasIdentifier: 'picdarUrn',
        q: query,
        offset: offset,
        length: length
    };

    // FIXME: nicer way to do this without mutations?
    if (isDefined(valid)) {
        queryParams.valid = valid;
    }
    if (isDefined(free)) {
        queryParams.free = free;
    }
    if (isDefined(picdar)) {
        if (picdar) {
            queryParams.hasIdentifier = 'picdarUrn';
        } else {
            queryParams.missingIdentifier = 'picdarUrn';
        }
    }

    return api.follow('search').get(queryParams, {withCredentials: true});
};
