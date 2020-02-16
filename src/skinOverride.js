import React from 'react'
import TextField from '@material-ui/core/TextField'
import { trModel, tr } from 'react-hook-form-auto'

const ControlAdaptor = props => {
  const {
    name,
    defaultValue,
    controlProps,
    errors,

    field,
    fieldSchema,
    schemaTypeName,
    adaptorComponent,
    register
  } = props

  const error = errors[field]
  const errorText = typeof error == 'object' ? tr(error.message, fieldSchema) : ''
  const Comp = adaptorComponent

  return (
    <Comp
      {...controlProps}
      name={name}
      defaultValue={defaultValue}
      inputProps={{ ref: register }}
      label={trModel(schemaTypeName, field, '_field')}
      error={!!errorText}
      helperText={errorText}
    />
  )
}

export default {
  defaultWrap: ({ children }) => children,
  string: {
    render: {
      component: ControlAdaptor,
      adaptorComponent: TextField
    }
  },
  number: {
    render: {
      component: ControlAdaptor,
      adaptorComponent: TextField,
      controlProps: { type: 'number' }
    }
  }
}
