const TOKEN_KEY = "jwt-token"
const REFRESH_KEY = "jwt-refresh-token"
const EXPIRES_KEY = "jwt-expires"

function setToken ({ refreshToken, idToken, expiresIn = 3600}) {
    const expiresDate = new Date().getTime() + expiresIn * 1000
    localStorage.setItem(TOKEN_KEY, idToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
    localStorage.setItem(EXPIRES_KEY, expiresDate)
}