import * as fs from 'fs';
import * as path from 'path';
import {graphql}  from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';

// Assume your schema is in ../data/schema
import {executableSchema as schema} from './index';

// Save JSON of full schema introspection for Babel Relay Plugin to use
graphql(schema, introspectionQuery).then(result => {
    fs.writeFileSync(
    `./generated/schema.json`,
    JSON.stringify(result, null, 2)
    );
});

// Save user readable type system shorthand of schema
fs.writeFileSync(
    `./generated/schema.graphqls`,
    printSchema(schema)
);