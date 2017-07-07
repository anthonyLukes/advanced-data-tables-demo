import React, { PropTypes } from 'react'
import loremIpsum from 'lorem-ipsum'
import { storiesOf, action } from '@kadira/storybook';
import sortBy from 'lodash/sortBy'
import Table, { Column } from '../table/Table.jsx';
import '../styles.min.css';

const rows = [{
    name: <div>Rochelle<br/>Graham</div>,
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

storiesOf('Table', module)
    .add('Final Example', () => (
        <Table rows={rows}>
            <Column
                isResizable
                flexGrow={0}
                width={150}
                keyName="name"
                header="Name">
                    {(row) => (
                        <div style={{color: 'green' }}>
                            {row}
                        </div>
                    )}
            </Column>
            <Column
                keyName="role"
                header="Role" />
        </Table>
    )
  )


