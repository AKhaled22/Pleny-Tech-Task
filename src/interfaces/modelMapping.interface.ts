export interface IModelMappingsForWhere {
  Restaurant: {
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
  };
  User: {
    _id: string;
    fullName: string;
    favoriteCuisines: string[];
    following: string[];
  };
}
