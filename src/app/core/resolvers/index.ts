import * as merge from 'lodash.merge';

import * as layout from './layout';
export { schema } from './schema';

export const resolvers = merge({}, layout.resolvers);
export const defaults = merge({}, layout.defaults);
