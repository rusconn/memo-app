import Router, { useRouter } from "next/router";
import { ComponentProps, memo, useCallback, useEffect, useState } from "react";
import { TfiSearch } from "react-icons/tfi";

import { useSelectedMemoIdMutation } from "@/contexts";
import { pagesPath } from "@/lib";

type Props = Pick<ComponentProps<"input">, "value" | "placeholder" | "onChange">;

const StyledComponent = ({ value, placeholder, onChange }: Props) => (
  <label
    className="flex h-full w-full items-center border-b border-gray-700 dark:border-stone-200"
    htmlFor="search-memo"
  >
    <TfiSearch className="h-fit w-fit p-1" />
    <input
      id="search-memo"
      className="flex-grow bg-inherit focus:outline-none dark:placeholder-stone-500"
      {...{ value, placeholder, onChange }}
    />
  </label>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [timerId, setTimerId] = useState<number>();
  const { clearSelectedMemoId } = useSelectedMemoIdMutation();

  const q = router.query.q as string | undefined;

  // URL から検索テキストを復元する
  useEffect(() => {
    if (q) {
      setValue(q);
    }
  }, [q]);

  // 別のページへ遷移したら検索タイマーをクリアする
  useEffect(() => {
    return () => window.clearTimeout(timerId);
  }, [timerId, router]);

  const placeholder = "メモを検索する";

  const onChange: NonNullable<Props["onChange"]> = useCallback(
    ({ currentTarget }) => {
      window.clearTimeout(timerId);

      setValue(currentTarget.value);

      const id = window.setTimeout(() => {
        void Router.push(pagesPath.$url({ query: { q: currentTarget.value } }));
        clearSelectedMemoId();
      }, 500);

      setTimerId(id);
    },
    [timerId, setValue, clearSelectedMemoId]
  );

  return <Component {...{ value, placeholder, onChange }} />;
};

export default memo(Container);
