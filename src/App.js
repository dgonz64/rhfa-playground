import React, { useState } from 'react';
import './App.css';
import {
  createSchema,
  Autoform,
  addTranslations,
  setLanguageByName,
  tr
} from 'react-hook-form-auto';
import styles from 'rhfa-emergency-styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import muiComponents from './skinOverride';

const width = 400

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      width
    },
    '& .MuiSlider-root': {
      width
    }
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
}));

const thing = createSchema('thing', {
  name: {
    type: 'string',
    required: true
  },
  mass: {
    type: 'number',
    min: 0,
    max: 20
  },
  state: {
    type: 'select',
    options: ['solid', 'liquid', 'gas']
  },
  rare: {
    type: 'boolean'
  },
  magnetic: {
    type: 'radios',
    options: ['ferro', 'diam']
  },
  solid: {
    type: 'range',
    min: -273.15,
    max: 1000
  }
});

setLanguageByName('en')
addTranslations({
  models: {
    thing: {
      name: {
        _field: 'Name'
      },
      mass: {
        _field: 'Mass'
      },
      state: {
        _field: 'State',
        _default: 'Select type',
        solid: 'Solid',
        liquid: 'Liquid',
        gas: 'Gas'
      },
      rare: 'Is a rare material',
      magnetic: {
        _field: 'Magnetic type',
        ferro: 'Ferromagnetic',
        diam: 'Diamagnetic'
      },
      solid: {
        _field: 'Solidification temperature'
      }
    }
  },
  submit: 'Submit'
});

function App() {
  const [ submitted, submit ] = useState({});
  const classes = useStyles();
  const hasSubmitData = Object.keys(submitted).length > 0

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Autoform
          schema={thing}
          styles={styles}
          onSubmit={submit}
          submitButton
          submitButtonText={tr('submit')}
          skinOverride={muiComponents}
        />
      </Container>
      <pre>{hasSubmitData && JSON.stringify(submitted)}</pre>
    </div>
  )
}

export default App;
