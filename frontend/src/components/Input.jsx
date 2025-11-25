import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={twMerge(
                clsx(
                    "flex h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    className
                )
            )}
            {...props}
        />
    );
});

Input.displayName = "Input";

export { Input };
