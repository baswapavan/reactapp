//import logo from './logo.svg';//
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [tabName, setTabName] = useState('');
  const [albums, setAlbums] = useState([]);
  const [toDos, setToDos] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => { getUsers(); }, []);

  const getUsers = () => {
    setTabName('users');
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setUsers(json);
      })
  };
  const handleUserSelection = (event, userID, userName) => {
    event.target.checked ? setSelectedUser(userID) : setSelectedUser('');
    event.target.checked ? setSelectedUserName(userName) : setSelectedUserName('');
  }
  const getPosts = () => {
    setTabName('posts');
    fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setPosts(json);
      })
  };
  const getPostComments = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((json) => {
        // console.log(posts.find((post) => post.id == postId));
        posts.find((post) => post.id == postId).comments = json;
        setPosts(posts);
        // console.log(posts);
        setComments(json);
      })
  };
  const getAlbums = () => {
    setTabName('albums');
    fetch(`https://jsonplaceholder.typicode.com/albums`)
      .then((res) => res.json())
      .then((json) => {
        setAlbums(json);
      })
  };
  const getToDos = () => {
    setTabName('toDos');
    fetch(`https://jsonplaceholder.typicode.com/todos`)
      .then((res) => res.json())
      .then((json) => {
        // toDos.find((toDo) => toDo.id == toDoId).toDos = json
        setToDos(json);
      }
      )
  };
  const getAlbumphotos = (albumId) => {
    fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`)
      .then((res) => res.json())
      .then((json) => {
        albums.find((album) => album.id == albumId).photos = json;
        setAlbums(albums);
        setPhotos(json);
      })
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="clearfix">
          <span className="float-start text-primary"><h1>Learning</h1></span>
          <span className="float-end p-2 h4">{selectedUserName}</span>
        </div>
        <div className="py-2">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#tabData" onClick={getUsers}>Users ({users.length})</a>
            </li>
            <li className="nav-item">
              <a id="tabPostLink" className="nav-link " data-bs-toggle="tab" href="#tabData" onClick={getPosts} >Posts ({selectedUser ? posts.filter(post => post.userId == selectedUser).length : posts.length})</a>
            </li>
            <li className="nav-item">
              <a id="tabAlbumsLink" className="nav-link" data-bs-toggle="tab" href="#tabData" onClick={getAlbums} >Albums ({selectedUser ? albums.filter(album => album.userId == selectedUser).length : albums.length})</a>
            </li>
            <li className="nav-item">
              <a id="tabToDosLink" className="nav-link " data-bs-toggle="tab" href="#tabData" onClick={getToDos} >Todos ({selectedUser ? toDos.filter(toDo => toDo.userId == selectedUser).length : toDos.length})</a>
            </li>
          </ul>
        </div>
      </div>
      <div id="tabDiv" className="container-fluid m-3">
        {tabName === 'users' ? <table className="table table-striped">
          <tbody>
          <tr>
              <th><input type='checkbox'></input></th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
          </tr>
            {
              users.length > 0 ?
                users.map(user => 
                    <tr>
                    <td><input type="checkbox"
                      checked={((selectedUser && selectedUser === user.id) ? true : false) || ''}
                      onChange={(event) => handleUserSelection(event, user.id, user.name)}></input></td>
                    <td >{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.website}</td>
                  </tr>)
                : <tr><td>No Users</td></tr>
            }
          </tbody>
        </table>
          : (tabName === 'posts') ?
            posts && posts.length > 0 &&
            (selectedUser ? posts.filter(post => post.userId == selectedUser) : posts).map(post =>
              <div key={post.id} className='card text-start'>
                <div onClick={() => getPostComments(post.id)} className='card-body'>
                  <h4>{post.title}</h4>
                  <i className='my-2'>created by: {users.find((user) => user.id == post.userId).name} </i>
                  {
                    post.comments && post.comments.length > 0 &&
                    post.comments.map(comment =>
                      <div key={comment.id} className="text-left px-4">
                        <h6>{comment.name}</h6>
                        {comment.email}<hr></hr>
                      </div>)
                  }
                </div>
              </div>
            )
            : (tabName === "albums") ?
              albums && albums.length > 0 &&
              (selectedUser ? albums.filter(album => album.userId == selectedUser)
                : albums).map(album =>
                  <div key={album.id} className='card text-start my-3'>
                    <div onClick={() => getAlbumphotos(album.id)} className='card-body'>
                      <h4>{album.title}</h4>
                      <i className='my-1'>posted by: {users.find((user) => user.id == album.userId).name} </i><br></br>
                      {
                          album.photos && album.photos.length > 0 &&
                          album.photos.map(photo =><img className='border-top' key={photo.id} style={{ width: "50px" }} alt="colourPics" src={photo.url} />)
                      // photos.map(photo =>
                      //   <img key={photo.id} style={{ width: "50px" }} alt="colourPics" src={photo.url} />)
                        }
                    </div>
                  </div>)
              : (tabName === "toDos") ? <table className='table table-striped'>
                <tr>
                  <th>Checkbox</th>
                  <th>Id</th>
                  <th>Title</th>
                </tr>
                <tbody>
                  {
                    toDos && toDos.length ?
                      (selectedUser ? toDos.filter(toDo => toDo.userId == selectedUser) : toDos).map(toDo =>
                        <tr key={toDo.id} >
                          <td><input type='checkbox'></input></td>
                          <td>{toDo.id}</td>
                          <td>{toDo.title}</td>
                        </tr>) : <tr><td>No Todo list!</td></tr>
                  }
                </tbody>
              </table> : <div>no todos</div>
        }
      </div>
    </div>
  );
}

export default App;
