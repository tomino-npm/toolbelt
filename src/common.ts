declare global {
  interface String {
    url(): string;
    interpolate(params: any): string;
    safeFilePath(): string;
  }
}

export interface Indexable<T> {
  [index: string]: T;
}

export interface Group<T> {
  key: string | number;
  values: T[];
}
