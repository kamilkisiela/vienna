export const schema = `
  type Note {
    id: String
    title: String!
    text: String
  }

  type Query {
    notes: [Note]
  }

  type Mutation {
    addNote(title: String!, text: String): Note
  }
`;
