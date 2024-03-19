import React, { ReactNode } from "react"
import "./Button.scss"

type ReactButtonAndLink = JSX.IntrinsicElements["button"] & JSX.IntrinsicElements["a"];

export type TVariant = "regular" | "outline" | "ghost";

export type TColor = "primary" | "error" | "warning" | "secondary" | "gray";

export type TSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ButtonProps extends ReactButtonAndLink {
    variant?: TVariant;
    color?: TColor;
    size?: TSize;
    tag?: string;
    className?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    loading?: boolean;
    children?: ReactNode;
}

const Button = (
    {
        children = "",
        variant = "regular",
        color = "primary",
        size = "lg",
        tag = "button",
        className = "",
        onClick,
        loading,
        ...props
    }: ButtonProps
) => {
    const ButtonTag: any = tag

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (loading) {
            return
        }

        if (onClick) {
            onClick(event)
        }
    }

    return (
        <ButtonTag
            className={`button button-${variant} button-${color} button-${size} ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </ButtonTag>
    )
}

export default Button
