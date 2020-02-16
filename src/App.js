import React from 'react';
import './App.css';
import { createSchema, Autoform } from 'react-hook-form-auto'

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
