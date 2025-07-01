'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function PasswordInput() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <>
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={isVisible ? 'text' : 'password'}
          name="password"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls="password"
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVisible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
