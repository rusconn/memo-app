import equal from "fast-deep-equal";
import { ComponentProps, memo } from "react";

import MemoCard from "./MemoCard";

type Props = {
  memos: Omit<ComponentProps<typeof MemoCard>, "hideFolderLine">[];
} & Pick<ComponentProps<typeof MemoCard>, "hideFolderLine">;

const StyledComponent = ({ memos, hideFolderLine }: Props) => (
  <ol
    className="grid gap-x-4 gap-y-6 text-xs"
    // tailwind での指定方法がわからなかった
    style={{ gridTemplateColumns: "repeat(auto-fill,minmax(12rem,1fr))" }}
  >
    {memos.map(({ id, headline, content, folderName, folderId, updatedAt }) => (
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
          }}
        />
      </li>
    ))}
  </ol>
);

export const Component = memo(StyledComponent, equal);

export default Component;
