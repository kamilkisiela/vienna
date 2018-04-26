import gql from 'graphql-tag';

export const bookFragment = gql`
  fragment bookFragment on Book {
    id
    volumeInfo {
      title
      subtitle
      authors
      publisher
      publishDate
      description
      averageRating
      ratingsCount
      imageLinks {
        thumbnail
        smallThumbnail
      }
    }
  }
`;

export interface Book {
  id: string;
  inCollection: boolean;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishDate: string;
    description: string;
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
}
