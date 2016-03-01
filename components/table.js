import {h} from '@cycle/dom';
import Rx from 'rx';

import {Query} from '../lib/query.js';

import urls from '../config/urls.js';


export const TableComponent = () => {
  const result$ = Query.result$ 
  const viewerUrl = urls["viewer"]

  function view() {
    return result$.map((resultResource) => {

      function linkElement(href, children) {
        return h('a', {href: href}, children);
      }

      function imageElement(src) {
        return h('img', {src: src});
      }

      function frontendToPreviewUri(uri) {
        return uri.replace(
          "http://www.theguardian.com/",
          viewerUrl
        )
      }

      const payImageResources = resultResource.data.filter(
        (imageResource) => imageResource.data.cost != "free")

      const rows = payImageResources.map((imageResource) => { 
        const {metadata, thumbnail, cost, uploadTime} = imageResource.data;
        const usageRights = imageResource.data.usageRights || {};
        const usages =  imageResource.data.usages
        const uiHref = imageResource.links.find(link => link.rel === 'ui:image').href;

        const usageLinks = imageResource.data.usages.data.map(
          (usage) => usage.data.references
            .filter((ref) => (ref.type == "composer" || ref.type == "frontend"))
            .map((ref) => linkElement(frontendToPreviewUri(ref.uri), ref.name || ref.type)))
          .reduce((a,b) => a.concat(b))

        const usageLinkList = h('ul', usageLinks.map((a) => h('li', a)))

        return h('tr', [
            h('td', {className: 'image-row__image'}, 
              linkElement(uiHref, imageElement(thumbnail.secureUrl))
            ),
            h('td', {className: `image-row__cost cost cost--${cost}`}, cost),
            h('td', {className: `image-row__category`}, usageRights.category),
            h('td', {className: `image-row__supplier`}, usageRights.supplier),
            h('td', {className: `image-row__collection`}, usageRights.suppliersCollection),
            h('td', {className: `image-row__credit`}, metadata.credit),
            h('td', {className: `image-row__byline`}, metadata.byline),
            h('td', metadata.source),
            h('td', {className: `image-row__usage-links`}, usageLinkList) 
        ])
      })

      const headings = [
        h('tr', [
            h('th', 'image'),
            h('th', 'cost'),
            h('th', 'category'),
            h('th', 'supplier'),
            h('th', 'collection'),
            h('th', 'credit'),
            h('th', 'byline'),
            h('th', 'source'),
            h('th', 'links')
        ])
      ];

      return h('table', headings.concat(rows));
    })
  }

  const vtree$ = view();

  return {
    DOM: vtree$,
  };
}
