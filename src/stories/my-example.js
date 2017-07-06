import React, { PropTypes } from 'react'
import loremIpsum from 'lorem-ipsum'
import { storiesOf, action } from '@kadira/storybook';
import sortBy from 'lodash/sortBy'
import {
  Button,
  FormField,
  FormInput,
  Checkbox,
  Glyph,
  FormRow,
  Row,
  Col,
} from 'elemental'
import Table from '../table/Table';
import '../styles.min.css';

const columns = [{
    key: 'name',
    label: 'Name',
},
{
    key: 'role',
    label: 'Role',
    dynamicHeight: true,
    dynamicWidth: true,
    isFixed: false,
    isResizable: true
},
{
    key: 'nationality',
    label: 'Nationality',
},
{
    key: 'age',
    label: 'Age',
    align: 'right',
},
{
    key: ':-)',
    label: ':-)',
    align: 'center',
}];

const rows = [{
    name: 'Rochelle\nGraham',
    role: 'Team lead',
    nationality: 'American',
    age: 12,
    ':-)': '🏄🏾',
},
{
    name: 'Byron  Lowe',
    role: 'UX Designer',
    nationality: 'French',
    age: 11,
    ':-)': '🐶',
},
{
    name: 'Mildred    Lindsey',
    role: 'Developer',
    nationality: 'Finnish',
    age: 14,
    ':-)': '🍹',
},
{
    name: 'Tabitha    Horton',
    role: 'Developer',
    nationality: 'Australian',
    age: 12,
    ':-)': '🤘🏻',
},
{
    name: 'Stephen    Hayes',
    role: 'UI Designer',
    nationality: 'German',
    age: 10,
    ':-)': '🏋',
},
{
    name: 'Kerry  Long',
    role: 'Developer',
    nationality: 'Portuguese',
    age: 9,
    ':-)': '🏋🏾',
},
{
    name: 'Bill   Green',
    role: 'Developer',
    nationality: 'Italian',
    age: 11,
    ':-)': '🏀',
},
{
    name: 'Courtney   Wilson',
    role: 'Developer',
    nationality: 'Polish',
    age: 4,
    ':-)': '🗺',
},
{
    name: 'Heather    Wilkerson',
    role: 'Developer',
    nationality: 'Romanian',
    age: 7,
    ':-)': '☕️',
}];

/**
 * Generates a random lorem ipsum string
 * @param  {Boolean} dynamicWidth
 * @param  {Boolean} dynamicHeight
 * @return {String}
 */
const generateValue = ({ dynamicWidth, dynamicHeight }) => {
  let config = {
    count: 1,
    units: 'words'
  }
  if (dynamicWidth) {
    config = {
      count: 1,
      units: 'sentences',
    }
  }
  if (dynamicHeight) {
    config = {
      units: 'paragraphs',
      // 4 paragraphs
      count: Math.round(Math.random() * 10),
      // only one word per sentence
      sentenceUpperBound: 1,
      // only one sentence per paragraph
      paragraphUpperBound: 1,
    }
  }
  if (dynamicHeight && dynamicWidth) {
    config = {
      units: 'paragraphs',
      count: Math.round(Math.random() * 10),
      sentenceUpperBound: 8,
      paragraphUpperBound: 3,
    }
  }
  return loremIpsum(config)
}

/**
 * Generates the table row data according to the column definition
 * @param  {Object} cols
 * @param  {Number} numberOfRows
 * @return {[Object]}
 */
const generateItems = (cols, items = [], numberOfRows) => {
  if (items.length === numberOfRows) return items
  let newItems = []
  if (numberOfRows > items.length) {
    newItems = Array.from({ length: numberOfRows - items.length }).map(() =>
      cols.reduce((acc, col) => (
        { ...acc, [col.key]: generateValue(col) }
      ), {})
    )
  } else {
    newItems = items.slice(0, numberOfRows)
  }
  return [...items, ...newItems]
}

const generateItemsWithChangedColumn = ({ cols, changedCol, items }) => {
  return items.map(item => ({
    ...item,
    [changedCol.key]: generateValue(changedCol)
  }))
}
/**
 * This function gets called for every cell in the table (for every row and
 * column combination). Its return value will be rendered as the cell inside the
 * table. It is also used inside CellMeasurer to detect the dimensions of this
 * cell.
 * @param  {Object} item
 * @param  {String} columnKey
 * @return {Node}
 */
const itemRenderer = (item, columnKey) => (
  <div style={{ padding: '10px', whiteSpace: 'pre' }}>
    {item[columnKey]}
  </div>
)

storiesOf('Table', module)
  .add('My Example', () =>
    (
      <Wrapper>
        {(props) => {
          const {
            numberOfRows, maxHeight, cols, items, onSortChange, sortKey,
            sortDir, handleColumnResize, width, measurementResetter,
          } = props
          if (!cols) return null
          console.log('cols (wrapper)', cols);
          console.log("items (wrapper)", items);
          return (
            <Table
              maxHeight={maxHeight}
              columns={cols}
              rowCount={numberOfRows}
              itemRenderer={({ rowIndex, columnKey }) =>
                itemRenderer(items[rowIndex], columnKey)
              }
              onSortChange={onSortChange}
              sortBy={sortKey}
              sortDirection={sortDir}
              onColumnResize={handleColumnResize}
              width={width}
              measurementResetter={measurementResetter}
            />
          )
        }}
      </Wrapper>
    )
  )

