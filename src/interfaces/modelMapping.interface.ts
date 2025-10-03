export interface IModelMappingsForWhere {
  Restaurant: {
    _id: string;
    englishName: string;
    arabicName: string;
    slug: string;
    cuisines: string[];
    followers: string[];
  };
  User: {
    _id: string;
    fullName: string;
    favoriteCuisines: string[];
    following: string[];
  };
}
