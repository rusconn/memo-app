import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

import { Memo } from "./types";

const SelectedMemoIdContext = createContext<Memo["id"] | null>(null);

const SetSelectedMemoIdContext = createContext<Dispatch<SetStateAction<Memo["id"] | null>>>(
  () => {}
);

const ClearSelectedMemoIdContext = createContext(() => {});

export const useSelectedMemoId = () => useContext(SelectedMemoIdContext);

export const useSetSelectedMemoId = () => useContext(SetSelectedMemoIdContext);

export const useClearSelectedMemoId = () => useContext(ClearSelectedMemoIdContext);

export const SelectedMemoIdProvider = ({ children }: PropsWithChildren) => {
  const [selectedMemoId, setSelectedMemoId] = useState<Memo["id"] | null>(null);

  const clearSelectedMemoId = useCallback(() => {
    setSelectedMemoId(null);
  }, []);

  return (
    <SelectedMemoIdContext.Provider value={selectedMemoId}>
      <SetSelectedMemoIdContext.Provider value={setSelectedMemoId}>
        <ClearSelectedMemoIdContext.Provider value={clearSelectedMemoId}>
          {children}
        </ClearSelectedMemoIdContext.Provider>
      </SetSelectedMemoIdContext.Provider>
    </SelectedMemoIdContext.Provider>
  );
};
