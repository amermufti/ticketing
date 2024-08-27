import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from './schema.sql';

// Add a global authorization rule
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())

  .addToSchema({
    create: a.mutation()
      .arguments({
        id: a.integer().required(),
        requester_name: a.string().required(),
        requester_email: a.string().required(),
        severity: a.string().required(),
        reason_for_high: a.string(),
        notes_request: a.string().required(),
        time_requested: a.string().required(),
        status: a.string(),
        notes_resolution: a.string(),
        time_resolved: a.string()
      })
      .returns(a.json().array())
      .authorization(allow => allow.authenticated())

      .handler(a.handler.sqlReference('./createNewTicket.sql'))
  })

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
/*
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});
*/
const schema = a.schema({
  Ticket: a
    .model({
      requester_name: a.string(),
      requester_email: a.string(),
      severity: a.string(),
      reason_for_high: a.string(),
      notes_request: a.string(),
      time_requested: a.string(),
      status: a.string(),
      notes_resolution: a.string(),
      time_resolved: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

const combinedSchema = a.combine([schema, sqlSchema]);

export type Schema = ClientSchema<typeof combinedSchema>;

export const data = defineData({
  schema: combinedSchema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
