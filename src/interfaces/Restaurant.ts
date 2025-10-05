export interface Restaurant {
  _id: string;
  englishName: string;
  arabicName: string;
  slug: string;
  cuisines: string[];
  followers: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
