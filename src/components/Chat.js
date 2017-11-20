import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

export class ChatMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }
  async componentDidMount() {
    const { data: { data: messages } } = await this.props.getMessages();
    this.setState({
      messages
    });
  }
  render() {
    return (
      <ul>
        {this.state.messages.map(msg => (
          <li key={msg.id}>
            {msg.attributes.message} {msg.attributes.created_at}
          </li>
        ))}
      </ul>
    );
  }
}

export const ChatSubmit = props => (
  <button type="submit" {...props}>
    Submit
  </button>
);

export const ChatInput = ({ message, updateMessage, ...props }) => (
  <input
    {...props}
    name="message"
    type="text"
    value={message}
    onChange={e => updateMessage(e.target.value)}
  />
);

export class ChatForm extends React.Component {
  constructor() {
    super();
    this.state = {
      message: ""
    };
  }
  submitHandler = async e => {
    e.preventDefault();
    const message = this.state.message;
    this.setState({
      message: ""
    });
    await this.props.sendMessage(message);
  };
  updateMessage = message => {
    this.setState({
      message
    });
  };
  render() {
    const children = React.Children.map(this.props.children, child => {
      switch (child.type) {
        case ChatInput:
          return React.cloneElement(child, {
            message: this.state.message,
            updateMessage: this.updateMessage
          });
        default:
          return child;
      }
    });
    return <form onSubmit={this.submitHandler}>{children}</form>;
  }
}

export class ChatProvider extends React.Component {
  sendMessage = async message => {
    await axios.post(`${API_ENDPOINT}/messages`, {
      data: {
        data: {
          type: "messages",
          attributes: {
            message
          }
        }
      }
    });
    await this.getMessages();
  };
  getMessages = async () => axios.get(`${API_ENDPOINT}/messages`);
  render() {
    const children = React.Children.map(this.props.children, child => {
      if (child) {
        switch (child.type) {
          case ChatMessages:
            return React.cloneElement(child, {
              getMessages: this.getMessages
            });
          case ChatForm:
            return React.cloneElement(child, {
              sendMessage: this.sendMessage
            });
          default:
            return child;
        }
      } else {
        return null;
      }
    });
    return <div>{children}</div>;
  }
}
