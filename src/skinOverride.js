import React from 'react'
import TextField from '@material-ui/core/TextField'
import { trModel } from 'react-hook-form-auto'

const ControlAdaptor = props => {
  const { schemaTypeName, field } = props

  const Comp = props.adaptorComponent

  return (
    <Comp
      {...props}
      label={trModel(schemaTypeName, field, '_field')}
    />
  )
}

export default {
  defaultWrap: ({ children }) => children,
  string: {
    render: props => ({
      ...props,
      component: ControlAdaptor,
      adaptorComponent: TextField
    })
  }
}
