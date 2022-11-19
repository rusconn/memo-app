import type { OptionalQuery as OptionalQuery0 } from "../pages";
import type { Query as Query1 } from "../pages/[memoId]";

export const pagesPath = {
  _memoId: (memoId: string | number) => ({
    $url: (url: { query: Query1; hash?: string }) => ({
      pathname: "/[memoId]" as const,
      query: { memoId, ...url.query },
      hash: url.hash,
    }),
  }),
  $url: (url?: { query?: OptionalQuery0; hash?: string }) => ({
    pathname: "/" as const,
    query: url?.query,
    hash: url?.hash,
  }),
};

export type PagesPath = typeof pagesPath;

export const staticPath = {
  favicon_ico: "/favicon.ico",
} as const;

export type StaticPath = typeof staticPath;
