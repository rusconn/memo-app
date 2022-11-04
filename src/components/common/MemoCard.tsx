import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Router from "next/router";
import {
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  KeyboardEventHandler,
  memo,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { TfiFolder } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import { useSelectedMemoId, useSelectedMemoIdMutation } from "@/contexts";
import { clsx } from "@/utils";

type ContainerProps = Pick<
  Props,
  "headline" | "content" | "folderName" | "updatedAt" | "showFolderName"
> & {
  id: string;
  folderId: string;
};

type Props = {
  headline: string;
  content: string;
  folderName: string;
  updatedAt: string;
  selected: boolean;
  showFolderName?: true;
  onMouseDown: MouseEventHandler<HTMLButtonElement>;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  onFocus: FocusEventHandler<HTMLButtonElement>;
};

const StyledComponent = (
  {
    headline,
    content,
    folderName,
    updatedAt,
    selected,
    showFolderName,
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
      <span className="w-full overflow-hidden overflow-ellipsis text-xs">
        {headline === "" ? "新規メモ" : headline}
      </span>
      <time className="w-full opacity-60" dateTime={updatedAt} suppressHydrationWarning>
        {format(parseISO(updatedAt), "yyyy/MM/dd")}
      </time>
      <span
        className={clsx(
          "flex w-full justify-center space-x-1 opacity-40",
          !showFolderName && "invisible"
        )}
      >
        <TfiFolder className="h-3 w-3 flex-shrink-0" />
        <span className="overflow-hidden overflow-ellipsis">{folderName}</span>
      </span>
    </span>
  </button>
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({
  id,
  headline,
  content,
  folderName,
  folderId,
  updatedAt,
  showFolderName,
}: ContainerProps) => {
  const selectedMemoId = useSelectedMemoId();
  const { setSelectedMemoId } = useSelectedMemoIdMutation();
  const ref = useRef<HTMLButtonElement>(null);

  const selected = id === selectedMemoId;

  // メモ編集から一覧へ戻った際にフォーカスする
  useEffect(() => {
    if (selected) {
      ref.current?.focus();
    }
  }, [selected]);

  const toDetail = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Router.push(pagesPath.folders._folderId(folderId).memos._memoId(id).$url());
  }, [folderId, id]);

  const onMouseDown: Props["onMouseDown"] = useCallback(() => {
    setSelectedMemoId(id);
  }, [setSelectedMemoId, id]);

  const onDoubleClick: Props["onDoubleClick"] = toDetail;

  const onKeyDown: Props["onKeyDown"] = useCallback(
    ({ code }) => {
      if (code === "Enter") {
        toDetail();
      }
    },
    [toDetail]
  );

  const onFocus: Props["onFocus"] = useCallback(() => {
    setSelectedMemoId(id);
  }, [setSelectedMemoId, id]);

  return (
    <Component
      {...{
        ref,
        id,
        headline,
        content,
        folderName,
        updatedAt,
        selected,
        showFolderName,
        onMouseDown,
        onDoubleClick,
        onKeyDown,
        onFocus,
      }}
    />
  );
};

export default Container;
