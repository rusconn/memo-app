import { memo } from "react";

import AccountMenu from "./AccountMenu";
import AppNameLink from "./AppNameLink";
import FolderList from "./FolderList";
import NewFolderButton from "./NewFolderButton";

const StyledComponent = () => (
  <nav className="flex h-full flex-col">
    <header className="flex justify-between p-4">
      <AppNameLink />
      <AccountMenu />
    </header>
    <section className="flex-grow overflow-x-hidden overflow-y-scroll p-2">
      <FolderList />
    </section>
    <section className="flex justify-start p-4">
      <NewFolderButton />
    </section>
  </nav>
);

export const Component = memo(StyledComponent);

export default Component;
