import './demo.css';
import React from 'react';
import { render } from 'react-dom';
import { withFormik } from 'formik';
import Yup from 'yup';

// Helper
import {
  MoreResources,
  DisplayFormikState,
} from './FormikExample';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  }),
  mapPropsToValues: props => ({ email: props.user.email }),
  mapValuesToPayload: x => x,
  handleSubmit: (payload, bag) => {
    bag.props.anotherMethod();
    setTimeout(function() {
      alert(JSON.stringify(payload, null, 2));
      bag.setSubmitting(false);
      bag.props.updateUser(payload);
      bag.props.anotherMethod();
    }, 1000);
  },
  displayName: 'MyForm',
});

class MyForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.email !== this.props.user.email) {
      this.props.resetForm(nextProps);
    }
  }

  render() {
    // notice how touched will reset when the user changes
    console.log(this.props.touched);
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={this.props.values.email}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
        />

        <button
          type="button"
          className="outline"
          onClick={this.props.handleReset}
          disabled={
            !this.props.dirty || this.props.isSubmitting
          }
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={this.props.isSubmitting}
        >
          Submit
        </button>
        <DisplayFormikState {...this.props} />
      </form>
    );
  }
}

const MyEnhancedForm = formikEnhancer(MyForm);

class App extends React.Component {
  state = {
    user: {
      email: 'jared@example.com',
    },
  };

  updateUser = user => {
    this.setState({ user });
  };
  anotherMethod = () => {
    this.setState({loading: !this.state.loading})
  }
  render() {
    return (
      <div className="app">
        <h1>
          <a
            href="https://github.com/jaredpalmer/formik"
            target="_blank"
            rel="noopener"
          >
            Formik
          </a>{' '}
          Component Lifecycle Example
        </h1>
        {this.state.loading ? <span>loading</span> :
        <MyEnhancedForm
          user={this.state.user}
          updateUser={this.updateUser}
          anotherMethod={this.anotherMethod}
        />}
        <h3 style={{ fontWeight: 'bold', marginBottom: 0 }}>
          Click the button below to pass different props to
          the form
        </h3>
        <button
          style={{ width: '100%', maxWidth: '250px' }}
          onClick={() =>
            this.setState({
              user: { email: 'hello@reason.nyc' },
            })}
        >
          Change Props and Reset
        </button>

        <MoreResources />
      </div>
    );
  }
}
render(<App />, document.getElementById('root'));
