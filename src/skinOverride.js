import React from 'react'
import TextField from '@material-ui/core/TextField'
import { trModel } from 'react-hook-form-auto'

const ControlAdaptor = props => {
  const {
    name,
    defaultValue,
    controlProps,

    field,
    schemaTypeName,
    adaptorComponent,
    register
  } = props

  const Comp = adaptorComponent

  return (
    <Comp
      {...controlProps}
      name={name}
      defaultValue={defaultValue}
      inputProps={{ ref: register }}
      label={trModel(schemaTypeName, field, '_field')}
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
