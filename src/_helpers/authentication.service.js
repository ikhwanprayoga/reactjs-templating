import { BehaviorSubject } from 'rxjs'
import Axios from 'axios'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')))

export const authenticationService = {
    login, 
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
}

login = (username, password) => {

    const baseUrl = 'http://localhost:8080'

    const formLogin = {
        username: username,
        password: password
    }

    Axios.post(baseUrl+'/api/login', formLogin).then((result) => {
        console.log(result)
    }).then(user => {
        localStorage,setItem('currentUser', JSON.stringify(user))
        currentUserSubject.next(user)

        return user
    })
    .catch((err) => {
        console.log('err', err)
    });
}

logout = () => {
    //remove user from local storage to logout user
    localStorage.removeItem('currentUser')
    currentUserSubject.next(null)
}