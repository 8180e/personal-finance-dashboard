import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@/utils/cookies";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const handleLogout = () => {
    setCookie("token", "", -1);
    navigate("/");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <Button onClick={handleLogout}>
          <IconLogout />
          Log out
        </Button>
      </SidebarContent>
    </Sidebar>
  );
}
