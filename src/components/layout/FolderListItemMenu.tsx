import { useRouter } from "next/router";
import { ComponentProps, ForwardedRef, forwardRef, memo, useCallback, useRef } from "react";
import { TfiMoreAlt } from "react-icons/tfi";
import { useBoolean, useOnClickOutside } from "usehooks-ts";

import { pagesPath } from "@/$path";
import { useFoldersMutation, useMemosMutation, useRenamingFolderIdMutation } from "@/contexts";
import { clsx } from "@/utils";
import FolderListItemMenuButton from "./FolderListItemMenuButton";

type ContainerProps = {
  id: string;
} & Pick<Props, "current" | "editable">;

type Props = {
  current: boolean;
  isOpen: boolean;
  editable: boolean;
  ariaLabel?: ComponentProps<"button">["aria-label"];
  onButtonClick?: ComponentProps<"button">["onClick"];
  onRenameClick?: ComponentProps<typeof FolderListItemMenuButton>["onClick"];
  onDeleteClick?: ComponentProps<typeof FolderListItemMenuButton>["onClick"];
};

const StyledComponent = (
  { current, isOpen, editable, ariaLabel, onButtonClick, onRenameClick, onDeleteClick }: Props,
  ref: ForwardedRef<HTMLElement>
) => (
  <section className="flex" {...{ ref }}>
    <button
      className="rounded-full opacity-0 group-focus-within:opacity-80 group-hover:opacity-80"
      type="button"
      onClick={onButtonClick}
      aria-label={ariaLabel}
    >
      <TfiMoreAlt
        className={clsx(
          "h-4 w-4 rounded-full p-1 dark:bg-stone-400 dark:text-stone-800",
          current
            ? "bg-gray-50 text-yellow-400 dark:bg-stone-200 dark:text-stone-800"
            : "bg-gray-400 text-white"
        )}
      />
    </button>
    {isOpen && (
      <section
        className={clsx(
          "absolute top-4 right-0 z-10 w-max rounded-md border bg-gray-50 opacity-100 shadow dark:border-stone-700 dark:bg-stone-900",
          current && "text-gray-800 dark:text-stone-200"
        )}
      >
        <FolderListItemMenuButton disabled={!editable} onClick={onRenameClick}>
          名前を変更
        </FolderListItemMenuButton>
        <FolderListItemMenuButton disabled={!editable} onClick={onDeleteClick}>
          削除
        </FolderListItemMenuButton>
      </section>
    )}
  </section>
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({ id, editable, current }: ContainerProps) => {
  const router = useRouter();
  const { value: isOpen, toggle, setFalse: close } = useBoolean(false);
  const ref = useRef<HTMLElement>(null);
  const { startRenameFolder } = useRenamingFolderIdMutation();
  const { deleteFolder } = useFoldersMutation();
  const { deleteMemosWhere } = useMemosMutation();

  useOnClickOutside(ref, close);

  const ariaLabel = isOpen ? "フォルダメニューを閉じる" : "フォルダメニューを開く";

  const onButtonClick: NonNullable<Props["onButtonClick"]> = toggle;

  const onRenameClick: NonNullable<Props["onRenameClick"]> = useCallback(() => {
    close();
    startRenameFolder(id);
  }, [close, startRenameFolder, id]);

  const onDeleteClick: NonNullable<Props["onDeleteClick"]> = useCallback(() => {
    // 表示中のベージがなくなる場合はトップへ移動する
    if (router.query.folderId === id) {
      void router.push(pagesPath.$url());
    }

    deleteMemosWhere(x => x.folderId === id);
    deleteFolder(id);
  }, [router, id, deleteMemosWhere, deleteFolder]);

  return (
    <Component
      {...{
        current,
        isOpen,
        editable,
        ariaLabel,
        onButtonClick,
        onRenameClick,
        onDeleteClick,
        ref,
      }}
    />
  );
};

export default Container;
