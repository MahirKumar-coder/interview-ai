import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    try {
        const context = useContext(AuthContext)
        const { user, setUser, loading, setLoading } = context


        const handleLogin = async ({ email, password }) => {
            setLoading(true)
            try {
                const data = await login({ email, password })
                setUser(data.user)
            } catch (error) {
                console.log(error);

            }
            finally {
                setLoading(false)

            }
        }

        const handleRegister = async ({ username, email, password }) => {
            setLoading(true)
            try {
                const data = await register({ username, email, password })
                setUser(data.register)
            } catch (error) {
                console.log(error);

            }
            finally {

                setLoading(false)
            }
        }

        const handleLogout = async () => {
            setLoading(true)
            try {
                const data = logout()
                setUser(null)
            } catch (error) {
                console.log(error);

            }
            finally {
                setLoading(false)

            }
        }

        useEffect(() => {
            const getAndSetUser = async () => {
                try {
                    const data = await getMe()
                    setUser(data.user)
                } catch (error) {

                } finally {

                    setLoading(false)
                }

            }

            getAndSetUser()

        }, [])

        return { user, loading, handleLogin, handleRegister, handleLogout }
    } catch (error) {
        console.log(error);

    }
}

// 2:42:22