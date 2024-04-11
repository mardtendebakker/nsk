export type FlattenKeys<T, Prefix extends string = ''> = T extends object
  ? {
    [K in keyof T & string as `${Prefix}${K}`]: K extends keyof T
      ? T[K] extends Array<unknown>
        ? K extends string
          ? `${Prefix}${K}.${number & string}`
          : never
        : FlattenKeys<T[K], `${Prefix}${K}.`>
      : never;
  }[keyof T & string]
  : Prefix;
