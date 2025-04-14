import chinaFlag from "@/assets/flags/china.svg";
import taiwanFlag from "@/assets/flags/taiwan.svg";
import usFlag from "@/assets/flags/us.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QUERIES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import AppwriteService from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { User } from "@/types/general";
import { ApiResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  LanguagesIcon,
  LogOutIcon,
  MoonIcon,
  Settings2Icon,
  SettingsIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import { useMemo } from "react";
import { setLanguage, useLang } from "../../i18n/ADPI18nProvider";

function HeaderMenuSettings() {
  const { theme, setTheme } = useTheme();
  const { mutate: logout } = useLogout();

  const themeList = useMemo(
    () =>
      [
        { Icon: SunIcon, theme: "light" },
        { Icon: MoonIcon, theme: "dark" },
        { Icon: Settings2Icon, theme: "system" },
      ] as const,
    [],
  );
  const languageList = useMemo(
    () =>
      [
        {
          imgUrl: usFlag,
          label: "English",
          lang: "en",
        },
        {
          imgUrl: chinaFlag,
          label: "简体中文",
          lang: "zh",
        },
        {
          imgUrl: taiwanFlag,
          label: "繁體中文",
          lang: "zh-TW",
        },
      ] as const,
    [],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} align="end" className="w-[150px]">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={
              () => logout()
              // logout({
              //   url: "/auth/logout",
              //   method: "POST",
              // })
            }
          >
            <LogOutIcon className="text-foreground size-5" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <SunMoonIcon className="text-foreground size-5" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {themeList.map(({ Icon, theme: itemTheme }) => (
                  <DropdownMenuItem
                    key={itemTheme}
                    className={cn("flex items-center gap-2", {
                      "bg-foreground/10 pointer-events-none":
                        theme === itemTheme,
                    })}
                    onClick={() => setTheme(itemTheme)}
                  >
                    <Icon className="text-foreground size-4" />
                    <p className="capitalize">{itemTheme}</p>
                    {theme === itemTheme && (
                      <CheckIcon className="text-foreground ms-auto size-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <LanguagesIcon className="text-foreground size-5" />
              Languages
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {languageList.map(({ imgUrl, label, lang }) => (
                  <DropdownMenuItem
                    key={lang}
                    className={cn("flex items-center gap-2", {
                      "bg-foreground/10 pointer-events-none":
                        useLang() === lang,
                    })}
                    onClick={() => setLanguage(lang)}
                  >
                    <img
                      className="size-4 overflow-hidden rounded-full"
                      src={imgUrl}
                      alt=""
                    />
                    {label}
                    {useLang() === lang && (
                      <CheckIcon className="text-foreground ms-auto size-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useLogout() {
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuth();
  // return useApiMutation<any, void>({
  //   onSettled() {
  //     setAccessToken(null);
  //     queryClient.setQueryData<ApiResponse<User>>([QUERIES.user], {
  //       success: false,
  //       message: "user has logged out",
  //     });
  //   },
  // });
  return useMutation<any, any, void>({
    mutationFn: () => AppwriteService.logout(),
    onSettled() {
      setAccessToken(null);
      queryClient.setQueryData<ApiResponse<User>>([QUERIES.user], {
        success: false,
        message: "user has logged out",
      });
    },
  });
}

export default HeaderMenuSettings;
