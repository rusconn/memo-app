import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Memo } from "./types";

const SelectedMemoIdContext = createContext<Memo["id"] | null>(null);

const SelectedMemoIdMutationContext = createContext<{
  setSelectedMemoId: Dispatch<SetStateAction<Memo["id"] | null>>;
  clearSelectedMemoId: () => void;
}>({
  setSelectedMemoId: () => {},
  clearSelectedMemoId: () => {},
});

export const useSelectedMemoId = () => useContext(SelectedMemoIdContext);

export const useSelectedMemoIdMutation = () => useContext(SelectedMemoIdMutationContext);

export const SelectedMemoIdProvider = ({ children }: PropsWithChildren) => {
  const [selectedMemoId, setSelectedMemoId] = useState<Memo["id"] | null>(null);

  const clearSelectedMemoId = useCallback(() => {
    setSelectedMemoId(null);
  }, []);

  const selectedMemoIdMutation = useMemo(
    () => ({
      setSelectedMemoId,
      clearSelectedMemoId,
    }),
    [clearSelectedMemoId]
  );

  return (
    <SelectedMemoIdContext.Provider value={selectedMemoId}>
      <SelectedMemoIdMutationContext.Provider value={selectedMemoIdMutation}>
        {children}
      </SelectedMemoIdMutationContext.Provider>
    </SelectedMemoIdContext.Provider>
  );
};
