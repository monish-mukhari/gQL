import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';

const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`

function App() {
   
  const { data, loading } = useQuery(query);

  if(loading) {
    return <div>
      loading...
    </div>
  }

  return (
    <div>
      <table style={{ border: "solid white 4px" }}>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
          </tr>
          {
            data.getTodos.map((todo: { title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; user: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; }) => <tr>
                <td style={{ textAlign: "left" }}>{todo.title}</td>
                <td>{todo.user.name}</td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}

export default App
