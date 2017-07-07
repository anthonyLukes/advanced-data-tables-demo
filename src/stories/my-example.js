import React, { PropTypes } from 'react'
import loremIpsum from 'lorem-ipsum'
import { storiesOf, action } from '@kadira/storybook';
import sortBy from 'lodash/sortBy'
import Table from '../table/TableComponent';
import '../styles.min.css';
import Wrapper from '../table/Wrapper';

const columns = [{
    key: 'name',
    label: 'Name',
},{
    key: 'role',
    label: 'Role',
    dynamicHeight: true,
    dynamicWidth: true,
    isFixed: false,
    isResizable: true
},{
    key: 'nationality',
    label: 'Nationality',
},{
    key: 'age',
    label: 'Age',
    align: 'right',
},{
    key: ':-)',
    label: ':-)',
    align: 'center',
}];

const rows = [{
    name: <div>Rochelle Graham</div>,
    role: 'Team lead',
    nationality: 'American',
    age: 12,
    ':-)': '🏄🏾',
},{
    name: 'Byron  Lowe',
    role: 'UX Designer',
    nationality: 'French',
    age: 11,
    ':-)': '🐶',
},{
    name: 'Mildred    Lindsey',
    role: 'Developer',
    nationality: 'Finnish',
    age: 14,
    ':-)': '🍹',
},{
    name: 'Tabitha    Horton',
    role: 'Developer',
    nationality: 'Australian',
    age: 12,
    ':-)': '🤘🏻',
},{
    name: 'Stephen    Hayes',
    role: 'UI Designer',
    nationality: 'German',
    age: 10,
    ':-)': '🏋',
},{
    name: 'Kerry  Long',
    role: 'Developer',
    nationality: 'Portuguese',
    age: 9,
    ':-)': '🏋🏾',
},{
    name: 'Bill   Green',
    role: 'Developer',
    nationality: 'Italian',
    age: 11,
    ':-)': '🏀',
},{
    name: 'Courtney   Wilson',
    role: 'Developer',
    nationality: 'Polish',
    age: 4,
    ':-)': '🗺',
},{
    name: 'Heather    Wilkerson',
    role: 'Developer',
    nationality: 'Romanian',
    age: 7,
    ':-)': '☕️',
}];

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
      <Wrapper columns={columns} rows={rows}>
        {(props) => {
          const {
            numberOfRows, maxHeight, cols, items, onSortChange, sortKey,
            sortDir, handleColumnResize, width, measurementResetter,
          } = props
          if (!cols) return null
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


