import equal from "fast-deep-equal";
import { ComponentProps, memo } from "react";

import { useSelectedMemoId } from "@/contexts";
import MemoCard from "./MemoCard";

type ContainerProps = {
  memos: Omit<PropMemo, "hideFolderLine" | "selected">[];
} & Omit<Props, "memos">;

type Props = {
  memos: Omit<PropMemo, "hideFolderLine">[];
} & Pick<PropMemo, "hideFolderLine">;

type PropMemo = ComponentProps<typeof MemoCard>;

const StyledComponent = ({ memos, hideFolderLine }: Props) => (
  <ol
    className="grid gap-x-4 gap-y-6 text-xs"
    // tailwind での指定方法がわからなかった
    style={{ gridTemplateColumns: "repeat(auto-fill,minmax(12rem,1fr))" }}
  >
    {memos.map(({ id, headline, content, folderName, folderId, updatedAt, selected }) => (
      <li key={id}>
        <MemoCard
          {...{
            id,
            headline,
            content,
            folderName,
            folderId,
            updatedAt,
            hideFolderLine,
            selected,
          }}
        />
      </li>
    ))}
  </ol>
);

export const Component = memo(StyledComponent, equal);

const Container = ({ memos, hideFolderLine }: ContainerProps) => {
  const selectedMemoId = useSelectedMemoId();

  const memosToUse = memos.map(x => ({
    ...x,
    selected: x.id === selectedMemoId,
  }));

  return <Component {...{ hideFolderLine }} memos={memosToUse} />;
};

export default Container;
