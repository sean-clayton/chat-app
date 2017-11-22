import React from "react";
import g, { Li } from "glamorous";
import axios from "axios";
import format from "date-fns/fp/format";
import { API_ENDPOINT } from "./constants";

/*

  In a larger project I tend to like to break up my components into a folder
  structure that resembles atomic design [0]

  Components
    - Atoms
    - Molecules
    - Organisms
    - Templates/Layouts
    - Pages
  
  That kind of structure is overkill for a tiny little thing like this, so I'm
  just putting all of that stuff in here.



  [0]: http://bradfrost.com/blog/post/atomic-web-design/

*/

// Components just for styles

const Input = g.input(
  {
    flex: 1,
    padding: "0.75em 1.25em",
    borderRadius: "9999px",
    border: "2px solid #ddd",
    boxShadow: "0 0 0 transparent",
    transition: ".1s ease box-shadow",
    ":hover": {
      boxShadow: "0 .5em .5em rgba(0,0,0,.05)"
    },
    ":focus": {
      outline: "none",
      border: "2px solid #7cf",
      boxShadow: "0 .5em .5em rgba(0,0,0,.05)"
    }
  },
  ({ disabled }) => ({
    cursor: disabled ? "not-allowed" : "text"
  })
);

const Button = g.button(
  {
    padding: "0.75em 1.25em",
    border: "none",
    borderRadius: "9999px",
    color: "#fff"
  },
  ({ disabled }) => ({
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "#ddd" : "#0d6"
  })
);

const ChatFormWrapper = g.form({
  display: "flex",
  justifyContent: "space-between",
  padding: "1em",
  backgroundColor: "rgba(255,255,255,.5)",
  borderRadius: "0 0 .25em .25em",
  boxShadow: "inset 0 1px 0 rgba(0,0,0,.1)"
});

export const ChatList = g.ul({
  backgroundColor: "#fff",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  padding: "0 1em"
});

const ChatBubble = g.span({
  display: "inline-block",
  borderRadius: "0 1em 1em 1em",
  backgroundColor: "#07f",
  padding: "1em",
  color: "#fff",
  maxWidth: "50%",
  cursor: "default"
});

// Components ready for consumption

export const ChatMessage = ({ message: { attributes: { message, created_at } } }) => (
  <Li
    css={{
      padding: "1em 0"
    }}
  >
    <ChatBubble>{message}</ChatBubble>
    <br />
    <time style={{ color: "rgba(0,0,0,.5)", fontSize: ".7em", cursor: "default" }}>
      {format("MMM D, YYYY [at] h:mma")(new Date(Date.parse(created_at)))}
    </time>
  </Li>
);

export const ChatSubmit = props => (
  <Button type="submit" {...props}>
    Submit
  </Button>
);

export const ChatInput = ({ message, updateMessage, ...props }) => (
  <Input {...props} name="message" type="text" autoComplete="off" />
);

// Components that handle business logic

export class ChatMessages extends React.Component {
  state = {
    messages: []
  };

  async componentDidMount() {
    const { data: { data: messages } } = await this.props.getMessages();
    this.setState({
      messages
    });
  }
  render() {
    return this.props.render(this.state.messages);
  }
}

export class ChatForm extends React.Component {
  state = {
    sending: false
  };
  submitHandler = async e => {
    e.preventDefault();
    this.setState({
      sending: true
    });
    e.target.reset();
    await this.props.sendMessage(e.target.message.value);
    this.setState({
      sending: false
    });
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
            ...child.props,
            disabled: this.props.disabled
          });
        case ChatSubmit:
          return React.cloneElement(child, {
            ...child.props,
            disabled: this.props.disabled || this.state.sending
          });
        default:
          return child;
      }
    });
    return <ChatFormWrapper onSubmit={this.submitHandler}>{children}</ChatFormWrapper>;
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
    return children;
  }
}
