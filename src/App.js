import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Section, Container } from 'react-bulma-components/full'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            status: ""
        }

    }

    _downloadTxtFile = () => {
      var file = new Blob([document.getElementById('data').value], {type: 'text/plain'});
        fetch("https://schedule-scrape-api.herokuapp.com/schedule", {
             method: 'POST',
             body: file
        })

        .then((response) => response.text()
            .then(json => {
                var myObject = JSON.parse(json)
                this.setState({
                    data: myObject
                })
            })
        )
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    render() {
      return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Schedule Scrapper</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

                <link rel="canonical" href="https://jadwal.vriyas.com/" />

            </Helmet>
            <Section>
                <Container>
                    <div>
                    <Typography component="h1" variant="h3" gutterBottom>
                    
        Schedule Scraper
      </Typography>
                        <Typography variant="subtitle1" gutterBottom>Web app ini mengubah <strong>Halaman Jadwal Kuliah SIATMA</strong> menjadi <code>idk yet.</code> menggunakan API.</Typography>
                        <Typography variant="subtitle1" gutterBottom>Salin seluruh konten <code>view-source:http://siatma.uajy.ac.id/View/JadwalKuliah.aspx</code> dan kutip pada textarea dibawah.</Typography>
                        <p>&nbsp;</p>
                        <TextField
                        variant="outlined"
          id="data"
          label="Masukkan hasil copy disini"
          multiline
          fullWidth
          disabled
          rowsMax="10"
          value={this.state.multiline}
          onChange={this.handleChange('multiline')}
          margin="none"
        />          
        <p>&nbsp;</p>
        <Typography component="h2" variant="h2" >API sedang dalam tahap pengembangan</Typography>
        <Typography variant="h5">Temporary disabled</Typography>
        <p>&nbsp;   </p>
        <Typography variant="body1" gutterBottom>Setelah selesai mengutip, tekan tombol dibawah dan tunggu hingga API selesai memproses.    </Typography>
        <p>&nbsp;</p> <Button disabled variant="contained" color="primary"  size="large" onClick={this._downloadTxtFile}>Parse</Button>
        </div>
        <p>&nbsp;</p>
        <Typography variant="body1">{this.state.status}</Typography>
        <ul>
            {this.state.data.map(item=> <li key={item.index.toString()}><div key={item.index.toString()}>
            <p>{item.mata_kuliah}</p>
            <p>{item.dosen_pengampu}</p>
            <p>{item.kelas}</p>
            <p>{item.kode}</p>
            <p>{item.ruangan}</p>
            <p>{item.jadwal1}</p>
            <p>{item.jadwal2}</p>
            <p>{item.jadwal3}</p>
            <p>{item.jadwal4}</p>
            </div></li>)}
        </ul>
        </Container>
        </Section>
        </div>
      );
    }
  }

export default App
