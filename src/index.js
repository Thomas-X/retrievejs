require("babel-core/register");
import 'babel-polyfill'
import { query } from './query';
import { createApi} from './createApi';

export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';
export const HEAD = 'head';
export const OPTIONS = 'options';
export const logPrefix = 'RETRIEVEJS: ';

export { query, createApi };