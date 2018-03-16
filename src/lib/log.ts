import { logPrefix } from './createApi';

export type Log = (val: string) => void

export const warnLog: Log = (val) => { console.warn(`${logPrefix}${val}`) };
export const errorLog: Log = (val) => { console.error(`${logPrefix}${val}`) };
export const normalLog: Log = (val) => { console.log(`${logPrefix}${val}`) };