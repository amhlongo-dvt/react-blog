import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import PropTypes from 'prop-types'

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = ({ ...props }) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState } = useFormContext()
    const formState = useFormState({ name: fieldContext.name })
    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    }
}

const FormItemContext = React.createContext({})

function FormItem({ className, children, ...props }) {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                data-slot='form-item'
                className={cn('grid gap-2', className)}
                {...props}
            >
                {children}
            </div>
        </FormItemContext.Provider>
    )
}

function FormLabel({ className, children, ...props }) {
    const { error, formItemId } = useFormField()

    return (
        <Label
            data-slot='form-label'
            data-error={!!error}
            className={cn('data-[error=true]:text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        >
            {children}
        </Label>
    )
}

function FormControl({ children, ...props }) {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField()

    return (
        <Slot
            data-slot='form-control'
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        >
            {children}
        </Slot>
    )
}

function FormDescription({ className, children, ...props }) {
    const { formDescriptionId } = useFormField()

    return (
        <p
            data-slot='form-description'
            id={formDescriptionId}
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        >
            {children}
        </p>
    )
}

function FormMessage({ className, children, ...props }) {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message ?? '') : children

    if (!body) {
        return null
    }

    return (
        <p
            data-slot='form-message'
            id={formMessageId}
            className={cn('text-destructive text-sm', className)}
            {...props}
        >
            {body}
        </p>
    )
}

// PropTypes definitions
Form.propTypes = {
    children: PropTypes.node,
    // Additional FormProvider props
    ...FormProvider.propTypes,
}

FormField.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object,
    defaultValue: PropTypes.any,
    rules: PropTypes.object,
    render: PropTypes.func,
}

FormItem.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
}

FormLabel.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
}

FormControl.propTypes = {
    children: PropTypes.node,
}

FormDescription.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
}

FormMessage.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}
