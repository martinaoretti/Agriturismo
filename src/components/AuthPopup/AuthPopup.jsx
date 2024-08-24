import React, { useState } from 'react'; 
import { auth } from '../NavBar/firebaseConfig'; 
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth'; // Importa le funzioni di autenticazione di Firebase
import './AuthPopup.css'; 

const AuthPopup = ({ onClose }) => {
    // Stato locale per email, password, messaggi di errore e modalità di registrazione/accesso
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Funzione per l'accesso tramite email e password
    const handleEmailSignIn = () => {
        signInWithEmailAndPassword(auth, email, password) // Esegue login con email e password
            .then((userCredential) => {
                const user = userCredential.user; // Ottiene l'utente loggato
                console.log('User signed in:', user);
                onClose(); // Chiude il popup dopo l'accesso
            })
            .catch((error) => {
                setError(error.message); // Mostra il messaggio di errore
                console.error('Error during sign-in:', error); 
            });
    };

    // Funzione per l'accesso tramite Google
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider(); // Crea un provider per Google
        signInWithPopup(auth, provider) // Esegue l'accesso tramite Google
            .then((result) => {
                console.log('User signed in with Google:', result.user); 
                onClose(); 
            })
            .catch((error) => {
                console.error('Error during sign-in with Google:', error); 
            });
    };

    // Funzione per la registrazione di un nuovo utente
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password) // Registra un nuovo utente
            .then((userCredential) => {
                const user = userCredential.user; // Ottiene l'utente registrato
                console.log('User signed up:', user);
                onClose(); 
            })
            .catch((error) => {
                setError(error.message); // Mostra il messaggio di errore
                console.error('Error during sign-up:', error); 
            });
    };

    return (
        <div className="auth-popup-overlay"> 
            <div className="auth-popup"> 
                <button className="close-btn" onClick={onClose}>✖</button> 
                <h2>{isRegistering ? 'Registrati' : 'Accedi'}</h2> 
                {error && <p className="error-msg">{error}</p>} {/* Mostra l'errore se presente */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Gestisce cambiamento email
                    placeholder="Email"
                    className="auth-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Gestisce cambiamento password
                    placeholder="Password"
                    className="auth-input"
                />
                {isRegistering ? (
                    <> {/* Se è in modalità registrazione */}
                        <input
                            type="text"
                            placeholder="Nome"
                            className="auth-input"
                        />
                        <input
                            type="text"
                            placeholder="Cognome"
                            className="auth-input"
                        />
                        <button className="auth-btn" onClick={handleSignUp}>Registrati</button> 
                        <p>Hai già un account? <span className="switch-mode" onClick={() => setIsRegistering(false)}>Accedi</span></p>
                    </>
                ) : (
                    <> {/* Se è in modalità accesso */}
                        <button className="auth-btn" onClick={handleEmailSignIn}>Accedi con Email</button> 
                        <button className="auth-btn google" onClick={handleGoogleSignIn}>Accedi con Google</button> 
                        <p>Non hai un account? <span className="switch-mode" onClick={() => setIsRegistering(true)}>Registrati</span></p> 
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPopup;
