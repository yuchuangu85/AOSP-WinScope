// The package exposes only an exports map; retain its exact types with this
// repo's legacy node module resolution without changing runtime resolution.
declare module 'micromark-util-symbol' {
  export const codes: typeof import('micromark-util-symbol/lib/codes').codes;
  export const constants: typeof import('micromark-util-symbol/lib/constants').constants;
  export const types: typeof import('micromark-util-symbol/lib/types').types;
  export const values: typeof import('micromark-util-symbol/lib/values').values;
}
