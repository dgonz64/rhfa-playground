import React from 'react'
import {
  TextField,
  MenuItem,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Typography,
  Slider,
  Button,
  IconButton,
  Card,
  CardContent
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { ArrayTable } from './components/ArrayTable'
import { ArrayPanel } from './components/ArrayPanel'
import { trField, tr, processOptions } from 'react-hook-form-auto'

const ControlAdaptor = props => {
  const {
    name,
    defaultValue,
    controlProps,
    errors,

    field,
    fieldSchema,
    adaptorComponent,
    register
  } = props

  const error = errors[field]
  const errorText = typeof error == 'object' ? tr(error.message, fieldSchema) : ''
  const Comp = adaptorComponent

  return (
    <div>
      <Comp
        {...controlProps}
        key={name}
        name={name}
        defaultValue={defaultValue || ''}
        inputProps={{ ref: register }}
        label={trField(props)}
        error={!!errorText}
        helperText={errorText}
      />
    </div>
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
    coerce: value => parseFloat(value),
    render: {
      component: ControlAdaptor,
      adaptorComponent: TextField,
      controlProps: { type: 'number' }
    }
  },
  password: {
    render: {
      component: ControlAdaptor,
      adaptorComponent: TextField,
      controlProps: { type: 'password' }
    }
  },
  select: {
    render: (props) => {
      const { schemaTypeName, name, field, fieldSchema, register, setValue } = props

      const options = processOptions({
        ...props,
        addDefault: true
      })

      register({ name })
      const setValueFromEvent = event => {
        setValue(name, event.target.value)
      }

      return {
        ...props,
        component: ControlAdaptor,
        adaptorComponent: TextField,
        controlProps: {
          select: true,
          onChange: setValueFromEvent,
          children: options.map(op =>
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          )
        }
      }
    }
  },
  boolean: {
    coerce: value => Boolean(value),
    render: {
      component: (props) => {
        const { register, name, defaultValue } = props

        return (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  inputProps={{ ref: register }}
                  defaultValue={defaultValue}
                />
              }
              label={trField(props)}
            />
          </div>
        )
      }
    }
  },
  radios: {
    render: {
      component: (props) => {
        const { name, register, defaultValue } = props

        const label = trField(props)
        const options = processOptions(props)
        const inputProps = {
          ref: register
        }

        return (
          <div>
            <FormLabel component="legend">
              {label}
            </FormLabel>
            <RadioGroup
              aria-label={label}
              name={name}
              defaultValue={defaultValue || 0}
            >
              {
                options.map(op =>
                  <FormControlLabel
                    name={name}
                    key={op.value}
                    value={op.value}
                    control={<Radio inputProps={inputProps} />}
                    label={op.label}
                  />
                )
              }
            </RadioGroup>
          </div>
        )
      }
    }
  },
  range: {
    coerce: value => parseFloat(value),
    render: {
      component: (props) => {
        const { name, defaultValue, fieldSchema, register, setValue } = props

        register({ name })
        const setValueFromEvent = (event, value) => {
          setValue(name, value)
        }

        const { sliderParams } = fieldSchema

        return (
          <div>
            <Typography id={name} gutterBottom>
              {trField(props)}
            </Typography>
            <Slider
              {...sliderParams}
              defaultValue={defaultValue || 0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              min={fieldSchema.min}
              max={fieldSchema.max}
              onChange={setValueFromEvent}
            />
          </div>
        )
      }
    }
  },
  button: {
    render: ({ styles, ...rest }) => {
      if (rest.type == 'submit')
        return <Button color="primary" {...rest} />
      else
        return <Button {...rest} />
    }
  },
  arrayButton: {
    render: ({ styles, ...rest }) =>
      <IconButton size="small" {...rest} />
  },
  form: {
    render: ({ children, onSubmit }) =>
      <form onSubmit={onSubmit}>
        {children}
      </form>
  },
  panel: {
    render: ({ children, header }) =>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {header}
          </Typography>
          <Typography variant="body2" component="p">
            {children}
          </Typography>
        </CardContent>
      </Card>
  },
  addGlyph: {
    render: () =>
      <AddIcon fontSize="small" />
  },
  removeGlyph: {
    render: () =>
      <RemoveIcon fontSize="small" />
  },
  arrayTable: {
    render: ArrayTable
  },
  arrayPanel: {
    render: ArrayPanel
  }
}
