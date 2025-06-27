import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div className='video-player'>
      Uid: {user.uid}
      <div
        
        ref={ref}
        style={{ width: '100%', height: '100%' }}
      ></div>
    </div>
  );
};