export interface SpotifyTokens {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}
export interface SpotifyUser {
    country: string,
    display_name: string,
    email: string,
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: {
        spotify: string
    },
    followers: {
        href: string,
        total: number
    },
    href: string,
    id: string,
    images: [
        {
            url?: string,
            height: number,
            width: number
        }
    ],
    product: string,
    type: string,
    uri: string
}
export interface SpotifyUserPlaylists {
    href: string,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number,
    items: [
        {
            collaborative: false,
            description: string,
            external_urls: {
                spotify: string
            },
            href: string,
            id: string,
            images: [
                {
                    url: string,
                    height: number,
                    width: number
                }
            ],
            name: string,
            owner: {
                external_urls: {
                    spotify: string
                },
                followers: {
                    href: string,
                    total: number
                },
                href: string,
                id: string,
                type: string,
                uri: string,
                display_name: string
            },
            public: false,
            snapshot_id: string,
            tracks: {
                href: string,
                total: number
            },
            type: string,
            uri: string
        }
    ]
}


export interface SpotifyPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    owner: {
        external_urls: {
            spotify: string;
        };
        followers: {
            href: string;
            total: number;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
        display_name: string;
    };
    public: boolean;
    snapshot_id: string;
    tracks: {
        href: string;
        limit: number;
        next: string;
        offset: number;
        previous: string;
        total: number;
        items: {
            added_at: string;
            added_by: {
                external_urls: {
                    spotify: string;
                };
                followers: {
                    href: string;
                    total: number;
                };
                href: string;
                id: string;
                type: string;
                uri: string;
            };
            is_local: boolean;
            track: {
                album: {
                    album_type: string;
                    total_tracks: number;
                    available_markets: string[];
                    external_urls: {
                        spotify: string;
                    };
                    href: string;
                    id: string;
                    images: {
                        url: string;
                        height: number;
                        width: number;
                    }[];
                    name: string;
                    release_date: string;
                    release_date_precision: string;
                    restrictions?: {
                        reason: string;
                    };
                    type: string;
                    uri: string;
                    artists: {
                        external_urls: {
                            spotify: string;
                        };
                        href: string;
                        id: string;
                        name: string;
                        type: string;
                        uri: string;
                    }[];
                };
                artists: {
                    external_urls: {
                        spotify: string;
                    };
                    href: string;
                    id: string;
                    name: string;
                    type: string;
                    uri: string;
                }[];
                available_markets: string[];
                disc_number: number;
                duration_ms: number;
                explicit: boolean;
                external_ids: {
                    isrc: string;
                    ean: string;
                    upc: string;
                };
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                is_playable: boolean;
                linked_from?: Record<string, unknown>;
                restrictions?: {
                    reason: string;
                };
                name: string;
                popularity: number;
                preview_url: string;
                track_number: number;
                type: string;
                uri: string;
                is_local: boolean;
            };
        }[];
    };
    type: string;
    uri: string;
}
