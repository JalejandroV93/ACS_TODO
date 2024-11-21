import { memo } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TodoInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const TodoInput = memo(({ value, onChange, onAdd }: TodoInputProps) => (
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Agregar una Nueva Tarea"
      className="flex-grow"
    />
    <Button onClick={onAdd} className="w-full sm:w-auto">
      Agregar
    </Button>
  </div>
));
TodoInput.displayName = 'TodoInput';