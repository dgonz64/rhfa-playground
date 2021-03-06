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

const width = '90%'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      width
    },
    '& .MuiSlider-root': {
      width
    },
    '& .MuiCard-root': {
      maxWidth: width
    }
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
}));

const component = createSchema('component', {
  name: {
    type: 'string',
    required: true
  },
  temperature: {
    type: 'number',
    min: -273.15,
    max: 1000
  },
})

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
    max: 1000,
    sliderParams: {
      step: 10,
      marks: [{ value: 0, label: '0 º' }, { value: 100, label: '100 º' }]
    }
  },
  components: {
    type: [component]
  },
  main: {
    type: component
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
      },
      components: 'Components'
    },
    component: {
      main: 'Main component',
      name: 'Name',
      temperature: 'Temperature'
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
