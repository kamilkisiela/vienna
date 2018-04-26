export const schema = `
  type ImageLinks {
    thumbnail: String
    smallThumbnail: String
  }

  type VolumeInfo {
    title: String
    subtitle: String
    authors: [String]
    publisher: String
    publishDate: String
    description: String
    averageRating: Float
    ratingsCount: Int
    imageLinks: ImageLinks
  }

  type Book {
    id: String!
    inCollection: Boolean
    volumeInfo: VolumeInfo
  }

  type Mutation {
    addBookToCollection(id: String!): Boolean
    removeBookFromCollection(id: String!): Boolean
  }

  type Query {
    book(id: String!): Book
  }
`;
