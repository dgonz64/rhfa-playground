import React from 'react';
import './App.css';
import { createSchema, Autoform, addTranslations } from 'react-hook-form-auto'

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
  }
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Autoform
          schema={thing}
        />
      </header>
    </div>
  );
}

export default App;
