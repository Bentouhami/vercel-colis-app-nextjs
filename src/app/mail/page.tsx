"use client";
export default function Page() {
    return (
        <div>
            <h1>Click the button to send an email</h1>
            <button onClick={() => fetch('/api/mails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })}>Send Mail</button>

        </div>
    )
}
