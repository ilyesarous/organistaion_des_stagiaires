import { useEffect, useRef } from "react";

interface VideoCallProps {
  roomName: string;
  userDisplayName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomName, userDisplayName }) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName,
      width: "100%",
      height: 600,
      parentNode: jitsiContainerRef.current,
      userInfo: { displayName: userDisplayName },
    };

    // @ts-ignore
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api?.dispose?.();
  }, [roomName, userDisplayName]);

  return <div ref={jitsiContainerRef} />;
};

export default VideoCall;
