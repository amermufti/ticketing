import { useEffect, useState } from "react";
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
  SwitchField, 
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
          fontSize: { value: '{fontSizes.medium}' },
        },
      },
    },
  },
};


function App() {
  const [ticketId, setTicketId] = useState(0);
  const [tickets, setTickets] = useState<Array<Schema["ticketing"]["type"]>>([]);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [severity, setSeverity] = useState('Normal');
  const [reasonForHigh, setReasonForHigh] = useState('');
  const [notesRequest, setNotesRequest] = useState('');
  const [timeRequested, setTimeRequested] = useState('');
  const [status, setStatus] = useState('');
  const [notesResolution, setNotesResolution] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submittedActive, setSubmittedActive] = useState(false);
  const [pickedRow, setPickedRow] = useState(-1);
  const [includeCompleted, setIncludeCompleted] = useState(false);

  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get('pick');
    if (foo != null && foo === 'admin') {
      setIsAdmin(true);
    }
    client.models.ticketing.observeQuery().subscribe({
      next: (data) => setTickets([...data.items]),
    });
  }, []);

  function createTicket() {
    setStatus('Submitted');
    let timeReq = new Date().toISOString().replace("T"," ").substring(0, 19);
    setTimeRequested(timeReq);
    setSubmittedActive(true);
    client.models.ticketing.create(
      {
        id: 100, // requesterName+' '+timeReq,
        requester_name: requesterName,
        requester_email: requesterEmail,
        severity: severity,
        reason_for_high: reasonForHigh,
        notes_request: notesRequest,
        time_requested: timeReq,
        status: 'Submitted',
        notes_resolution: notesResolution,
        time_resolved: timeReq
    });
  }
  function updateTicket() {
    setStatus('Completed');
    const dialog = document.querySelector("dialog");
    if (dialog != null) {
      dialog.close();
    }
    let timeRes = new Date().toISOString().replace("T"," ").substring(0, 19)
    client.models.ticketing.update(
      {
        id: ticketId,
        status: status,
        notes_resolution: notesResolution,
        time_resolved: timeRes
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
            height="4em"
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
            <SwitchField
              isDisabled={false}
              label="Include Completed Tickets"
              labelPosition="start"
              onChange={(e) => {
                setIncludeCompleted(e.target.checked);
              }}
            />
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
                    <TableCell as="th">Status Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets
                    .filter(
                      ticket => includeCompleted === true || ticket.status !== 'Completed'
                    )
                    .map((ticket, ticketIndex) => (
                      <TableRow
                        key={ticket.id}
                        onClick={e => {
                          const dialog = document.querySelector("dialog");
                          if (dialog != null) {
                            console.log('AAA:', ticketIndex);  //e.target);
                            setPickedRow(ticketIndex);
                            setTicketId(ticket.id);
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
                        <TableCell
                          style={{minWidth: '20em'}}
                        >{ticket.notes_request}</TableCell>
                        <TableCell>{ticket.time_requested}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell
                          style={{minWidth: '20em'}}
                        >{ticket.notes_resolution}</TableCell>
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
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].requester_name as string) : ''}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextField
                  placeholder=""
                  label="Requestor Email:"
                  name="requester_email"
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].requester_email as string) : ''}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <RadioGroupField
                  legend="Severity: "
                  name="severity"
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].severity as string) : ''}
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
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].reason_for_high as string) : ''}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextAreaField
                  label="Description of the issue:"
                  name="notes_request"
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].notes_request as string) : ''}
                  rows={6}
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextField
                  placeholder=""
                  label="Submitted:"
                  name="time_requested"
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].time_requested as string) : ''}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <TextField
                  placeholder=""
                  label="Ticket Id:"
                  name="id"
                  defaultValue={pickedRow > -1 ? (tickets[pickedRow].id as number) : ''}
                  errorMessage="There is an error"
                  marginTop="0.5em"
                  marginBottom="0.5em"
                  isDisabled
                />
                <RadioGroupField
                  legend="Status: "
                  name="status"
                  value={pickedRow > -1 ? (tickets[pickedRow].status as string) : ''}
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
                  value={pickedRow > -1 ? (tickets[pickedRow].notes_resolution as string) : ''}
                  placeholder=""
                  rows={6}
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
