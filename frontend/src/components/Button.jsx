import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ variant = 'default', className, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200";
    
    const variantClasses = {
        primary: "gradient-primary text-white hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-indigo-500/50 focus:ring-offset-neutral-900 shadow-md",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-500/50 focus:ring-offset-neutral-900 border border-neutral-700",
        ghost: "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white focus:ring-white/30 focus:ring-offset-neutral-900 border border-neutral-800",
        default: "bg-white text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-500/50 focus:ring-offset-white border border-neutral-300 shadow-sm hover:shadow-md"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                clsx(
                    baseClasses,
                    variantClasses[variant] || variantClasses.default,
                    className
                )
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = "Button";

export { Button };
