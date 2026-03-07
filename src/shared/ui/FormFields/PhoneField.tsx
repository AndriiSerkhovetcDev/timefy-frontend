import { IMaskInput } from "react-imask";
import { Controller, type Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
};

export const PhoneField = ({ control, name, label, error, required }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <IMaskInput
            mask="+38 (000) 000-00-00"
            value={field.value}
            onAccept={(value) => field.onChange(value)}
            placeholder="+38 (0XX) XXX-XX-XX"
            className="w-full  rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
