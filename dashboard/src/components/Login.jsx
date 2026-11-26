import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(
                email,
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            onLogin(data.user);

        } catch (error) {
            setError(
                error.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                {/* Left branding section */}

                <div className="login-branding">

                    <div className="brand-content">

                        <h1>
                            Sensor Monitor
                        </h1>

                        <p>
                            Live Sensor Monitoring Dashboard
                        </p>

                    </div>

                </div>


                {/* Right login section */}

                <div className="login-form-section">

                    <div className="login-form-container">

                        <h2>
                            Welcome back
                        </h2>

                        <p className="login-subtitle">
                            Login to monitor your sensors
                        </p>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    required
                                />

                            </div>


                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </button>

                        </form>


                        <div className="register-switch">

                            <span>
                                New user?
                            </span>

                            <button
                                type="button"
                                onClick={onRegister}
                                className="text-button"
                            >
                                Register
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;