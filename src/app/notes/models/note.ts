import gql from 'graphql-tag';

export const noteFragment = gql`
  fragment noteFragment on Note {
    id
    title
    text
  }
`;

export interface Note {
  id?: string;
  title: string;
  text: string;
}
