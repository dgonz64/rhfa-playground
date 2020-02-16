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
import 'rhfa-emergency-styles/dist/styles.css';
import { makeStyles } from '@material-ui/core/styles';
import muiComponents from './skinOverride';

const useStyles = makeStyles(theme => ({
  root: {
    '& *': {
      width: '100%'
    }
  }
}));

const thing = createSchema('thing', {
  name: {
    type: 'string',
    required: true
  },
  mass: {
    type: 'number'
  },
  type: {
    type: 'select',
    options: ['solid', 'liquid', 'gas']
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
      type: {
        _field: 'Type',
        _default: 'Select type',
        solid: 'Solid',
        liquid: 'Liquid',
        gas: 'Gas'
      }
    }
  },
  submit: 'Submit'
});

function App() {
  const [ submitted, submit ] = useState({});
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autoform
        schema={thing}
        styles={styles}
        onSubmit={submit}
        submitButton
        submitButtonText={tr('submit')}
        skinOverride={muiComponents}
      />
      <pre>{JSON.stringify(submitted)}</pre>
    </div>
  );
}

export default App;
