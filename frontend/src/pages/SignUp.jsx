import React, { useState } from 'react';
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from "react-redux";
import authActions from '../state/actions/authActions'
import { setAuthErrors } from '../state/reducers/actions';
import { Link } from 'react-router-dom';

const SignUpPage = (state) => {
    const [{ email, password, confirmPassword }, setEmailPassword] = useState({ email: '', password: '', confirmPassword: '' })
    const dispatch = useDispatch();
    const { errors, messages } = useSelector(state => state.auth)
    const { signUp } = bindActionCreators(authActions, dispatch)

    const passwordsMatch = password === confirmPassword;

    const onChangeForm = (event) => {
        const { value, name } = event.target;
        setEmailPassword({ email, password, confirmPassword, [name]: value })
    }

    const onSignUpButtonPress = () => {
        if (!passwordsMatch) {
            return;
        }

        dispatch({
            type: setAuthErrors,
            payload: []
        })
        signUp(email, password, () => {
            setEmailPassword({ email: '', password: '', confirmPassword: '' })
        });
    }

    return (
        <div>
            {errors.map(e => <p>{e}</p>)}
            {messages.map(e => <p>{e}</p>)}
            {!passwordsMatch && <p>Passwords don't match</p>}
            <h1>Sign Up</h1>
            <p>Email</p>
            <input type="email" value={email} onChange={onChangeForm} name="email"></input>
            <p>Password</p>
            <input type="password" value={password} onChange={onChangeForm} name="password"></input>
            <p>Confirm Password</p>
            <input type="password" value={confirmPassword} onChange={onChangeForm} name="confirmPassword"></input>
            <br />
            {
                passwordsMatch &&
                <button onClick={onSignUpButtonPress}>sign up</button>
            }
            <br />
            <Link to="/signin">already have an account?</Link>
        </div>
    );
}

export default SignUpPage;