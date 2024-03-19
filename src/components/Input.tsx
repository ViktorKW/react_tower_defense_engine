import "./Input.scss"
import { InputHTMLAttributes, ReactNode } from "react"

export interface TInputProps extends InputHTMLAttributes<any> {
    register: Function;
    error?: { message?: string };
    label?: ReactNode;
    id?: string;
    prefix?: string;
    customPrefix?: ReactNode;
    postfix?: string;
    type?: string;
}

export const Input = ({
    register,
    error,
    label,
    className,
    id,
    prefix,
    postfix,
    customPrefix,
    type = "text",
    ...props
}: TInputProps) => {
    const getControlClassNames = (): string => {
        const result = []

        error && result.push("form-control--error")
        postfix && result.push("form-control--postfix")

        className && result.push(className)

        return result.join(" ")
    }

    return (
        <div className={`form-control ${getControlClassNames()}`}>
            {label && <label className="control__label" htmlFor={id}>{label}</label>}

            <div className="control__field">
                {customPrefix && <div className="control__prefix custom">{customPrefix}</div>}
                {prefix && <div className="control__prefix">{prefix}</div>}
                {postfix && <div className="control__postfix">{postfix}</div>}

                <input
                    className="control__input"
                    id={id}
                    type={type}
                    {...register(props.name)}
                    {...props}
                />
            </div>

            {error && <div className="control__hint control__hint--error">{error?.message}</div>}
        </div>
    )
}

export default Input
