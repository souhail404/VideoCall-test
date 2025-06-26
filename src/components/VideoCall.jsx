import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { VideoPlayer } from './VideoPlayer';

const TOKEN = "007eJxTYOBT1u6accbokpfuz9QC9lLfm8c8npc4hbX9sdl/RuGd0AYFhiQzI2Nzy+Rkc1MLcxNDU9MkS4Nk82Rzi7TkJGODJKMktbzYjIZARgZ7tWwmRgYIBPFZGEpSi0sYGADv6R2/";
const APP_ID = "b62379cc75874155b90c7c78fcb30b2b";
const CHANNEL = "test";

const client = AgoraRTC.createClient({
    mode:"rtc",
    codec:"vp8"
})

const VideoCall = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType === 'audio') {
        // user.audioTrack.play()
        }
    };

    const handleUserLeft = async (user)=>{
        setUsers((previousUsers) =>
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    }

    useEffect(()=>{
        client.on("user-published", handleUserJoined);
        client.on("user-left", handleUserLeft);

        client.join(APP_ID, CHANNEL, TOKEN, null)
            .then((uid) => 
               Promise.all([
                    AgoraRTC.createMicrophoneAndCameraTracks(), 
                    uid,
                ])
            ).then(([tracks, uid])=> {
                const [audioTrack, videoTrack] = tracks;
                console.log({
                    uid,
                    videoTrack,
                })
                setUsers(prevUsers=>[...prevUsers,{
                    uid,
                    videoTrack,
                    audioTrack,
                }])
                
                client.publish(tracks);
            });
        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish(tracks).then(() => client.leave());
    };
    },[])

    useEffect(() => {
        console.log("Users updated:", users);
    }, [users]);

    return (
        <div>
            {users.map(user => (
                <VideoPlayer key={user.uid} user={user} />
            ))}
        </div>
    )
}

export default VideoCall