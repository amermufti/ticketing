import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
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
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ThemeProvider,
  Theme,  
} from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

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
  const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [severity, setSeverity] = useState('');
  const [reasonForHigh, setReasonForHigh] = useState('');
  const [notesRequest, setNotesRequest] = useState('');
  //const [timeRquested, setTimeRquested] = useState('');
  const [status, setStatus] = useState('');
  const [notesResolution, setNotesResolution] = useState('');
  //const [timeResolved, setTimeResolved] = useState('');

  useEffect(() => {
    client.models.Ticket.observeQuery().subscribe({
      next: (data) => setTickets([...data.items]),
    });
  }, []);

  function createTicket() {
    client.models.Ticket.create(
      { requester_name: requesterName,
        requester_email: requesterEmail,
        severity: severity,
        reason_for_high: reasonForHigh,
        notes_request: notesRequest,
        time_requested: '',
        status: status,
        notes_resolution: notesResolution,
        time_resolved: ''
        });
  }

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
          name="requester_name"
          errorMessage="There is an error"
          marginTop="0.5em"
          marginBottom="0.5em"
          onBlur={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setRequesterName(e.target.value);
          }}
        />
        <TextField
          placeholder=""
          label="Requestor Email:"
          name="requester_email"
          errorMessage="There is an error"
          marginTop="0.5em"
          marginBottom="0.5em"
          onBlur={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setRequesterEmail(e.target.value);
          }}
        />
        <RadioGroupField
          legend="Severity: "
          name="severity"
          defaultValue="Normal"
          direction="row"
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          <Radio value="Normal">Normal</Radio>
          <Radio value="High">High</Radio>
        </RadioGroupField>
        <TextField
          placeholder=""
          label="Reason for High:"
          name="reason_for_high"
          errorMessage="There is an error"
          marginTop="0.5em"
          marginBottom="0.5em"
          isDisabled
          onBlur={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setReasonForHigh(e.target.value);
          }}
        />
        <TextAreaField
          label="Please describe the issue:"
          name="notes_request"
          placeholder=""
          rows={4}
          marginTop="0.5em"
          marginBottom="0.5em"
          onBlur={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setNotesRequest(e.target.value);
          }}
        />
        <Button 
          variation="primary"
          onClick={createTicket}
        >
          Submit Request
        </Button>
        <Text
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          Requested: 2024-08-09 12:30PM PDT
        </Text>
        <RadioGroupField
          legend="Status: "
          name="status"
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
          onBlur={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setNotesResolution(e.target.value);
          }}
        />
        <Text
          marginTop="0.5em"
          marginBottom="0.5em"
        >
          Resolved: 2024-08-09 03:30PM PDT
        </Text>
      </Card>
      <Card
        variation="elevated"
        width="80em"
        marginTop="0.3em"
        marginBottom="0.3em"
      >
      <ThemeProvider theme={theme} colorMode="light">
        <Table highlightOnHover variation="striped">
          <TableHead>
            <TableRow>
              <TableCell as="th">Requestor</TableCell>
              <TableCell as="th">Email</TableCell>
              <TableCell as="th">Severity</TableCell>
              <TableCell as="th">Reason</TableCell>
              <TableCell as="th">Issue</TableCell>
              <TableCell as="th">Started</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Resolution</TableCell>
              <TableCell as="th">Resolved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.requester_name}</TableCell>
                <TableCell>{ticket.requester_email}</TableCell>
                <TableCell>{ticket.severity}</TableCell>
                <TableCell>{ticket.reason_for_high}</TableCell>
                <TableCell>{ticket.notes_request}</TableCell>
                <TableCell>{ticket.time_requested}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.notes_resolution}</TableCell>
                <TableCell>{ticket.time_resolved}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ThemeProvider>
      </Card>
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