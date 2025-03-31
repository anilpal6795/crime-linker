
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart,
  FileText,
  Home,
  Map,
  PieChart,
  Plus,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Cases", icon: FileText, path: "/cases" },
    { name: "People", icon: Users, path: "/people" },
    { name: "Reports", icon: BarChart, path: "/reports" },
    { name: "Map", icon: Map, path: "/map" },
    { name: "Analytics", icon: PieChart, path: "/analytics" },
  ];

  return (
    <div className="flex flex-col h-screen border-r bg-sidebar">
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/report-incident">
                <FileText className="mr-2 h-4 w-4" />
                New Incident
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/add-person">
                <User className="mr-2 h-4 w-4" />
                New Person of Interest
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/add-vehicle">
                <Car className="mr-2 h-4 w-4" />
                New Vehicle of Interest
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/add-case">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Case
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Import additional icons
import { Car, FolderPlus } from "lucide-react";

export default Sidebar;
