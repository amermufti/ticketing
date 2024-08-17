import { useEffect, useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  TextField,
  TextAreaField,
  RadioGroupField,
  Radio,
  Card,
  Grid,
  Message,
  Image,
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
import logo from './assets/WLFLogo1.png';

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
          fontSize: { value: '{fontSizes.medium}' },
        },

        data: {
          fontWeight: { value: '{fontWeights.normal}' },
        },
      },
    },
  },
};


function App() {
  const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [severity, setSeverity] = useState('Normal');
  const [reasonForHigh, setReasonForHigh] = useState('');
  const [notesRequest, setNotesRequest] = useState('');
  const [timeRequested, setTimeRequested] = useState('');
  const [status, setStatus] = useState('');
  const [notesResolution, setNotesResolution] = useState('');
  //const [timeResolved, setTimeResolved] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submittedActive, setSubmittedActive] = useState(false);

  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get('pick');
    if (foo != null && foo === 'admin') {
      setIsAdmin(true);
    }
    client.models.Ticket.observeQuery().subscribe({
      next: (data) => setTickets([...data.items]),
    });
  }, []);

  function createTicket() {
    setStatus('Submitted');
    let timeReq = new Date().toLocaleString('en-US', { timeZone: 'America/Denver' });
    setTimeRequested(timeReq);
    setSubmittedActive(true);
    client.models.Ticket.create(
      {
        requester_name: requesterName,
        requester_email: requesterEmail,
        severity: severity,
        reason_for_high: reasonForHigh,
        notes_request: notesRequest,
        time_requested: timeReq,
        status: status,
        notes_resolution: notesResolution,
        time_resolved: ''
      });
  }
  function updateTicket() {
    setStatus('Completed');
    const dialog = document.querySelector("dialog");
    if (dialog != null) {
      dialog.close();
    }
    let timeRes = new Date().toLocaleString('en-US', { timeZone: 'America/Denver' });
    client.models.Ticket.create(
      {
        requester_name: requesterName,
        requester_email: requesterEmail,
        severity: severity,
        reason_for_high: reasonForHigh,
        notes_request: notesRequest,
        time_requested: timeRequested,
        status: status,
        notes_resolution: notesResolution,
        time_resolved: timeRes
      });
  }

  
//example data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const columns = useMemo<MRT_ColumnDef<Person>[]>(
  () => [
    {
      accessorKey: 'name.firstName', //access nested data with dot notation
      header: 'First Name',
      size: 150,
    },
    {
      accessorKey: 'name.lastName',
      header: 'Last Name',
      size: 150,
    },
    {
      accessorKey: 'address', //normal accessorKey
      header: 'Address',
      size: 200,
    },
    {
      accessorKey: 'city',
      header: 'City',
      size: 150,
    },
    {
      accessorKey: 'state',
      header: 'State',
      size: 150,
    },
  ],
  [],
);

  const table = useMaterialReactTable({
    columns, 
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableFacetedValues: true,
    enableGlobalFilter: false,
  });
  
  return (
    <main>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="1fr 1fr 1fr"
        templateRows="1fr 3fr 1fr"
      >
        <Card
          columnStart="2"
          columnEnd="-1"
        >
          <Image
            alt="Wagstaff Law Firm logo"
            src={logo}
            objectFit="initial"
            objectPosition="50% 50%"
            backgroundColor="initial"
            height="5em"
            opacity="100%"
          />
        </Card>
        <Card
          columnStart="1"
          columnEnd="2"
        >
        </Card>
        {isAdmin === false ?
          <Card
            variation="elevated"
            width="50em"
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
              isDisabled={status === 'Submitted' ? true : false}
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
              isDisabled={status === 'Submitted' ? true : false}
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
              isDisabled={status === 'Submitted' ? true : false}
              onChange={(e) => setSeverity(e.target.value)}
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
              isDisabled={severity === 'Normal' ? true : status === 'Submitted' ? true : false}
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
              isDisabled={status === 'Submitted' ? true : false}
              onBlur={e => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                setNotesRequest(e.target.value);
              }}
            />
            <TextField
              placeholder=""
              label="Submitted:"
              name="time_requested"
              defaultValue={timeRequested}
              errorMessage="There is an error"
              marginTop="0.5em"
              marginBottom="0.5em"
              isDisabled
            />
            <Button
              variation="primary"
              isDisabled={status === 'Submitted' ? true : false}
              onClick={createTicket}
            >
              Submit Request
            </Button>
            {submittedActive ? (
              <Message role="alert" heading="Attention" colorTheme="info">
                Request Submitted
              </Message>
            ) : null}
          </Card>
          :
          <Card
            variation="elevated"
            width="100%"
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
                    <TableCell as="th">Submitted</TableCell>
                    <TableCell as="th">Status</TableCell>
                    <TableCell as="th">Notes</TableCell>
                    <TableCell as="th">Resolved</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      onClick={e => {
                        const dialog = document.querySelector("dialog");
                        if (dialog != null) {
                          console.log('AAA:', e.target);
                          //console.log('THIS:', this);
                          //setRequesterName(ticket.requester_name);
                          dialog.showModal();
                        }
                        console.log('it produced this event:', e)
                      }
                      }
                    >
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
            <dialog>
              <Card
                variation="elevated"
                width="50em"
                marginTop="0.3em"
                marginBottom="0.3em"
              >
                <TextField
                  placeholder=""
                  label="Requestor Name:"
                  name="requester_name"
                  defaultValue={requesterName}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextField
                  placeholder=""
                  label="Requestor Email:"
                  name="requester_email"
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <RadioGroupField
                  legend="Severity: "
                  name="severity"
                  defaultValue="Normal"
                  direction="row"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
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
                />
                <TextAreaField
                  label="Description of the issue:"
                  name="notes_request"
                  placeholder=""
                  rows={4}
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextField
                  placeholder=""
                  label="Submitted:"
                  name="time_requested"
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <RadioGroupField
                  legend="Status: "
                  name="status"
                  defaultValue="Submitted"
                  direction="row"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <Radio value="Submitted">Submitted</Radio>
                  <Radio value="InProgress">In Progress</Radio>
                  <Radio value="Completed">Completed</Radio>
                </RadioGroupField>
                <TextAreaField
                  label="Notes:"
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
                <Button
                  variation="primary"
                  onClick={updateTicket}
                >
                  Submit Resolution
                </Button>
                <Button
                  onClick={e => {
                    const dialog = document.querySelector("dialog");
                    if (dialog != null) {
                      dialog.close();
                    }
                    console.log('it produced this event:', e)
                  }
                  }
                >
                  Cancel
                </Button>
              </Card>
            </dialog>
            <MaterialReactTable
              table={table}
            />
          </Card>
        }
        <Card
          columnStart="2"
          columnEnd="-1"
        >
        </Card>
      </Grid>
    </main>
  );
}

export default App;
