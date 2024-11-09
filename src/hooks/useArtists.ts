import { useStore } from '../store';

export const useArtists = () => {
  const store = useStore();

  return {
    artists: store.artists,
    addArtists: async (artists: any[]) => {
      store.setArtists(artists.map(artist => ({
        artistCode: artist.artistcode,
        fullName: `${artist.firstname} ${artist.lastname}`,
        lastName: artist.lastname,
        firstName: artist.firstname,
        commissionRate: Number(artist.commissionrate),
        email: artist.email || null,
        classification: artist.classification
      })));
    },
    clearArtists: async () => {
      store.setArtists([]);
    }
  };
};