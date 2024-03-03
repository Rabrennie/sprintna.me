import { env } from '$env/dynamic/private';

interface OmdbMovie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

interface OmdbSearchResponse {
    Search: OmdbMovie[];
    totalResults: string;
    Response: string;
}

export const getToken = async () => {
    return env.OMDB_API_KEY;
};

export const search = async (query: string, token: string): Promise<OmdbSearchResponse> => {
    const params = new URLSearchParams({ s: query, type: 'movie', apikey: token });
    const res = await fetch(`https://www.omdbapi.com/?${params}`, {
        method: 'GET'
    });

    return await res.json();
};

export const singleMovie = async (movieId: string, token: string): Promise<OmdbMovie> => {
    const params = new URLSearchParams({ i: movieId, apikey: token });
    const res = await fetch(`https://www.omdbapi.com/?${params}`, {
        method: 'GET'
    });

    return await res.json();
};
