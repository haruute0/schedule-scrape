import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "react-bulma-components/dist/react-bulma-components.min.css";
import { Section, Container } from "react-bulma-components/full";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Loader from 'react-loader-spinner'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      status: ""
    };
  }

  _downloadTxtFile = () => {
    this.setState({loading: true, status: "", data:[]})
    var file = new Blob([document.getElementById("data").value], {
      type: "text/plain"
    });
    fetch("https://schedule-scrape-api.herokuapp.com/schedule", {
      method: "POST",
      body: file
    }).then(response =>
      response.text().then(json => {
          try {
        let Obj = JSON.parse(json);
        this.setState({
          data: Obj,
          status: "OK"
        });
        this.setState({loading: false, multiline:""})

    } catch(err) {
        this.setState({
            status: <Typography variant="body1">INTERNAL SERVER ERROR<br />Mohon periksa lagi data yang anda input.</Typography>
        })
        this.setState({loading: false})
        console.log(err)

    }
      })
    );
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const Jadwal = Object.keys(this.state.data).map((e, i) => {
      return (
        <ul key={i}>
          <li>
            <Typography variant="h6">{e}</Typography>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>&nbsp;Sesi</td>
                    <td>Mata Kuliah&nbsp;</td>
                    <td>Kode</td>
                    <td>Dosen</td>
                    <td>Kelas</td>
                    <td>Ruangan</td>
                  </tr>
                  {this.state.data[e].map((v, k) => {
                    return (
                      <tr key={k}>
                        <td>&nbsp;{v.sesi}</td>
                        <td>{v.mata_kuliah}</td>
                        <td>{v.kode}&nbsp;</td>
                        <td>{v.dosen}</td>
                        <td>{v.kelas}&nbsp;</td>
                        <td>{v.ruangan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      );
    });

    let show

    if (this.state.loading) {
        show =       <Loader 
        type="Oval"
        color="#000"
        height="32"	
        width="32"
     />  
    } else {
        show = Jadwal
    }

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Schedule Scrapper</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          <link rel="canonical" href="https://jadwal.vriyas.com/" />
        </Helmet>
        <Section>
          <Container>
            <div>
              <Typography component="h1" variant="h3" gutterBottom>
                Schedule Scraper
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Web app ini mengubah{" "}
                <strong>Halaman Jadwal Kuliah SIATMA</strong> menjadi{" "}
                <code>Compact Weekly Schedule</code> menggunakan API.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Salin seluruh konten{" "}
                <code>
                  view-source:http://siatma.uajy.ac.id/View/JadwalKuliah.aspx
                </code>{" "}
                dan kutip pada textarea dibawah.
              </Typography>
              <p>&nbsp;</p>
              <TextField
                variant="outlined"
                id="data"
                label="Masukkan hasil copy disini"
                multiline
                fullWidth
                rowsMax="10"
                value={this.state.multiline}
                onChange={this.handleChange("multiline")}
                margin="none"
              />
              <p>&nbsp;</p>
              <Typography variant="body1" gutterBottom>
                Setelah selesai mengutip, tekan tombol dibawah dan tunggu hingga
                API selesai memproses.{" "}
              </Typography>
              <p>&nbsp;</p>{" "}
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this._downloadTxtFile}
              >
                Parse
              </Button>
            </div>
            <p>&nbsp;</p>
            {this.state.status}
            <div>

            {show}

            </div>
          </Container>
        </Section>
      </div>
    );
  }
}

export default App;
