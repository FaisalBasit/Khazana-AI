import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./app-sidebar";
import { TopNav } from "./top-nav";

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 px-6 pb-16 lg:px-10">
        <TopNav title={title} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
