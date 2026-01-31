import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? motion.div : motion.button;

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
        secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
        ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        icon: "h-10 w-10 p-2",
    };

    return (
        <Comp
            ref={ref}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});
Button.displayName = "Button";
