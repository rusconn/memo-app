import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Folder } from "@/storage";

const RenamingFolderIdContext = createContext<Folder["id"] | null>(null);

const RenamingFolderIdMutationContext = createContext<{
  startRenameFolder: (id: Folder["id"]) => void;
  endRenameFolder: () => void;
}>({
  startRenameFolder: () => {},
  endRenameFolder: () => {},
});

export const useRenamingFolderId = () => useContext(RenamingFolderIdContext);

export const useRenamingFolderIdMutation = () => useContext(RenamingFolderIdMutationContext);

export const RenameFolderIdProvider = ({ children }: PropsWithChildren) => {
  const [renamingFolderId, setRenamingFolderId] = useState<Folder["id"] | null>(null);

  const endRenameFolder = useCallback(() => {
    setRenamingFolderId(null);
  }, []);

  const RenamingFolderIdMutation = useMemo(
    () => ({
      startRenameFolder: setRenamingFolderId,
      endRenameFolder,
    }),
    [endRenameFolder]
  );

  return (
    <RenamingFolderIdContext.Provider value={renamingFolderId}>
      <RenamingFolderIdMutationContext.Provider value={RenamingFolderIdMutation}>
        {children}
      </RenamingFolderIdMutationContext.Provider>
    </RenamingFolderIdContext.Provider>
  );
};
