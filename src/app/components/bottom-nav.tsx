import { History, Search, Settings } from "lucide-react";

export type NavTab =
  | "history"
  | "findService"
  | "findParts"
  | "settings";

interface BottomNavProps {
  tabs?: { id: NavTab; label: string; icon: typeof History }[];
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems = [
  { id: "history" as NavTab, label: "История", icon: History },
  {
    id: "findService" as NavTab,
    label: "Автосервис",
    icon: Search,
  },
  {
    id: "findParts" as NavTab,
    label: "Запчасти",
    icon: Search,
  },
  {
    id: "settings" as NavTab,
    label: "Настройки",
    icon: Settings,
  },
];
//
// export function BottomNav({ tabs, activeTab, onTabChange }: BottomNavProps) {
//   const items = tabs || navItems;
//
//   return (
//     <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[380px]">
// <nav className="bg-white/12 dark:bg-card/12 backdrop-blur-sm border border-border/20 rounded-full shadow-md px-2 py-1.5">
//          <div className="flex items-center justify-around gap-1">
//           {items.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => onTabChange(tab.id)}
//               className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-full transition-all ${
//                 activeTab === tab.id
//                   ? "bg-secondary/80"
//                   : "hover:bg-secondary/40"
//               }`}
//             >
//               <tab.icon
//                 className={`w-5 h-5 transition-colors ${
//                   activeTab === tab.id
//                     ? "text-foreground"
//                     : "text-muted-foreground"
//                 }`}
//               />
//               <span
//                 className={`text-[10px] transition-colors ${
//                   activeTab === tab.id
//                     ? "text-foreground font-medium"
//                     : "text-muted-foreground"
//                 }`}
//               >
//                 {tab.label}
//               </span>
//             </button>
//           ))}
//         </div>
//       </nav>
//     </div>
//   );
// }

export function BottomNav({ tabs, activeTab, onTabChange }: BottomNavProps) {
  const items = tabs || navItems

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[380px]">
      <nav className="bg-white/10 dark:bg-white/5 backdrop-blur-[6px] border border-white/20 rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.12)] px-2 py-1.5">
        <div className="flex items-center justify-around gap-1">
          {items.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-white/60 dark:bg-white/20 shadow-sm"
                  : "hover:bg-white/30"
              }`}
            >
              <tab.icon
                className={`w-5 h-5 transition-colors opacity-90 ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
