import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'

import LoginForm from './LoginForm'

class Login extends Component {
  // This state is used to set the tabs to active.

  render() {
    const { redirect } = this
    const { userDetails } = this.props

    if (userDetails.id)
      return <Redirect to={`${userDetails.isAdmin ? '/admin' : '/student'}`} />

    return (
      <div>
        <CssBaseline />
        <AppBar position="fixed" style={styles.appbar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              CodeJar
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={styles.root}>
          <Paper style={styles.paper}>
            <div style={styles.form}>
              <LoginForm redirect={redirect} />
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  paper: {
    position: 'fixed',
    top: '15vh'
  },
  form: {
    margin: '1em 2em 2em 2em',
    width: '40vw'
  },
  appbar: {
    width: '100%'
  }
}

const mapStateToProps = ({ userDetails }) => ({ userDetails })

export default connect(mapStateToProps)(Login)
