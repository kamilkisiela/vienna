import * as merge from 'lodash.merge';

import * as notes from './notes';
export { schema } from './schema';

export const resolvers = merge({}, notes.resolvers);
export const defaults = merge({}, notes.defaults);
