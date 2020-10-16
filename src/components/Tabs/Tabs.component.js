import React, {useState} from 'react'

import style from './Tabs.module.scss'

type TypeProps = {
  children: React.ChildrenArray<React.Element>,
  onTabChange?: () => {},
}

export const Tabs = (props: TypeProps) => {
  const [selectedIndex, setIndex] = useState(0)

  const btnClick = index => e => {
    e.preventDefault()
    setIndex(index)
    typeof props.onTabChange === 'function' && props.onTabChange(index)
  }
  return (
    <div className={style.tabs}>
      <ul className={style.buttons}>
        {props.children.map((child, i) => {
          let classes = style.button
          classes += i === selectedIndex ? ` ${style.active}` : ''
          return (
            <li key={`${i}-${child.props.title}`}>
              <button className={classes} onClick={btnClick(i)}>
                {child.props['data-title'] || <span>&sbsp;</span>}
              </button>
            </li>
          )
        })}
      </ul>
      <div className={style.content}>{props.children[selectedIndex]}</div>
    </div>
  )
}

export default Tabs
