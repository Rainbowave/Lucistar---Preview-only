
import { useState, useEffect, useRef, useCallback } from 'react';
import { matchQueueService } from '../services/matchQueue';

export function useMatchRTC() {
    const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isDataChannelOpen, setIsDataChannelOpen] = useState(false);
    
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const dataChannel = useRef<RTCDataChannel | null>(null);
    const currentUserId = useRef('user_' + Math.random().toString(36).substr(2, 5));

    const cleanupConnection = useCallback(() => {
        if (dataChannel.current) {
            dataChannel.current.close();
            dataChannel.current = null;
        }
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        setRemoteStream(null);
        setIsDataChannelOpen(false);
    }, []);

    const setupDataChannel = (dc: RTCDataChannel) => {
        dc.onopen = () => {
            console.log('[RTC] Data Channel Open');
            setIsDataChannelOpen(true);
        };
        dc.onclose = () => {
            console.log('[RTC] Data Channel Closed');
            setIsDataChannelOpen(false);
        };
        dc.onmessage = (event) => {
            console.log('[RTC] Received Message:', event.data);
        };
        dataChannel.current = dc;
    };

    const startMatch = useCallback(async () => {
        cleanupConnection();
        setStatus('searching');
        setError(null);

        // Security Check: getUserMedia requires a secure context (HTTPS/localhost)
        if (!window.isSecureContext) {
            setStatus('error');
            setError("Camera access requires a secure connection (HTTPS). Please ensure you are on a trusted link.");
            return;
        }

        try {
            // 1. Request Camera/Microphone Permissions
            let stream = localStream;
            if (!stream) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, 
                        audio: true 
                    });
                    setLocalStream(stream);
                } catch (permErr: any) {
                    console.warn("Could not access real media devices, falling back to mock stream.", permErr);
                    // Create a mock video stream using a canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = 640;
                    canvas.height = 480;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = '#1a1a1a';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '30px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText('Mock Camera Stream', canvas.width / 2, canvas.height / 2);
                    }
                    const mockVideoStream = canvas.captureStream(30);
                    
                    // Create a mock audio stream
                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const oscillator = audioCtx.createOscillator();
                    const dst = audioCtx.createMediaStreamDestination();
                    oscillator.connect(dst);
                    oscillator.start();
                    
                    const mockAudioStream = dst.stream;
                    
                    // Combine them
                    stream = new MediaStream([
                        ...mockVideoStream.getVideoTracks(),
                        ...mockAudioStream.getAudioTracks()
                    ]);
                    setLocalStream(stream);
                }
            }

            // 2. Join Match Queue
            const joinResult = await matchQueueService.joinQueue(currentUserId.current);
            if (!joinResult.success) throw new Error("Matchmaking server is currently busy. Please try again in a moment.");

            // 3. Wait for Match
            const matchResult = await matchQueueService.waitForMatch(joinResult.ticketId);
            
            // 4. Initialize WebRTC Peer Connection
            const config: RTCConfiguration = {
                iceServers: matchResult.iceConfig.iceServers,
                iceCandidatePoolSize: 10
            };
            const pc = new RTCPeerConnection(config);
            peerConnection.current = pc;

            const dc = pc.createDataChannel("chat");
            setupDataChannel(dc);

            stream.getTracks().forEach(track => pc.addTrack(track, stream!));

            pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };

            pc.ondatachannel = (event) => {
                setupDataChannel(event.channel);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    // Send candidate logic here
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Simulation logic
            setTimeout(() => {
                if (!peerConnection.current) return; 
                setStatus('connected');
                setRemoteStream(new MediaStream(stream!.getTracks()));
            }, 800);

        } catch (err: any) {
            console.error("Match error:", err);
            setStatus('error');
            setError(err.message || 'An unexpected communication error occurred.');
            matchQueueService.leaveQueue(currentUserId.current);
        }
    }, [localStream, cleanupConnection]);

    const nextMatch = useCallback(() => {
        cleanupConnection();
        startMatch();
    }, [startMatch, cleanupConnection]);

    const endSession = useCallback(() => {
        cleanupConnection();
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setStatus('idle');
        matchQueueService.leaveQueue(currentUserId.current);
    }, [cleanupConnection, localStream]);

    const sendMessage = useCallback((text: string) => {
        if (dataChannel.current && dataChannel.current.readyState === 'open') {
            dataChannel.current.send(text);
        }
    }, []);

    useEffect(() => {
        return () => {
            endSession();
        };
    }, []);

    return {
        status,
        error,
        localStream,
        remoteStream,
        startMatch,
        nextMatch,
        endSession,
        sendMessage,
        isDataChannelOpen
    };
}
