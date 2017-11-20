import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

class Messages extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }
  async componentDidMount() {
    const { data: { data: messages } } = await axios.get(
      `${API_ENDPOINT}/messages`
    );

    this.setState({
      messages
    });
  }
  render() {
    return (
      <pre>
        <code>{JSON.stringify(this.state.messages, null, 2)}</code>
      </pre>
    );
  }
}

export default Messages;
