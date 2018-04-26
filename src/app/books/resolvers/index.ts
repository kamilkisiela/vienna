import * as merge from 'lodash.merge';

import * as books from './books';
import * as collections from './collections';
export { schema } from './schema';

export const resolvers = merge({}, books.resolvers, collections.resolvers);
export const defaults = merge({}, books.defaults, collections.defaults);
