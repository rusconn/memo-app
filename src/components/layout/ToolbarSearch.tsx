import Router, { useRouter } from "next/router";
import { ChangeEventHandler, memo, useCallback, useEffect, useState } from "react";
import { TfiSearch } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import { useSelectedMemoIdMutation } from "@/contexts";

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const StyledComponent = ({ value, onChange }: Props) => (
  <label
    className="flex h-full w-full items-center border-b border-gray-700 dark:border-stone-200"
    htmlFor="search"
  >
    <TfiSearch className="h-fit w-fit p-1" />
    <input
      id="search"
      className="flex-grow bg-inherit focus:outline-none dark:placeholder-stone-500"
      placeholder="メモを検索する"
      {...{ value, onChange }}
    />
  </label>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [timerId, setTimerId] = useState<number>();
  const { clearSelectedMemoId } = useSelectedMemoIdMutation();

  const q = (router.query.q ?? "") as string;

  // URL から検索テキストを復元する
  useEffect(() => {
    setValue(q);
  }, [q]);

  const onChange: Props["onChange"] = useCallback(
    ({ currentTarget }) => {
      window.clearTimeout(timerId);

      setValue(currentTarget.value);

      const id = window.setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Router.push({
          pathname: pagesPath.$url().pathname,
          query: { q: currentTarget.value },
        });

        clearSelectedMemoId();
      }, 500);

      setTimerId(id);
    },
    [timerId, setValue, clearSelectedMemoId]
  );

  return <Component {...{ value, onChange }} />;
};

export default Container;
