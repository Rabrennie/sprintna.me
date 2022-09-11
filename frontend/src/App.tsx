import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
    const [socketUrl, setSocketUrl] = useState('ws://localhost:4321');
    const [messageHistory, setMessageHistory] = useState<any>([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((history: any) => [...history, lastMessage]);
        }
    }, [lastMessage, setMessageHistory]);

    const handleClickSendMessage = useCallback(() => sendMessage('Hello'), [sendMessage]);

    return (
        <div className="">
            <header className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <button onClick={handleClickSendMessage} className="btn">ABC</button>
                <ul>
                    {messageHistory.map((message: any, idx: any) => (
                        <span key={idx}>{message ? message.data : null}</span>
                    ))}
                </ul>
            </header>
        </div>
    );
}

export default App;
