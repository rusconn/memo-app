import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Router from "next/router";
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { TfiFolder } from "react-icons/tfi";

import { useSelectedMemoIdMutation } from "@/contexts";
import { clsx, pagesPath } from "@/lib";

type ContainerProps = {
  id: string;
  folderId: string;
  updatedAt: string;
} & Pick<Props, "headline" | "content" | "folderName" | "hideFolderLine" | "selected">;

type Props = {
  headline: string;
  content: string;
  folderName: string;
  date: string;
  hideFolderLine?: boolean;
  selected: boolean;
} & Pick<ComponentProps<"time">, "dateTime"> &
  Pick<ComponentProps<"button">, "onMouseDown" | "onDoubleClick" | "onKeyDown" | "onFocus">;

const StyledComponent = (
  {
    headline,
    content,
    folderName,
    date,
    hideFolderLine,
    selected,
    dateTime,
    onMouseDown,
    onDoubleClick,
    onKeyDown,
    onFocus,
  }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) => (
  <button
    className="flex h-fit w-44 cursor-pointer select-none flex-col space-y-2 text-[10px] outline-none"
    type="button"
    {...{ ref, onMouseDown, onDoubleClick, onKeyDown, onFocus }}
  >
    <span
      className={clsx(
        "inline-block h-32 w-full overflow-hidden whitespace-pre-wrap rounded-lg border p-2 pb-0 text-left leading-tight dark:border-stone-700",
        selected && "border-2 border-yellow-500 p-[7px] dark:border-yellow-500"
      )}
      style={{ overflowWrap: "anywhere" }}
    >
      {/* 8px 程度を指定したいが、Chrome だと 10px 未満にならないので scale を使っている */}
      <span className="inline-block h-[125%] w-[125%] origin-top-left scale-[0.8]">{content}</span>
    </span>
    <span className="flex w-full flex-col whitespace-nowrap text-center">
      <span className="w-full overflow-hidden text-ellipsis text-xs">{headline}</span>
      <time className="w-full opacity-60" {...{ dateTime }} suppressHydrationWarning>
        {date}
      </time>
      <span
        className={clsx(
          "flex w-full justify-center space-x-1 opacity-40",
          hideFolderLine && "invisible"
        )}
      >
        <TfiFolder className="h-3 w-3 shrink-0" />
        <span className="overflow-hidden text-ellipsis">{folderName}</span>
      </span>
    </span>
  </button>
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({
  id,
  folderId,
  updatedAt,
  headline,
  content,
  folderName,
  hideFolderLine,
  selected,
}: ContainerProps) => {
  const { setSelectedMemoId } = useSelectedMemoIdMutation();
  const ref = useRef<HTMLButtonElement>(null);

  const headlineToUse = headline === "" ? "新規メモ" : headline;
  const date = format(parseISO(updatedAt), "yyyy/MM/dd");

  // メモ詳細から一覧へ戻った際にフォーカスする
  useEffect(() => {
    if (selected) {
      ref.current?.focus();
    }
  }, [selected]);

  const toDetail = useCallback(() => {
    void Router.push(pagesPath._memoId(id).$url({ query: { folderId } }));
  }, [folderId, id]);

  const onMouseDown: NonNullable<Props["onMouseDown"]> = useCallback(
    e => {
      // 上流コンポーネントによるメモの選択状態解除を避ける
      e.stopPropagation();
      setSelectedMemoId(id);
    },
    [setSelectedMemoId, id]
  );

  const onDoubleClick: NonNullable<Props["onDoubleClick"]> = toDetail;

  const onKeyDown: NonNullable<Props["onKeyDown"]> = useCallback(
    ({ code }) => {
      if (code === "Enter") {
        toDetail();
      }
    },
    [toDetail]
  );

  const onFocus: NonNullable<Props["onFocus"]> = useCallback(() => {
    setSelectedMemoId(id);
  }, [setSelectedMemoId, id]);

  return (
    <Component
      {...{
        headline: headlineToUse,
        content,
        folderName,
        date,
        hideFolderLine,
        selected,
        dateTime: updatedAt,
        onMouseDown,
        onDoubleClick,
        onKeyDown,
        onFocus,
        ref,
      }}
    />
  );
};

export default memo(Container);
