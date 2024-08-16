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
          fontSize: { value: '{fontSizes.large}' },
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
  const [severity, setSeverity] = useState('Normal');
  const [reasonForHigh, setReasonForHigh] = useState('');
  const [notesRequest, setNotesRequest] = useState('');
  //const [timeRquested, setTimeRquested] = useState('');
  const [status, setStatus] = useState('');
  const [notesResolution, setNotesResolution] = useState('');
  //const [timeResolved, setTimeResolved] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submittedActive, setSubmittedActive] = useState(false);
  const [drilledDown, setDrilledDown] = useState(false);

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
    setSubmittedActive(true);
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
  function updateTicket() {
    setStatus('Completed');
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
              isDisabled={severity === 'Normal' ? true : false}
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
              Submitted: 2024-08-09 12:30PM PDT
            </Text>
            {submittedActive ? (
              <Message role="alert" heading="Info" colorTheme="info">
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
            {!drilledDown ? (
              <ThemeProvider theme={theme} colorMode="light">
                <Table highlightOnHover variation="striped">
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Requestor</TableCell>
                      <TableCell as="th">Email</TableCell>
                      <TableCell as="th">Severity</TableCell>
                      <TableCell as="th">Reason</TableCell>
                      <TableCell as="th">Issue</TableCell>
                      <TableCell as="th">Sumitted</TableCell>
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
                            setDrilledDown(true);
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
            ) : null}
            {drilledDown ? (
              <Card
                variation="elevated"
                width="100%"
                marginTop="0.3em"
                marginBottom="0.3em"
              >
                <RadioGroupField
                  legend="Status: "
                  name="status"
                  defaultValue="Submitted"
                  direction="row"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled={status === '' ? true : false}
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
                <Text
                  marginTop="0.5em"
                  marginBottom="0.5em"
                >
                  Resolved: 2024-08-09 03:30PM PDT
                </Text>
              </Card>
            ) : null}
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
