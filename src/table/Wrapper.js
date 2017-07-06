import React, { PropTypes } from 'react'

const defaultColProps = {
  isFixed: false,
  dynamicWidth: false,
  dynamicHeight: false,
  isSortable: false,
  isResizable: true,
}

const Wrapper = React.createClass({
  propTypes: {
    children: PropTypes.func.isRequired
  },
  getInitialState () {
    const cols = this.props.columns;
    const items = this.props.rows;
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

export default Wrapper
