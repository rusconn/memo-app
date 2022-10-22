import { memo, PropsWithChildren } from "react";

import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";

type Props = PropsWithChildren;

const StyledComponent = ({ children }: Props) => (
  <div className="flex h-screen">
    <div className="w-64 bg-gray-100 dark:bg-stone-800" id="sidebar">
      <Sidebar />
    </div>
    <main className="flex h-full flex-grow flex-col space-y-2 overflow-x-hidden bg-white dark:bg-stone-900">
      <Toolbar />
      <section className="flex-grow overflow-x-hidden overflow-y-scroll" id="page">
        {children}
      </section>
    </main>
  </div>
);

export const Component = memo(StyledComponent);

export default Component;
