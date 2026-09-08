import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StyledSelect = ({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: string[];
}) => (
  <Select defaultValue={defaultValue}>
    <SelectTrigger className="text-xs font-mono border-border focus:ring-ring h-8">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map((o) => (
        <SelectItem key={o} value={o} className="text-xs font-mono">
          {o}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
