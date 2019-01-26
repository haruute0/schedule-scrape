import React, { Component } from 'react'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }

    }
    _downloadTxtFile = () => {
      var file = new Blob([document.getElementById('data').value], {type: 'text/plain'});
        fetch("http://localhost:5000/schedule", {
             method: 'POST',
             body: file
        }).then((response) => response.text())
        .then(json => {
            var myObject = JSON.parse(json);
            this.setState({
                data: myObject
            })
        })
    }

    render() {
      return (
        <div>
        <div>
          <textarea id="data" />
          <button onClick={this._downloadTxtFile}>Parse</button>
        </div>
        <div>
        <ul>
            {this.state.data.map(item=> <li key={item.index.toString()}>{item.mata_kuliah}</li>)}
        </ul>
        </div>
        </div>
      );
    }
  }

export default App
