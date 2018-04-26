export const schema = `
  type Layout {
    showSidenav: Boolean!
  }

  type Mutation {
    toggleSidenav(open: Boolean!): Layout
  }

  type Query {
    layout: Layout
  }
`;
