import Rx from 'rx';

import {Client} from 'theseus';
import {Http} from 'any-http-reqwest';

import apiUriByEnv from '../config/media-api.json!';


const client = new Client({
    promise: Promise,
    http: new Http({
        withCredentials: true
    })
});

export const MediaApi = {
  search: function search(env) {
    const apiUrl = apiUriByEnv[env];
    const api = client.resource(apiUrl);

    return Rx.Observable.fromPromise(
      api.follow('search').get({
        length: 100,
        usageStatus: 'pending',
        usagePlatform: 'digital',
        orderBy: '-usages.lastModified'
      }, {withCredentials: true})
    );
  },

  aggregates: function (env) {
    const apiUrl = apiUriByEnv[env];
    const api = client.resource(apiUrl + '/images/metadata/credit' );
    return Rx.Observable.fromPromise(
      api.get()
    );
  }
};
