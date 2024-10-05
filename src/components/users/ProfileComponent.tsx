'use client';

import {useEffect, useState} from "react";

function ProfileComponent() {
    const [userId, setUserId] = useState('');
    useEffect(() => {
        
        // get the connected user from the server
        const payload = localStorage.getItem('user');
        if (payload) {
            setUserId(JSON.parse(payload).id);
            
            // get the user profile from the server
            fetch(`/api/v1/users/profile/${userId}`).then(r => r.json()).then(data => {
                console.log(data);
            });
        }
    }, [userId]);

    if (!localStorage.getItem('user')) {
        return <div>Loading...</div>;
    }
    return (
        <div>{userId}</div>
    )
}

export default ProfileComponent
