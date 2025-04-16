import STLogo from "@/assets/symptomtrace_logo.png";
import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import ErrorLoginInfo, {
  extractErrorMessage,
} from "@/components/others/ErrorLoginInfo";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { AUTH_SETTINGS_KEY, QUERIES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useToast } from "@/context/ToastProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import AppwriteService from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { AuthSettings } from "@/types/general";
import { ApiResponse } from "@/types/response";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

function Login() {
  const { formatMessage: t } = useIntl();
  const [settings, setSettings] = useLocalStorage<AuthSettings>(
    AUTH_SETTINGS_KEY,
    {},
  );
  const { currentTheme } = useTheme();
  const { mutateAsync: login, error } = useLogin();
  const toast = useToast();
  useLogoutAftermath();

  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t({ id: "general.validation.required" }))
          .email(t({ id: "general.validation.email" })),
        password: z.string().min(1, t({ id: "general.validation.required" })),
      }),
    [],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: settings.rememberMe && settings.email ? settings.email : "",
      password:
        settings.rememberMe && settings.password ? settings.password : "",
    },
  });

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    if (settings.rememberMe)
      setSettings({ ...settings, rememberMe: true, email, password });
    else
      setSettings({
        ...settings,
        rememberMe: false,
        email: undefined,
        password: undefined,
      });

    // await login({
    //   url: "/auth/login",
    //   body: { email, password },
    //   method: "POST",
    // })
    await login({ email, password }).catch((loginError) =>
      toast.error({
        title: "Login failed",
        description: extractErrorMessage(loginError),
      }),
    );
  };

  return (
    <div className="relative flex min-h-full min-w-[600px] flex-grow flex-col items-center justify-center">
      <p className="absolute bottom-8 left-[50%] w-[max-content] translate-x-[-50%] text-sm font-thin text-neutral-400">
        &#169;2025 Symptomtrace Corp. All Rights Reserved.
      </p>
      <div className="mx-auto w-[476px]">
        <div className="mb-3 w-[208px]">
          <img
            className={cn("w-full object-contain object-left", {
              invert: currentTheme === "dark",
            })}
            src={STLogo}
            alt=""
          />
        </div>
        {error && <ErrorLoginInfo className="mt-4 mb-2" error={error} />}
        <Form {...form}>
          <form className="mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <CustomFormField
              required
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              fieldClassName="mb-3"
            />
            <CustomFormField
              required
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <div className="mt-3 mb-3 flex justify-between">
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={settings.rememberMe ?? false}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      rememberMe: value === "indeterminate" ? false : value,
                    })
                  }
                />
                Remember me
              </Label>

              <Link
                to="/auth/forgot-password"
                className="text-primary hover:underline"
              >
                {t({ id: "auth.login.link.forgotPassword" })}
              </Link>
            </div>
            <CustomLoadingButton
              className="w-full"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              {t({ id: "auth.login.submit" })}
            </CustomLoadingButton>
          </form>
        </Form>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </div>
    </div>
  );
}

function useLogin() {
  const { setAccessToken, setEnabled } = useAuth();
  const queryClient = useQueryClient();
  // return useApiMutation<
  //   ApiResponse<{ accessToken: string }>,
  //   {
  //     email: string;
  //     password: string;
  //   }
  // >({
  //   onSuccess(data) {
  //     if (data.success) {
  //       setAccessToken(data.data.accessToken);
  //       setEnabled(true);
  //     }
  //     queryClient.invalidateQueries({ queryKey: [QUERIES.user] });
  //   },
  // });
  return useMutation<
    ApiResponse<{ accessToken: string }>,
    any,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: ({ email, password }) => AppwriteService.login(email, password),
    onSuccess(data) {
      if (data.success) {
        setAccessToken(data.data.accessToken);
        setEnabled(true);
      }
      queryClient.invalidateQueries({ queryKey: [QUERIES.user] });
    },
  });
}

function useLogoutAftermath() {
  const [searchParams] = useSearchParams();
  const { setEnabled } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      setEnabled(false);
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 200);
    }
  }, [searchParams.get("logout")]);
}

export default Login;
