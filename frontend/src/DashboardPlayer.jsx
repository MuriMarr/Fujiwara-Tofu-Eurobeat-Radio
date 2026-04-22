import { useEffect, useState, useRef } from 'react';

const BACKEND_URL = "http://localhost:3000";

export default function DashboardPlayer() {
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rpm, setRpm] = useState(0);
    const [speed, setSpeed] = useState(0);

    const playerRef = useRef(null);
    const containerRef = useRef(null);

    async function loadPlaylist() {
        const res = await fetch(`${BACKEND_URL}/api/playlist/PLAZCk8xCc7mZbuQOpzt7xt_UpHrWkPuOm`);
        const data = await res.json();

        const formatted = data.videos.map(v => ({
            id: v.id,
            title: v.title
        }));
        
        if (formatted.length > 0) {
            setVideos(formatted);
            setCurrentVideo(formatted[0]);
        }
    }

    // REACT EFFECTS
    useEffect(() => {
        loadPlaylist();
    }, []);

    // YouTube Player API
    useEffect(() => {
        if (!currentVideo) return;

        function createPlayer() {
            if (!containerRef.current) return;

            if (playerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '250',
                width: '100%',
                videoId: currentVideo?.id,
                playerVars: {
                    autoplay: 1,
                    mute: 1
                }
            });
        }

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);

            window.onYouTubeIframeAPIReady = createPlayer;
        }
    }, [currentVideo]);

    useEffect(() => {
        if (playerRef.current && currentVideo) {
            playerRef.current.loadVideoById(currentVideo.id);
        }
    }, [currentVideo]);

    useEffect(() => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.playVideo();
        } else {
            playerRef.current.pauseVideo();
        }
    }, [isPlaying]);

    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                setRpm(prev => (prev + Math.random() * 800 > 8000 ? 2000 : prev + 300));
                setSpeed(prev => (prev + Math.random() * 10 > 180 ? 60 : prev + 5));
            }, 500);
        } else {
            setRpm(0);
            setSpeed(0);
        }

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="dashboard">

            <div ref={containerRef} className="yt-frame"></div>

            {/* DISPLAY */}
            <div className="display" >
                <h3>{isPlaying ? currentVideo?.title : "ENGINE OFF"}</h3>
            </div>

            {/* GAUGES */}
            <div className="gauges">
                <div className="gauge">
                    <p>RPM</p>
                    <div className="bar">
                        <div className="fill" style={{ width: `${(rpm / 8000) * 100}%` }}>
                        </div>
                    </div>
                    <span>{Math.floor(rpm)}</span>
                </div>

                <div className="gauge">
                    <p>SPEED</p>
                    <div className="bar">
                        <div className="fill speed" style={{ width: `${(speed / 180) * 100}%` }}>
                        </div>
                    </div>
                    <span>{Math.floor(speed)} km/h</span>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="controls">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? "STOP" : "START"}
                </button>
            </div>
            {/* PLAYLIST */}
            <div className="playlist">
                {videos.map((video, index) => (
                    <div key={video.id} className={`track ${currentVideo?.id === video.id ? "active" : ""}`}
                        onClick={() => { setCurrentVideo(video); setIsPlaying(true); }}>
                        {index + 1}. {video.title}
                    </div>
                ))
                }
            </div>

        </div>
    );
}