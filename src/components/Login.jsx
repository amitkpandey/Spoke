import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router";

import { StyleSheet, css } from "aphrodite";
import theme from "../styles/theme";

import UserEdit from "../containers/UserEdit";

const styles = StyleSheet.create({
  fieldContainer: {
    background: theme.colors.white,
    padding: "15px",
    width: "256px"
  },
  loginPage: {
    display: "flex",
    "justify-content": "center",
    "align-items": "flex-start",
    height: "100vh",
    "padding-top": "10vh",
    background: theme.colors.veryLightGray
  },
  button: {
    border: "none",
    background: theme.colors.lightGray,
    color: theme.colors.EWnavy,
    padding: "16px 16px",
    "font-size": "14px",
    "text-transform": "uppercase",
    cursor: "pointer",
    width: "50%",
    transition: "all 0.3s",
    ":disabled": {
      background: theme.colors.white,
      cursor: "default",
      color: theme.colors.EWnavy
    }
  },
  header: {
    ...theme.text.header,
    color: theme.colors.EWnavy,
    "text-align": "center",
    "margin-bottom": 0
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "login"
    };

    this.displaySignUp = !window.SUPPRESS_SELF_INVITE;
    this.isLocalLogin = window.PASSPORT_STRATEGY === "local";
  }

  componentDidMount = () => {
    const {
      location: {
        query: { nextUrl }
      }
    } = this.props;

    if (!this.isLocalLogin) {
      window.AuthService.login(nextUrl);
      return;
    }
    if (nextUrl && nextUrl.includes("reset")) {
      this.setState({ active: "reset" });
    }
  };

  handleClick = e => {
    this.setState({ active: e.target.name });
  };

  naiveVerifyInviteValid = nextUrl =>
    /\/\w{8}-(\w{4}\-){3}\w{12}(\/|$)/.test(nextUrl);

  render() {
    if (!this.isLocalLogin) {
      // Login provider will handle redirecting
      return null;
    }

    const {
      location: {
        query: { nextUrl }
      },
      router
    } = this.props;

    const saveLabels = {
      login: "Log In",
      signup: "Sign Up",
      reset: "Save New Password"
    };

    return (
      <div className={css(styles.loginPage)}>
        {/* Show UserEdit component configured for login / signup */}
        <div>
          {/* Only display sign up option if there is a nextUrl */}
          {this.displaySignUp && (
            <section>
              <button
                className={css(styles.button)}
                type="button"
                name="login"
                onClick={this.handleClick}
                disabled={this.state.active === "login"}
              >
                Log In
              </button>
              <button
                className={css(styles.button)}
                type="button"
                name="signup"
                onClick={this.handleClick}
                disabled={this.state.active === "signup"}
              >
                Sign Up
              </button>
            </section>
          )}
          <div className={css(styles.fieldContainer)}>
            <h2 className={css(styles.header)}>Welcome to Spoke</h2>
            <UserEdit
              includeEmail
              authType={this.state.active}
              saveLabel={saveLabels[this.state.active]}
              router={router}
              nextUrl={nextUrl}
              style={css(styles.authFields)}
            />
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object
};

export default withRouter(Login);
