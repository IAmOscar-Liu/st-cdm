import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/context/ToastProvider";
import { waitFor } from "@/lib/utils";
import { DialogEditProps } from "@/types/general";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

type FormData = {
  name: string;
  description: string;
};

const DEFAULT_FORM_VALUE: FormData = {
  name: "",
  description: "",
};

function StudyArmEditDialog(props: DialogEditProps<FormData & { id: string }>) {
  const { mode, open, setOpen } = props;
  const data = props.mode === "update" ? props.data : undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatMessage: t } = useIntl();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t({ id: "general.validation.required" })),
        description: z.string(),
      }),
    [],
  );
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    shouldUnregister: true,
    defaultValues:
      mode === "create" ? DEFAULT_FORM_VALUE : (data ?? DEFAULT_FORM_VALUE),
  });

  useEffect(() => {
    if (!open) {
      // form.reset(undefined, { keepTouched: false, keepIsSubmitted: false });
      form.reset(DEFAULT_FORM_VALUE, { keepDefaultValues: false });
    } else if (mode === "update" && open && data) {
      form.reset(data, { keepDefaultValues: false });
    }
  }, [open]);

  const handleSubmit = async (value: FormData) => {
    console.log("Submitted:", value);
    await waitFor(1000);
    toast.success({ title: "Study arm submitted successfully" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Study Arm" : "Edit Study Arm"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(handleSubmit)}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              await handleSubmit(form.getValues());
              setIsSubmitting(false);
            }}
          >
            <div className="mb-4">
              <CustomFormField
                required
                control={form.control}
                name="name"
                label="Study Arm Name"
                placeholder="Enter name"
                fieldClassName="mb-3"
              />
              <CustomFormField
                control={form.control}
                name="description"
                type="textarea"
                label="Description"
                placeholder="Enter description"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <CustomLoadingButton
                isLoading={isSubmitting}
                disabled={!form.formState.isValid}
              >
                Confirm
              </CustomLoadingButton>
            </DialogFooter>
          </form>
        </Form>
        <DevTool control={form.control} />
      </DialogContent>
    </Dialog>
  );
}

export default StudyArmEditDialog;
