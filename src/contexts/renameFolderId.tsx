import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";

import { Folder } from "./types";

const RenamingFolderIdContext = createContext<Folder["id"] | null>(null);

const StartRenameFolderContext = createContext<(id: Folder["id"]) => void>(() => {});

const EndRenameFolderContext = createContext<() => void>(() => {});

export const useRenamingFolderId = () => useContext(RenamingFolderIdContext);

export const useStartRenameFolder = () => useContext(StartRenameFolderContext);

export const useEndRenameFolder = () => useContext(EndRenameFolderContext);

export const RenameFolderIdProvider = ({ children }: PropsWithChildren) => {
  const [renamingFolderId, setRenamingFolderId] = useState<Folder["id"] | null>(null);

  const endRenameFolder = useCallback(() => {
    setRenamingFolderId(null);
  }, []);

  return (
    <RenamingFolderIdContext.Provider value={renamingFolderId}>
      <StartRenameFolderContext.Provider value={setRenamingFolderId}>
        <EndRenameFolderContext.Provider value={endRenameFolder}>
          {children}
        </EndRenameFolderContext.Provider>
      </StartRenameFolderContext.Provider>
    </RenamingFolderIdContext.Provider>
  );
};