const defaultColProps = {
  isFixed: false,
  dynamicWidth: false,
  dynamicHeight: false,
  isSortable: false,
  isResizable: true,
}

const Wrapper = React.createClass({
  propTypes: {
    children: PropTypes.func.isRequired,
  },
  getInitialState () {
    const cols = columns;
    const items = rows
    console.log('cols (getInitialState)', cols);
    console.log('items (getInitialState)', items);

    return {
      numberOfRows: items.length,
      maxHeight: 500,
      cols,
      width: null,
      items,
      sortedItems: items,
    }
  },
  resetMeasurementsCache: false,
  resetColumnCache: false,
  /**
   * Gets called before every render of the Table to find out whether the cells
   * need to be remeasured. If the measurements are not reset the cached cell
   * dimensions will be used.
   * In this demo the measurement cache needs to be reset whenever the dynamic
   * width/height option is en-/disabled on a column.
   * Resetting the measurement cache is only necessary when cell contents
   * have changed their dimensions.
   */
  measurementResetter ({ resetMeasurements, resetMeasurementForColumn }) {
    if (this.resetColumnCache !== false && this.resetColumnCache >= 0) {
      action('reset measurements for column')(this.resetColumnCache)
      resetMeasurementForColumn(this.resetColumnCache)
      this.resetColumnCache = false
    }
    if (this.resetMeasurementsCache) {
      action('reset all measurements')()
      resetMeasurements()
      this.resetMeasurementsCache = false
    }
  },
  handleChangeNumberOfRows (e) {
    const numberOfRows = parseInt(e.target.value, 10)
    const items = generateItems(this.state.cols, this.state.items, numberOfRows)
    this.setState({
      items,
      sortedItems: items,
      numberOfRows,
    })
  },
  handleTableMaxHeightChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  },
  handleColChange (e, index) {
    const { state: { cols } } = this
    let val = e.target.value
    const column = cols[index]
    if (typeof column[e.target.name] === 'boolean')
      val = e.target.checked
    const changedCol = {
      ...column,
      [e.target.name]: val,
    }
    const newCols = [
      ...cols.slice(0, index),
      changedCol,
      ...cols.slice(index + 1)
    ]
    this.resetColumnCache = index
    if (e.target.name === 'dynamicHeight') {
      // if the column's dynamicHeight setting was changed, we need to
      // recalculate all row heights, which is the same as recalculating
      // everything
      this.resetMeasurementsCache = true
    }
    this.handleApplyCols(newCols, changedCol)
  },
  handleAddColumn () {
    const { state: { cols } } = this
    const numberOfCols = cols.length
    const newCol = {
      key: `column-${numberOfCols}`,
      label: `Column ${numberOfCols}`,
      ...defaultColProps,
    }
    const newCols = [
      ...cols,
      newCol,
    ]
    this.handleApplyCols(newCols, newCol)
  },
  handleApplyCols (cols, changedCol) {
    const { state: { items } } = this
    const newItems = generateItemsWithChangedColumn({
      cols,
      changedCol: changedCol,
      items,
    })
    this.setState({
      items: newItems,
      sortedItems: newItems,
      cols,
    })
  },
  handleRemoveColumn (index) {
    const { state: { cols } } = this
    this.setState({
      cols: [
        ...cols.slice(0, index),
        ...cols.slice(index + 1),
      ],
    })
  },
  handleColumnResize (width, colKey, allColWidths) {
    const { state: { cols } } = this
    const colIndex = cols.findIndex(col => col.key === colKey)
    const newCols = {
      ...cols.reduce((acc, col, index) => ({
        ...acc,
        [index]: {
          ...col,
          width: allColWidths[col.key],
          flexGrow: 0,
        },
      }), {}),
      [colIndex]: { ...cols[colIndex], width, flexGrow: 0 },
    }
    const totalWidth = Object.values(newCols)
      .reduce((acc, col) => acc + col.width, 0)
    this.setState({
      cols: Object.values(newCols),
      width: totalWidth,
    })
  },
  onSortChange (columnKey, sortDir) {
    const { state: { items } } = this
    const sortedItems = sortBy(items, columnKey)
    if (sortDir === 'DESC')
      sortedItems.reverse()
    this.setState({ sortedItems, sortKey: columnKey, sortDir })
  },
  render () {
    const {
      onSortChange, handleColumnResize, measurementResetter,
      state: {
        numberOfRows, maxHeight, cols, sortedItems, sortKey,
        sortDir, width,
      },
    } = this
    return (
      <div style={{ padding: '0 16px' }}>

            <div style={{ padding: '16px 0' }}>
              <h3>{'Table'}</h3>
              {this.props.children({
                numberOfRows: parseInt(numberOfRows, 10),
                maxHeight: parseInt(maxHeight, 10),
                cols,
                items: sortedItems,
                onSortChange,
                sortKey,
                sortDir,
                handleColumnResize,
                width,
                measurementResetter,
              })}
            </div>
      </div>
    )
  },
})
