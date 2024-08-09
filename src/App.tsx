//import { useEffect, useState } from "react";
//import type { Schema } from "../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
import {
  TextField,
  TextAreaField,
  RadioGroupField,
  Radio,
  Card, 
  Text, 
  //Flex, 
  //Image, 
  //Badge, 
  //StepperField, 
  //Button 
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ThemeProvider,
  Theme,  
} from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

//const client = generateClient<Schema>();

const theme: Theme = {
  name: 'table-theme',
  tokens: {
    components: {
      table: {
        row: {
          hover: {
            backgroundColor: { value: '{colors.blue.20}' },
          },

          striped: {
            backgroundColor: { value: '{colors.blue.10}' },
          },
        },

        header: {
          color: { value: '{colors.blue.80}' },
          fontSize: { value: '{fontSizes.xl}' },
        },

        data: {
          fontWeight: { value: '{fontWeights.semibold}' },
        },
      },
    },
  },
};

function App() {
  /*
  //const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  //useEffect(() => {
  //  client.models.Todo.observeQuery().subscribe({
  //    next: (data) => setTodos([...data.items]),
  //  });
  //}, []);

  //function createTodo() {
  //  client.models.Todo.create({ content: window.prompt("Todo content"), isDone: true });
  //}
  */

  return (
    <main>

      <Card
        variation="elevated"
        width="60em"
        marginTop="0.3em"
        marginBottom="0.3em"
      >
        <TextField
          placeholder=""
          label="Requestor Name:"
          errorMessage="There is an error"
          marginTop="0.5em"
          marginBottom="0.5em"
        />
        <TextField
          placeholder=""
          label="Requestor Email:"
          errorMessage="There is an error"
          marginTop="0.5em"
          marginBottom="0.5em"
        />
        <RadioGroupField
          legend="Severity: "
          name="Severity"
          defaultValue="Normal"
          direction="row"
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          <Radio value="Normal">Normal</Radio>
          <Radio value="High">High</Radio>
        </RadioGroupField>
        <TextAreaField
          label="Please describe the issue:"
          name="notes_request"
          placeholder=""
          rows={4}
          marginTop="0.5em"
          marginBottom="0.5em"
        />
        <Text
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          Requested: 2024-08-09 12:30PM PDT
        </Text>
        <RadioGroupField
          legend="Status: "
          name="Status"
          defaultValue="Submitted"
          direction="row"
          marginTop="0.5em"
          marginBottom="0.5em"
          isDisabled
        >
          <Radio value="Submitted">Submitted</Radio>
          <Radio value="InProgress">In Progress</Radio>
          <Radio value="Completed">Completed</Radio>
        </RadioGroupField>
        <TextAreaField
          label="Resolution:"
          name="notes_resolution"
          placeholder=""
          rows={4}
          marginTop="0.5em"
          marginBottom="0.5em"
        />
        <Text
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          Resolved: 2024-08-09 03:30PM PDT
        </Text>
      </Card>

      <ThemeProvider theme={theme} colorMode="light">
        <Table highlightOnHover variation="striped">
          <TableHead>
            <TableRow>
              <TableCell as="th">Citrus</TableCell>
              <TableCell as="th">Stone Fruit</TableCell>
              <TableCell as="th">Berry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Orange</TableCell>
              <TableCell>Nectarine</TableCell>
              <TableCell>Raspberry</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grapefruit</TableCell>
              <TableCell>Apricot</TableCell>
              <TableCell>Blueberry</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lime</TableCell>
              <TableCell>Peach</TableCell>
              <TableCell>Strawberry</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ThemeProvider>
    </main>
  );
}

export default App;

/*

        <Flex alignItems="flex-start">
          <Image src="/amplify-placeholder.svg"
            alt="Amplify" width="8rem" />
          <Flex direction="column" gap="xs">
            <Flex>
              <Badge variation="success">New</Badge>
            </Flex>
            <Text fontSize="large" fontWeight="semibold">
              Product title
            </Text>
            <Text color="font.tertiary">
              Product description
            </Text>
            <Text
              fontSize="large"
              color="secondary">
              $199.99
            </Text>
            <Flex>
              <StepperField
                label="Quantity"
                min={0}
                max={10}
                step={1}
                defaultValue={1}
                labelHidden
              />
              <Button variation="primary">Add to cart</Button>
            </Flex>
          </Flex>
        </Flex>

      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>

*/