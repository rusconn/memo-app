import equal from "fast-deep-equal";
import Link, { LinkProps } from "next/link";
import { memo, ReactElement } from "react";
import { TfiFolder } from "react-icons/tfi";

import { clsx } from "@/lib";

type Props = {
  name: string;
  count: number;
  current: boolean;
  renameInput?: ReactElement;
  menu?: ReactElement;
} & Pick<LinkProps, "href">;

const StyledComponent = ({ name, count, current, renameInput, menu, href }: Props) => (
  <li
    className={clsx(
      "group relative flex items-center",
      current && "text-white dark:text-stone-200"
    )}
  >
    <Link {...{ href }}>
      {/* Linkコンポーネントからhrefを渡すので */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={clsx(
          "flex w-full select-none items-center justify-between whitespace-nowrap rounded p-2 text-left",
          current
            ? "bg-yellow-500 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-600"
            : "hover:bg-gray-300 dark:hover:bg-stone-700"
        )}
      >
        <span className="flex h-5 w-48">
          <TfiFolder
            className={clsx(
              "h-4 w-4 shrink-0",
              current ? "dark:text-stone-200" : "text-yellow-500 dark:text-yellow-500"
            )}
          />
          {!renameInput && <span className="grow overflow-hidden text-ellipsis px-2">{name}</span>}
        </span>
        <span className={clsx("text-right font-mono", current ? "opacity-100" : "opacity-50")}>
          {count}
        </span>
      </a>
    </Link>
    {/* 下記要素らは UI の見た目上では上記 a 要素の中に含まれる */}
    {/* しかしインタラクティブなコンテンツのネストを防ぐため兄弟とした */}
    {renameInput && <div className="absolute left-7">{renameInput}</div>}
    <div className="absolute top-2.5 right-7">{menu}</div>
  </li>
);

export const Component = memo(StyledComponent, equal);

export default Component;
