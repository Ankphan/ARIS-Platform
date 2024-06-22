// components/auth/auth-form.js
'use client';

import { useState, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import classes from '../../styles/auth-form.module.css';

async function createUser(email, password) {
    try {
        const res = await fetch('/api/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('received response from api route:', res);
    } catch (error) {
        console.log(error);
    }
}

function AuthForm() {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const { data: session } = useSession();
    const [error, setError] = useState(null);

    const handleSignIn = async (email, password) => {
        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        if (result.error) {
            setError(result.error);
            alert("Wrong password. Please try again.");
        }

        return result;
    };

    function switchAuthModeHandler() {
        setIsLogin(!isLogin);
    }

    async function submitHandler(event) {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        if (isLogin) {
            const result = await handleSignIn(enteredEmail, enteredPassword);
            console.log(result);
            if (!result.error) {
                router.push('/home');
            }
        } else {
            try {
                await createUser(enteredEmail, enteredPassword);
                router.push('/home');
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" required ref={emailInputRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Your Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div className={classes.actions}>
                    <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    <button
                        type="button"
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={() => signIn('google')}>Sign in with Google</button>
        </section>
    );
}

export default AuthForm;
