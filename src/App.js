import React, { useState } from 'react';
import './App.css';
import {
  createSchema,
  Autoform,
  addTranslations,
  tr
} from 'react-hook-form-auto'
import styles from 'rhfa-emergency-styles'
import 'rhfa-emergency-styles/dist/styles.css'

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
})

function App() {
  const [ submitted, submit ] = useState({})

  return (
    <div className="App">
      <Autoform
        schema={thing}
        styles={styles}
        onSubmit={submit}
        submitButton
        submitButtonText={tr('submit')}
      />
      <pre>{JSON.stringify(submitted)}</pre>
    </div>
  );
}

export default App;
