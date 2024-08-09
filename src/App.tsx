import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Card, Flex, Image, Badge, Text, StepperField, Button } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: true });
  }

  return (
    <main>
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

      <Card variation="elevated">
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
      </Card>
    </main>
  );
}

export default App;
