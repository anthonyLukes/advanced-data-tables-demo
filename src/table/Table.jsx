import React, {Component} from 'react';
import Wrapper from './Wrapper.js';
import TableComponent from './TableComponent';
import Column from './Column.jsx';

const itemRenderer = (item, columnKey) => (
  <div style={{ padding: '10px', whiteSpace: 'pre' }}>
    {item[columnKey]}
  </div>
);

export default class Table extends Component {
    static propTypes = {

    }

    static defaultProps = {

    }

    constructor(props, context) {
        super(props, context);
        this.state = { };
    }

    getColumns() {
        let children = this.props.children;
        let cols = [];
        React.Children.forEach(children, function(child, i) {
            if (child && child.type) {
                if (child.type.name === 'Column') {
                    cols.push({ key: child.props.keyName, label: child.props.header, renderer: child.props.children });
                }
            }
        });
        return cols;
    }

    getRows(columns) {
        // build object of renderers to apply to each column in each row
        let renderers = {};
        columns.forEach(function(column) {
            if (column.renderer) {
                renderers[column.key] = column.renderer
            }
        });


        let hydratedRows = [];
        this.props.rows.forEach(function(row) {
            let hydratedRow = {};
            for (var prop in row) {
                let content = row[prop];
                let renderer = renderers[prop];
                hydratedRow[prop] = renderer ? renderer(content) : content;
            }
            hydratedRows.push(hydratedRow);
        });

        return hydratedRows;
    }

    render() {
        let cols = this.getColumns();
        let rows = this.getRows(cols);
        return (
            <Wrapper columns={cols} rows={rows}>
                {(props) => {
                  const {
                    numberOfRows, maxHeight, cols, items, onSortChange, sortKey,
                    sortDir, handleColumnResize, width, measurementResetter,
                  } = props
                  if (!cols) return null
                  return (
                    <TableComponent
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
        );
    }
};

module.exports.Column = Column;