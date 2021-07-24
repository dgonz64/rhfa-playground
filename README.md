# Skinning with `react-hook-form-auto`

Let's create a material-ui ui with the help of `create-react-app`.

## Table of contents

* [Setup project](#setup-project)
* [String component](#string-component)
  * [Ways to set up render](#small-change)
  * [Numbers](#numbers)
* [Error reporting](#error-reporting)
* [Select](#adapting-select)
* [Rest of the components](#rest)
* [Pass parameters from schema](#tip-pass-parameters-from-schema)
* [Input array](#inputarray)
* [Controlled components](#controlled)
* [Thanks](#final-words)

## Setup project

    $ npx create-react-app rhfa-sandbox
    $ cd rhfa-sandbox/
    $ yarn add react-hook-form react-hook-form-auto -S

Now let's write a simple form invading `src/App.js`. Note that I have a very liberal use of semicolons. I hope it doesn't gets to your nerves. Please, bear with me.

```diff
import React from 'react';
-import logo from './logo.svg';
 import './App.css';
+import { createSchema, Autoform } from 'react-hook-form-auto'
+
+const thing = createSchema('thing', {
+  name: {
+    type: 'string',
+    required: true
+  },
+  mass: {
+    type: 'number'
+  },
+  type: {
+    type: 'select',
+    options: ['solid', 'liquid', 'gas']
+  }
+});
 
 function App() {
   return (
     <div className="App">
       <header className="App-header">
-        <img src={logo} className="App-logo" alt="logo" />
-        <p>
-          Edit <code>src/App.js</code> and save to reload.
-        </p>
-        <a
-          className="App-link"
-          href="https://reactjs.org"
-          target="_blank"
-          rel="noopener noreferrer"
-        >
-          Learn React
-        </a>
+        <Autoform
+          schema={thing}
+        />
       </header>
     </div>
   );
```

[This](https://github.com/dgonz64/rhfa-playground/blob/71ae301f3b815844d292a62538255b93148ea67f/src/App.js) is the resulting file.

Let's test it:

    $ yarn start

Hopefully we see some (really ugly) form in the screen. The first thing I realize is that labels are in a sort of machine code. That is because translation strings haven't been adjusted. Let's do it:

```diff
 import React from 'react';
 import './App.css';
-import { createSchema, Autoform } from 'react-hook-form-auto'
+import { createSchema, Autoform, addTranslations } from 'react-hook-form-auto'
 
 const thing = createSchema('thing', {
   name: {
@@ -16,6 +16,26 @@ const thing = createSchema('thing', {
   }
 });
 
+addTranslations({
+  models: {
+    thing: {
+      name: {
+        _field: 'Name'
+      },
+      mass: {
+        _field: 'Mass'
+      },
+      type: {
+        _field: 'Type',
+        _default: 'Select type',
+        solid: 'Solid',
+        liquid: 'Liquid',
+        gas: 'Gas'
+      }
+    }
+  }
+})
+
 function App() {
   return (
     <div className="App">
```

Result [here](https://github.com/dgonz64/rhfa-playground/blob/34e4741cc1a30864d01c344f7e56efdaac511886/src/App.js). After this change if we take a look at the browser we see that labels are good now but it's still ugly. Let's import emergency styles for now. We take the direct css-without-modules route. First install it:

    $ yarn add rhfa-emergency-styles -S

Then edit code based on [README's](https://github.com/dgonz64/rhfa-emergency-styles).

```diff
 import React from 'react';
 import './App.css';
 import { createSchema, Autoform, addTranslations } from 'react-hook-form-auto'
+import styles from 'rhfa-emergency-styles'
+import 'rhfa-emergency-styles/dist/styles.css'
 
 const thing = createSchema('thing', {
   name: {
@@ -42,6 +44,7 @@ function App() {
       <header className="App-header">
         <Autoform
           schema={thing}
+          styles={styles}
         />
       </header>
     </div>
```

Now we are talking.

Before continuing with the interesting stuff, let's write something to test if the form works:

```diff
-import React from 'react';
+import React, { useState } from 'react';
 import './App.css';
-import { createSchema, Autoform, addTranslations } from 'react-hook-form-auto'
+import {
+  createSchema,
+  Autoform,
+  addTranslations,
+  tr
+} from 'react-hook-form-auto'
 import styles from 'rhfa-emergency-styles'
 import 'rhfa-emergency-styles/dist/styles.css'
 
@@ -35,18 +40,23 @@ addTranslations({
         gas: 'Gas'
       }
     }
-  }
+  },
+  submit: 'Submit'
 })
 
 function App() {
+  const [ submitted, submit ] = useState({})
+
   return (
     <div className="App">
-      <header className="App-header">
-        <Autoform
-          schema={thing}
-          styles={styles}
-        />
-      </header>
+      <Autoform
+        schema={thing}
+        styles={styles}
+        onSubmit={submit}
+        submitButton
+        submitButtonText={tr('submit')}
+      />
+      <pre>{JSON.stringify(submitted)}</pre>
     </div>
   );
 }
```

Now every time we hit submit button, it will update the document so we can see if it works.

## String component

Let's jump to component adaptation. Material-UI allows both controlled and uncontrolled behaviour. We will take advantage of this and write uncontrolled inputs.

Install material-ui:

    $ yarn add @material-ui/core

Edit `public/index.html`:

```diff
       work correctly both with client-side routing and a non-root public URL.
       Learn how to configure a non-root public URL by running `npm run build`.
     -->
+    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
+
     <title>React App</title>
```

In order to write the component adaptor we need at least a render attribute. Let's write it in a new file called `src/skinOverride.js` whose contents are like this:

```javascript
    import React from 'react'
    import TextField from '@material-ui/core/TextField'

    export default {
      string: {
        render: {
          component: TextField
        }
      }
    }
```

Now if we execute this, we are going to have a surprise: . We are seeing older input wrapper (label and errors)

To address the problem we are going to write the wrapper. This wrapper will just forward the props to make them compatible with Material-UI.

```diff
 import React from 'react'
 import TextField from '@material-ui/core/TextField'
+import { trModel } from 'react-hook-form-auto'
+
+const ControlAdaptor = props => {
+  const { schemaTypeName, field } = props
+
+  const Comp = props.adaptorComponent
+
+  return (
+    <Comp
+      {...props}
+      label={trModel(schemaTypeName, field, '_field')}
+    />
+  )
+}
 
 export default {
+  defaultWrap: ({ children }) => children,
   string: {
-    render: {
-      component: TextField
-    }
+    render: props => ({
+      ...props,
+      component: ControlAdaptor,
+      adaptorComponent: TextField
+    })
   }
 }
```

We are doing here a lot of things.

* Import `trModel` to translate labels.
* `ControlAdaptor` will convert the props from what react-hook-form-auto provides to what component needs ([documentaton](https://github.com/dgonz64/react-hook-form-auto#skin-component)).
* For the `defaultWrap` component of the skin we simply forward it ([documentation](https://github.com/dgonz64/react-hook-form-auto#inputwrap)).

The `ControlAdaptor` will receive props that will be passed directory to `TextField` needed to make it work, like `id`, `name`, `onChange`, etc.

### Small change

The string `render` block in `src/skinOverride.js` is a function. Functions are used to make possible to adapt complex input controls but it's not needed here because we are only adding new attributes. In this case we can use a object directly.

```diff
 export default {
   defaultWrap: ({ children }) => children,
   string: {
-    render: props => ({
-      ...props,
+    render: {
       component: ControlAdaptor,
       adaptorComponent: TextField
-    })
+    }
   }
 }
```

### Numbers

It's time to take advantage of the `controlProps` we set up in `ControlAdaptor`. For the number we will just pass a `type="number"` html attribute:

```diff
       component: ControlAdaptor,
       adaptorComponent: TextField
     }
+  },
+  number: {
+    render: {
+      component: ControlAdaptor,
+      adaptorComponent: TextField,
+      controlProps: { type: 'number' }
+    }
   }
```

## Error reporting

We have to print the validation errors. First of all we will set the default language in order to get also the default translation for basic validations. In `src/App.js`:

```diff
import {
   createSchema,
   Autoform,
   addTranslations,
+  setLanguageByName,
   tr
 } from 'react-hook-form-auto';
 
 // ...
 
+setLanguageByName('en')
 addTranslations({
   models: {
     thing: {
```

Then we wire the `react-hook-form-auto` error messages to Material-UI in `src/skinOverride.js`:

```diff
 import React from 'react'
 import TextField from '@material-ui/core/TextField'
 import { trModel } from 'react-hook-form-auto'
 
 const ControlAdaptor = props => {
   const {
     id,
     name,
     defaultValue,
     onChange,
     controlProps,
+    errorText,
 
     field,
     schemaTypeName,
     adaptorComponent,
     register
   } = props
 
   const Comp = adaptorComponent
 
   // ...

   <Comp
       ...
+      error={!!errorText}
+      helperText={errorText}
     />
   )
 }

```

Now if we go to the app and try to submit without writing a name, we will see red things.

## Adapting select

This is easy by following Material-UI documentaton. I just want to note that we can use `processOptions` export from `react-hook-form-auto`. It will take the control props and will generate the options array with `{ value, label }` attributes.

```diff
 import React from 'react'
 import TextField from '@material-ui/core/TextField'
-import { trModel, tr } from 'react-hook-form-auto'
+import MenuItem from '@material-ui/core/MenuItem'
+import { trModel, tr, processOptions } from 'react-hook-form-auto'
 
 // ...

       adaptorComponent: TextField,
       controlProps: { type: 'number' }
     }
+  },
+  select: {
+    render: (props) => {
+      const { schemaTypeName, field, fieldSchema } = props
+      const options = processOptions({
+        schemaTypeName,
+        field,
+        options: fieldSchema.options,
+        addDefault: true
+      })
+
+      return {
+        ...props,
+        component: ControlAdaptor,
+        adaptorComponent: TextField,
+        controlProps: {
+          select: true,
+          children: options.map(op =>
+            <MenuItem key={op.value} value={op.value}>
+              {op.label}
+            </MenuItem>
+          )
+        }
+      }
+    }
   }
 }
```

## Rest

Now iterate. The rest of the components can be adapted without the need of additional register witchery. Just some notes.

* I filled all the coerces to let the numbers and boolean have its correct types
* Some components can be ecouraged to honor the `ref`. I use it, sometimes passing it through Material-UI's `inputProps`.
* Result [here](https://github.com/dgonz64/rhfa-playground/blob/c110a620025263384f7b443d742df8ecd0b79319/src/skinOverride.js)

## Tip: Pass parameters from schema

Access `fieldSchema` prop. It contains the original schema specification for the field. Here I pass additional config to the slider through `sliderParams` (not used in react-hook-form-auto)

```diff
@@ -52,7 +52,11 @@ const thing = createSchema('thing', {
   solid: {
     type: 'range',
     min: -273.15,
     max: 1000,
+    sliderParams: {
+      step: 10,
+      marks: [{ value: 0, label: '0 º' }, { value: 100, label: '100 º' }]
+    }
   }
 });
```

Relevant changes in the Slider code:

```diff
           setValue(name, value)
         }
 
+        const { sliderParams } = fieldSchema
+
         return (
           <div>
             <Slider
+              {...sliderParams}
               defaultValue={defaultValue || 0}
 ```

## InputArray

There's a way to convert InputArrays that doesn't involve rewritting the entire control, having to implement the logic too. It's done by using the skinable components. Instead of overriding `array`, we just have to override a couple of easier components. Those are the ones from the default skin:

```javascript
{
  // ...
  arrayButton: {
    render: Button
  },
  panel: {
    render: Panel
  },
  addGlyph: {
    render: AddGlyph
  },
  removeGlyph: {
    render: RemoveGlyph
  },
  arrayTable: {
    render: InputArrayTable
  },
  arrayPanel: {
    render: InputArrayPanel
  }
}
```

We just have to mimic InputArrayTable and InputArrayPanel. The rest of the components are trivial (Panel is a card like and the others are icons).

First we create some composable schema:

```diff
+const component = createSchema('component', {
+  name: {
+    type: 'string',
+    required: true
+  },
+  temperature: {
+    type: 'number',
+    min: -273.15,
+    max: 1000
+  },
+})
+
 const thing = createSchema('thing', {
       step: 10,
       marks: [{ value: 0, label: '0 º' }, { value: 100, label: '100 º' }]
     }
+  },
+  components: {
+    type: [component]
+  },
+  main: {
+    type: component
   }
 });
```

Then we just fill the skin components mimicking this components:

* [`InputArrayPanel`](https://github.com/dgonz64/react-hook-form-auto/blob/master/src/ui/components/InputArrayPanel.jsx). Uses boxes/cards/panels to separate elements.
* [`InputArrayTable`](https://github.com/dgonz64/react-hook-form-auto/blob/master/src/ui/components/InputArrayTable.jsx). Uses tabular arrangement.

Some pointers:

* `name` prop includes full path compatible with dom and ReactHookForm
* `items` prop will be an array of `{ idx, closeButton, inputs }`. `idx` is the index, `closeButton` a button to render somewhere and inputs an array of nodes with the rendered inputs.
* `index` will be set to the index of the current element. Please note they aren't necessarily contiguous.
* `defaultValue` possible initial values for the array

For more info take a look at [the wrapper](https://github.com/dgonz64/react-hook-form-auto/blob/master/src/ui/components/InputArrayWrap.jsx).

## Controlled components

Thanks to the amazing people behind ReactHookForm, we can adapt also controlled components. This is done under the hood by using `useController`. Example from some skinOverride that needs to control a component:

```javascript
  boolean: {
    wrapper: (props) => props.children,
    coerce: value => Boolean(value),
    controlled: true,
    render: {
      component: (props) => {
        const { id, name, value, onChange, onBlur } = props

        const label = trField(props)

        return (
          <Checkbox
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label={label}
          />
        )
      }
    }
  }
```

## Final words

With this we have a complete Material-UI skin with all the features from react-hook-form-auto.

Do you think this file can be improved? did you find mistakes? works for you? I would be happy to hear about your success or frustrations while using react-hook-form-auto.

Also if you would like something to be demonstrated or implemented, please open an issue. I would love to take a look at it!

Thanks for reading!
