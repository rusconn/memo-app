import {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  KeyboardEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRenamingFolderIdMutation, useFoldersMutation } from "@/contexts";

type ContainerProps = {
  id: string;
  name: string;
};

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
};

const StyledComponent = (
  { value, onChange, onKeyDown, onBlur }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <input
    className="rounded-sm px-1 outline-yellow-500 dark:bg-stone-900"
    {...{ value, ref, onChange, onKeyDown, onBlur }}
  />
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({ id, name }: ContainerProps) => {
  const [value, setValue] = useState(name);
  const { renameFolder } = useFoldersMutation();
  const ref = useRef<HTMLInputElement>(null);
  const { endRenameFolder } = useRenamingFolderIdMutation();

  useEffect(() => {
    ref.current?.select();
  }, []);

  const onChange: Props["onChange"] = useCallback(({ currentTarget }) => {
    setValue(currentTarget.value);
  }, []);

  const tryRename = useCallback(() => {
    if (value.trim() !== "") {
      renameFolder({ id, name: value });
    } else {
      setValue(name);
    }

    endRenameFolder();
  }, [renameFolder, id, value, name, endRenameFolder]);

  const onKeyDown: Props["onKeyDown"] = useCallback(
    ({ code, nativeEvent }) => {
      if (code === "Enter" && !nativeEvent.isComposing) {
        tryRename();
      }
    },
    [tryRename]
  );

  const onBlur: Props["onBlur"] = tryRename;

  return <Component {...{ value, ref, onChange, onKeyDown, onBlur }} />;
};

export default Container;
