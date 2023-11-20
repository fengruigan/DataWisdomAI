import React, {useState} from "react";
import NavBar from "./components/NavBar";
import Message from "./components/Message";
import "./App.css";
import { Container, InputGroup, Form, Button, Spinner } from "react-bootstrap";

function App() {

  const [messages, setMessages] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  const query = async() => {
    setLoading(true)
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({prompt: promptText})
    })
    if (!res.ok) {
      setError(`Encountered error when querying for result ${res.status}`);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLoading(false);
    setMessages(prev => [...prev, {type: "response", body: data}]);
  }

  return (
    <>
      <NavBar />
      <Container className="mt-5 mb-5">
        <div id="chatbox">
          {messages.length != 0 && messages.map((message, idx) => <Message content={message} key={idx}/>
          )}
          {loading && <div id="loader"><Spinner animation="border"/></div>}
          {/* TODO (out of time): add error element to notify user here */}
        </div>
        <InputGroup className="mt-1">
          <InputGroup.Text>@</InputGroup.Text>
          <Form.Control
          placeholder="Type your prompt here..."
          aria-label="Prompt Input"
          aria-describedby="Prompt Input"
          value={promptText}
          onChange={(e) => {
            setPromptText(e.target.value)
          }}
        />
        <Button className="primary" disabled={loading} onClick={() => {
          setMessages(prev => [...prev, {type: "prompt", body: promptText}])
          setPromptText("")
          query()
        }}>Submit</Button>
        </InputGroup>
      </Container>
    </>
  );
}

export default App;
