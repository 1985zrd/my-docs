# 前端可视化页面搭建—拖拽（react-dnd）

> 最近开发了一个活动运营平台系统，可以通过模板拖拽生成页面，可以预览、复制、上架、下架页面，可以查看页面的pv、uv，查看页面转化率，等...。

简单说一下页面生成流程：
1. 平台生成页面数据，提交到后端
2. 后端生成页面地址，返回到前端（地址+查询字符串）

下面记录一下页面生成中使用到的拖拽-`react-dnd`

## 为什么要用react-dnd
因为项目使用的框架是react，于是去github搜索了一下关键词`react drag`，排名第一的就是`react-dnd`，对比排名前几的插件后，决定就用它了，因为它的文档很详细，示例也很多，用的人也蛮多的。

## 安装
[react-dnd github地址](https://www.npmjs.com/package/react-dnd)

[react-dnd doc](https://react-dnd.github.io/react-dnd/examples/sortable/simple)
```
npm i react-dnd react-dnd-html5-backend
```

## 使用
api去查文档，这里不描述了。

1、首先需要创建一个包裹组件
```
// Dnd.js，可以直接渲染这个组件，也可以放到App.js里
import React, { useState } from 'react'

import Left from '@/components/Left/Left'
import Right from '@/components/Right/Right'
import Center from '@/components/Center/Center'

import { DndProvider } from 'react-dnd'

import HTML5Backend from 'react-dnd-html5-backend'

let tem = { // 这里模拟一下模板数据，根据需要设置数据
  img: {
    code: 1,
    message: '图片'
  },
  goods: {
    code: 2,
    message: '商品',
    child: [
      {
        code: 21,
        message: '商品-1',
      },
      {
        code: 22,
        message: '商品-2',
      }
    ]
  },
  info: {
    code: 3,
    message: '信息收集',
    child: [
      {
        code: 31,
        message: '信息-1',
      },
      {
        code: 32,
        message: '信息-2',
      }
    ]
  }
}

function Dnd () {
  let [pageConponent, setPageConponent] = useState([]) // 存储页面数据

  const dragHandle = (item) => { // 左侧拖到中间后会触发这个函数
    setPageConponent([...pageConponent, item])
  }
  const sortPageComponent = (dragIndex, hoverIndex, item, parentIndex) => {
    // 模板排序会触发这个函数。（当前拖拽元素下标，拖拽时鼠标下元素的下标，拖拽元素数据，父元素下标）
    // 千万不要学我这么处理
    if (item.type !== 'CARD' && item.type !== 'MoveItem') { // 子元素里的拖拽，模板数据里的child
      let origin = JSON.parse(JSON.stringify(pageConponent[parentIndex]))
      let data = [...origin.child]
      let s = data.splice(dragIndex, 1)
      data.splice(hoverIndex, 0, ...s)
      origin.child = data
      console.log(data)
      let pageComponentCopy1 = [...pageConponent]
      pageComponentCopy1.splice(parentIndex, 1, origin)
      setPageConponent(pageComponentCopy1)
    } else {
      if(dragIndex === undefined || hoverIndex === undefined) {
        return
      }
      let pageComponentCopy = [...pageConponent]
      let cutItem = pageComponentCopy.splice(dragIndex, 1)
      pageComponentCopy.splice(hoverIndex, 0, ...cutItem)
      setPageConponent(pageComponentCopy)
    }
  }
  return (
    <div className="dnd_page">
      <DndProvider backend={HTML5Backend}>
        <Left 
          itemTypes="CARD" // 值相同才可以拖拽
          data={tem}
          pageConponent={pageConponent}
          dragHandle={dragHandle}
        />
        <Center 
          itemTypes="CARD"
          sortPageComponent={sortPageComponent}
          data={pageConponent}
        />
        <Right
          sortPageComponent={sortPageComponent}
          data={pageConponent}
        />
      </DndProvider>
    </div>
  )
}

export default Dnd

```
把页面分了左中右，左侧是模板，中间是生成的页面（也可以排序），右侧可以修改模板参数和模板排序

2、左侧模板模块
```
// Left.js
import React from 'react'
import SourceBox from './SouceBox'

function Left ({data, itemTypes, dragHandle, pageConponent }) {
  // console.log(props)
  return (
    <div className="dnd_page_left">
      {Object.keys(data).map(key => {
        // let forbidDrag = pageConponent.filter(component => {
        //   return data[key].code === component.code
        // }).length === 1
        let forbidDrag = false // 可以控制是否可拖拽，在SourceBox里
        return (
          <SourceBox
            key={data[key].code}
            forbidDrag={forbidDrag}
            item={data[key]}
            itemTypes={itemTypes}
            dragHandle={dragHandle}
          ></SourceBox>
        )
      })}
    </div>
  )
}

export default Left

```
```
// sourceBox.js
import React from 'react'
import { DragSource } from 'react-dnd'
import ItemTypes from '@/utils/itemTypes'

function Item ({item, isDragging, connectDragSource, forbidDrag}) {
  const opacity = isDragging ? 0.4 : 1
  console.log(forbidDrag)
  return (
    <div
      ref={connectDragSource}
      style={{ opacity, cursor: 'move', lineHeight: '36px', borderBottom: '1px solid #e5e5e5' }}
      className="left_item"
    >{item.message}</div>
  )
  }
  
export default DragSource(
  props => {
    return ItemTypes[props.itemTypes] // 要相同的类型才可以拖放
  },
  {
    // canDrag: props => {console.log('props.forbidDrag', props.forbidDrag); return !props.forbidDrag},
    canDrag: props => !props.forbidDrag,
    beginDrag: (props, monitor, conponent) => {
      console.log('beginDrag------', props, monitor, conponent)
      return ({nameFlag: Item})
    },
    endDrag(props, monitor) {
      // const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      console.log('000000',dropResult, props)
      console.log(props.dragHandle)
      if (dropResult) {
        props.dragHandle(props.item)
        // alert(`You dropped ${item.name} into ${dropResult.name}!`)
      }
      // props.setPage({leftToMiddleHoverIndex: undefined})
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(Item)

```
3、中间展示模块。页面生成的最终效果。这个模块既能接收左侧模板拖拽过来的组件，也能拖拽排序。
```
import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from '@/utils/itemTypes'

// import DragDropWrap from './DragDropWrap'
import SortModule from '../Right/SortModule'

function Center ({connectDropTarget, sortPageComponent, data, itemTypes}) {
  // console.log(data)
  return (
    <div
      className="dnd_page_center"
      ref={connectDropTarget} // 拖拽的目标
    >
      {Object.keys(data).map((key, index) => {
        return (
          <SortModule // 大组件，第一层数据
            // type='CHILD'
            type={itemTypes}
            key={data[key].code}
            data={data[key]}
            id={data[key].code}
            index={index}
            sortPageComponent={sortPageComponent}
          >
            {
              data[key].child && data[key].child.map((child, i) => { // 如果有子组件，子组件也可以拖拽排序。子组件添加、复制都可以
                return (<SortModule
                  type='CHILD'
                  key={child.code}
                  data={child}
                  id={child.code}
                  index={i}
                  parentIndex={index}
                  sortPageComponent={sortPageComponent}
                ></SortModule>)
              })
            }
          </SortModule>
        )
      })}
    </div>
  )
}

// function Item ({item}) {
//   return (
//     <div>{ item.message }</div>
//   )
// }

export default DropTarget(
  props => {
    return ItemTypes[props.itemTypes] // 这个是拖拽后最外层数据用到的，必须跟左侧的一致。
  },
  {
    drop: () => ({name: 'Center'}), // 取个名字，后面取值可能用到
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
)(Center)
```

4、右侧模块。这边一般设置一些页面数据（title之类的）、模块数据（如：图片模块样式、跳转....）、模块排序（中间模块也可以排序，但是页面太长的话，排序不方便）。
```
import React from 'react'
import SortModule from './SortModule'

function Right ({data, sortPageComponent}) {
  return (
    <div className="dnd_page_right">
      {Object.keys(data).map((key, index) => {
        return (
          <SortModule
            type={'MoveItem'} // 主要是这个不一样。能不能拖拽，拖拽到哪里，都是由这个配合控制
            key={data[key].code}
            data={data[key]}
            id={data[key].code}
            index={index}
            sortPageComponent={sortPageComponent}
          ></SortModule>
        )
      })}
    </div>
  )
}

export default Right
```

```
// SortModule.js
import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const SortModule = ({ data, type, id, index, moveCard, sortPageComponent, children, parentIndex }) => {
  const dragRef = useRef(null)
  const dropRef = useRef(null)
  const [toTop, setToTop] = useState(false)
  let accept = type === 'CHILD' ? 'CHILD' + parentIndex : type
  const [{ isOver }, drop] = useDrop({
    accept: accept,
    hover (item, monitor) {
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      setToTop(dragIndex > hoverIndex)
    },
    drop(item, monitor) {
      if (!dragRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dragRef.current.getBoundingClientRect()
      // Get vertical middle
      /* eslint-disable */
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return
      // }
      // Time to actually perform the action
      console.log(item)
      console.log(parentIndex)
      sortPageComponent(dragIndex, hoverIndex, item, parentIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })
  /* eslint-disable */
  const [{ isDragging }, drag, previewDrag] = useDrag({
    item: { type: accept, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(dropRef))
  drag(dragRef)
  // drag(drop(dragRef))

  const style = toTop ? {
    borderTop: isOver ? '2px solid #3F94FC': '2px solid rgba(0,0,0,0)'
  } : {
    borderBottom: isOver ? '2px solid #3F94FC': '2px solid rgba(0,0,0,0)'
  }
  console.log(type)
  return (
    <div ref={dropRef}>
      <div ref={previewDrag}  style={{...style}}  className="right-sort-module">
      <p ref={dragRef}>{ data.message }</p>
        {/* <span ref={dragRef} className="right-sort-module__item__content__target"></span>
        <span>{name}</span> */}
      {
        children && children
      }
      </div>
    </div>
    // childrenFunc({dragRef, dropRef, previewDrag, index, isOver, toTop, ...ownProps})
  )
}
export default SortModule

```

## 总结
这里用一个demo记录一下项目中用到的拖拽，跟实际项目有一定的出入。可以去官网查看api，做出更丰富的应用。

[我的git地址](https://github.com/1985zrd/dnd-react)