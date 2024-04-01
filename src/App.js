import './App.css';

function MyButton(){
  return(
    <button>Just a button</button>
  )
}

export default function App(){
  return(
    <div>
      <h1 className='App-header'>Welcome to the app!</h1>
      <MyButton/>
    </div>
  )
}
