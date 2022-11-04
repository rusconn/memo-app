import equal from "fast-deep-equal";
import { ComponentProps, memo, useEffect } from "react";

import { useSelectedMemoIdMutation } from "@/contexts";
import MemoCard from "./MemoCard";

type ContainerProps = {
  memos: ComponentProps<typeof MemoCard>[];
  showFolderName?: true;
};

type Props = ContainerProps;

const StyledComponent = ({ memos, showFolderName }: Props) => (
  <ol
    className="grid gap-x-4 gap-y-6 text-xs"
    // tailwind での指定方法がわからなかった
    style={{ gridTemplateColumns: "repeat(auto-fill,minmax(12rem,1fr))" }}
  >
    {memos.map(({ id, headline, content, folderName, folderId, updatedAt }) => (
      <li key={id}>
        <MemoCard {...{ id, headline, content, folderName, folderId, updatedAt, showFolderName }} />
      </li>
    ))}
  </ol>
);

export const Component = memo(StyledComponent, equal);

const Container = ({ memos, showFolderName }: ContainerProps) => {
  const { clearSelectedMemoId } = useSelectedMemoIdMutation();

  // (非メモカード かつ 非ツールバー)をマウスダウンでメモ選択を解除する
  // NOTE: メモカードの onBlur だとツールバーでも解除されてしまい、削除ボタンが押せなくなる
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const page = document.getElementById("page");

    sidebar?.addEventListener("mousedown", clearSelectedMemoId);
    page?.addEventListener("mousedown", clearSelectedMemoId);

    return () => {
      sidebar?.removeEventListener("mousedown", clearSelectedMemoId);
      page?.removeEventListener("mousedown", clearSelectedMemoId);
    };
  }, [clearSelectedMemoId]);

  return <Component {...{ memos, showFolderName }} />;
};

export default Container;
