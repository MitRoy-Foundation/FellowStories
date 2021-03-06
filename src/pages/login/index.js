import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Layout from "@theme/Layout";
import Navbar from '../../theme/Navbar';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from "./login.module.scss";
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios';

import AppContext from '../../components/AppContext';

function Login() {
  const { userdata, setUserdata } = useContext(AppContext);
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setLoading(true);
    // Handle API call
    axios
      .post(`${process.env.API_ENDPOINT}/auth/local`, {
        identifier: email,
        password: password,
      })
      .then(response => {
        // Handle success.
        setLoading(false);
        console.log('Logged in!');
        console.log('User Data', response.data);
        const userType = response.data.user.role.name.toLowerCase();
        const newUserDataState = {
          loggedIn: true,
          userType: userType,
          jwt: response.data.jwt,
          user: response.data.user,
        }
        setUserdata(newUserDataState);
        localStorage.setItem('USER_DATA', JSON.stringify(newUserDataState));
        if(userType === 'fellow') {
          history.push("/dashboard");
        } else if(userType === 'admin') {
          history.push("/admin-dashboard");
        }
        setError('');
      })
      .catch(error => {
        // Handle error
        setLoading(false);
        console.log('An error occurred:', error.response);
        setError(error.response?.data?.message[0]?.messages[0]?.message);
      });
  };
  return (
    <Layout
      title="Login">
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className={styles.title}>Login</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="fs-alert-error" style={{ minWidth: "350px", marginBottom: "20px", display: error ? "flex" : "none"}}>
          {error}
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <div className="fs-input-group">
              <label className="fs-label">
                <strong>Email / Username</strong>
              </label>
              <input
                className="fs-input"
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ minWidth: "350px" }}
              />
            </div>
            <div className="fs-input-group">
              <label className="fs-label">
                <strong>Password</strong>
              </label>
              <input
                className="fs-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ minWidth: "350px" }}
              />
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="fs-button fs-button-primary"
            style={{ minWidth: "350px", marginTop: "10px", marginBottom: "25px" }}
          >
            {loading ?
              <PulseLoader color={'white'} size={10} />
              :
              'Login'
            }
          </button>
          <Link
            className={clsx(
              'fs-button fs-button-primary-light'
            )}
            to={useBaseUrl('register/')}
            style={{ minWidth: "350px", marginBottom: "60px", display: "flex"}}>
            New Fellow? Register.
          </Link>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
