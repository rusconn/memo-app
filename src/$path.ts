export const pagesPath = {
  folders: {
    _folderId: (folderId: string | number) => ({
      memos: {
        _memoId: (memoId: string | number) => ({
          $url: (url?: { hash?: string }) => ({
            pathname: "/folders/[folderId]/memos/[memoId]" as const,
            query: { folderId, memoId },
            hash: url?.hash,
          }),
        }),
      },
      $url: (url?: { hash?: string }) => ({
        pathname: "/folders/[folderId]" as const,
        query: { folderId },
        hash: url?.hash,
      }),
    }),
  },
  $url: (url?: { hash?: string }) => ({ pathname: "/" as const, hash: url?.hash }),
};

export type PagesPath = typeof pagesPath;

export const staticPath = {
  favicon_ico: "/favicon.ico",
} as const;

export type StaticPath = typeof staticPath;
