import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import CameraPlayer from "./CameraPlayer";
interface CameraItem {
    id: number;
    code: string;
    rtsp_url: string;
    description?: string;
    type: string;
}

const CameraTest: React.FC = () => {
    const [cameras, setCameras] = useState<CameraItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const res = await fetch("http://localhost:8000/cameras/");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: CameraItem[] = await res.json();
                setCameras(data);
            } catch (err: any) {
                console.error("Erreur API caméras:", err);
                setError("Impossible de charger les caméras.");
            } finally {
                setLoading(false);
            }
        };

        fetchCameras();
    }, []);

    if (loading) return <p>Chargement des caméras...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (cameras.length === 0) return <p>Aucune caméra disponible.</p>;

    return (
        <div className="space-y-6">
            {cameras.map((cam) => (
                <div key={cam.id} className="border p-2 rounded shadow">
                    <h3 className="font-semibold mb-2">
                        {cam.description || cam.code} ({cam.type})
                    </h3>
                    <CameraPlayer src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8" />
                </div>
            ))}
        </div>
    );
};

export default CameraTest;
