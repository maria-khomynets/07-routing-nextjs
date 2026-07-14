"use client";

import css from "./TagSelector.module.css";

interface TagSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
  return (
    <select
      className={css.select}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">All</option>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </select>
  );
}
