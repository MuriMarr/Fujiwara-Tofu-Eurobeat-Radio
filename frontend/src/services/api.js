const API = import.meta.env.VITE_API_URL;

export async function getPlaylist(id) {
    const response = await fetch(`${API}/api/playlist/${id}`);
    
    if (!response.ok) {
        throw new Error(`Erro ao buscar playlist: ${response.statusText}`);
    }

    return response.json();
}