import React from 'react'

const renderItems = ({ items, Panel }) =>
  items.map(({ idx, closeButton, inputs }) =>
    <Panel key={idx} header={closeButton}>
      {inputs}
    </Panel>
  )

export const ArrayPanel = (props) => {
  const { skin } = props
  const Panel = skin.panel.render

  return (
    <>
      {renderItems({ ...props, Panel })}
    </>
  )
}

