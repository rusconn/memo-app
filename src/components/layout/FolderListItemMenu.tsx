import { useRouter } from "next/router";
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  memo,
  MouseEventHandler,
  useCallback,
  useRef,
} from "react";
import { TfiMoreAlt } from "react-icons/tfi";
import { useBoolean, useOnClickOutside } from "usehooks-ts";

import { pagesPath } from "@/$path";
import { useDeleteFolder, useStartRenameFolder } from "@/contexts";
import { clsx } from "@/utils";
import FolderListItemMenuButton from "./FolderListItemMenuButton";

type ContainerProps = Pick<Props, "current" | "editable"> & {
  id: string;
};

type Props = {
  current: boolean;
  isOpen: boolean;
  editable: boolean;
  onButtonClick: MouseEventHandler<HTMLButtonElement>;
  onRenameClick: ComponentProps<typeof FolderListItemMenuButton>["onClick"];
  onDeleteClick: ComponentProps<typeof FolderListItemMenuButton>["onClick"];
};

const StyledComponent = (
  { current, isOpen, editable, onButtonClick, onRenameClick, onDeleteClick }: Props,
  ref: ForwardedRef<HTMLElement>
) => (
  <section className="flex" {...{ ref }}>
    <button
      className="rounded-full opacity-0 group-focus-within:opacity-80 group-hover:opacity-80"
      type="button"
      onClick={onButtonClick}
      aria-label={isOpen ? "フォルダメニューを閉じる" : "フォルダメニューを開く"}
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
        <FolderListItemMenuButton label="名前を変更" disabled={!editable} onClick={onRenameClick} />
        <FolderListItemMenuButton label="削除" disabled={!editable} onClick={onDeleteClick} />
      </section>
    )}
  </section>
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({ id, editable, current }: ContainerProps) => {
  const router = useRouter();
  const { value: isOpen, toggle, setFalse: close } = useBoolean(false);
  const ref = useRef<HTMLElement>(null);
  const startRenameFolder = useStartRenameFolder();
  const deleteFolder = useDeleteFolder();

  useOnClickOutside(ref, close);

  const onButtonClick: Props["onButtonClick"] = toggle;

  const onRenameClick: Props["onRenameClick"] = useCallback(() => {
    close();
    startRenameFolder(id);
  }, [close, startRenameFolder, id]);

  const onDeleteClick: Props["onDeleteClick"] = useCallback(() => {
    // 表示中のベージがなくなる場合はトップへ移動する
    if (router.query.folderId === id) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(pagesPath.$url()).then(() => deleteFolder(id));
    } else {
      deleteFolder(id);
    }
  }, [router, deleteFolder, id]);

  return (
    <Component
      {...{
        ref,
        current,
        editable,
        isOpen,
        onButtonClick,
        onRenameClick,
        onDeleteClick,
      }}
    />
  );
};

export default Container;
