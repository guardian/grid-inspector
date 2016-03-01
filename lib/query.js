import Rx from 'rx';
import {MediaApi} from './media-api.js'


const env = "PROD"
const search$ = MediaApi.search(env)
// const aggregate$ = MediaApi.aggregates(env)

export const Query = {
  result$: search$.map((result) => {
    // console.log(result);
    return result;
  }),

  // aggregate$: aggregate$.map((result) => {
  //   // console.log(result);
  //   return result;
  // })
} 
