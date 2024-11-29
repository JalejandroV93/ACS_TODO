import { memo, useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface TodoInputProps {
  onAdd: (data: { titulo: string; descripcion: string }) => void;
}

export const TodoInput = memo(({ onAdd }: TodoInputProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = () => {
    if (titulo.trim() && descripcion.trim()) {
      onAdd({ titulo: titulo.trim(), descripcion: descripcion.trim() });
      setTitulo('');
      setDescripcion('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título de la tarea"
          maxLength={200}
          className="flex-grow"
        />
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la tarea"
          className="flex-grow"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Agregar Tarea
      </Button>
    </div>
  )
});

TodoInput.displayName = 'TodoInput';