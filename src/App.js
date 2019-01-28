import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Section, Container } from "react-bulma-components/full";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Loader from "react-loader-spinner";
import * as Sentry from "@sentry/browser";
import { Label, Table } from 'semantic-ui-react'

Sentry.init({
  dsn: "https://f7dff0f8273e4436892cc10c0acda945@sentry.io/1380539"
});

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
class App extends Component {
  componentDidMount() {
    document.getElementById("data").focus();
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      status: "",
      multiline: "",
      condition: false,
      inputError: false
    };
  }

  _checkValueMultiline = () => {
    if (this.state.multiline === "") {
      this.setState({
        status: "Silahkan inputkan data terlebih dahulu",
        condition: false,
        inputError: true
      });
      document.getElementById("data").focus();
    } else {
      this._downloadTxtFile();
    }
  };

  _downloadTxtFile = () => {
    this.setState({
      loading: true,
      status: "",
      data: [],
      condition: false,
      inputError: false
    });
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
          this.setState({ loading: false, multiline: "", condition: true });
          Sentry.captureMessage("200: Parsing successfully");
        } catch (err) {
          this.setState({
            status: (
              <>
                (INTERNAL SERVER ERROR) Mohon periksa lagi data yang anda input.
              </>
            ),
            loading: false,
            inputError: true
          });
          document.getElementById("data").focus();
          Sentry.captureException(err);
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
    const Jadwal = (
      <>
        <Typography variant="h6">Weekly Schedule</Typography>
        <Typography variant="subheading">
          <strong>Jadwal Mingguan Mahasiswa diolah dari SIATMA</strong>
        </Typography>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell><center>Sesi</center></Table.Cell>
              <Table.Cell><center>Mata Kuliah</center></Table.Cell>
              <Table.Cell><center>Kode</center></Table.Cell>
              <Table.Cell><center>Dosen</center></Table.Cell>
              <Table.Cell><center>Kelas</center></Table.Cell>
              <Table.Cell><center>Ruangan</center></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(this.state.data).map((e, i) => {
              return (
                <>
                  <Table.Row>
                  <Table.Cell colSpan='6'>
                  <Label color='red' ribbon key={i}>{capitalize(e)}</Label>
                  </Table.Cell>
                  </Table.Row>
                  {this.state.data[e].map((v, k) => {
                    return (
                      <Table.Row key={k}>
                        <Table.Cell>&nbsp;{v.sesi}</Table.Cell>
                        <Table.Cell>{v.mata_kuliah}</Table.Cell>
                        <Table.Cell>{v.kode}&nbsp;</Table.Cell>
                        <Table.Cell>{v.dosen_pengampu}</Table.Cell>
                        <Table.Cell>{v.kelas}&nbsp;</Table.Cell>
                        <Table.Cell>{v.ruangan}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </>
              );
            })}
          </Table.Body>
        </Table>
        <Typography variant="overline">
          Generated on {Date()} by <strong>jadwal.vriyas.com</strong>
        </Typography>
      </>
    );

    let show;

    if (this.state.loading) {
      show = <Loader type="Oval" color="#000" height="32" width="32" />;
    } else {
      if (this.state.condition) {
        show = Jadwal;
      } else {
        show = "";
      }
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
                error={this.state.inputError}
                fullWidth
                rowsMax="10"
                value={this.state.multiline}
                onChange={this.handleChange("multiline")}
                margin="none"
                autoFocus
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
                onClick={this._checkValueMultiline}
              >
                Parse
              </Button>
            </div>
            <p>&nbsp;</p>
            {this.state.status && (
              <Typography variant="body1">
                API Status: <strong>{this.state.status}</strong>
              </Typography>
            )}
            <div>{show}</div>
            <div>
              {" "}
              Made with <span>❤</span> by <strong>Vriyas Hartama</strong>.<br />
              &copy; 2019{" "}
              <a
                href="https://vriyas.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>vriyas.com</strong>
              </a>{" "}
              -{" "}
              <a
                href="https://github.com/haruute0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>GitHub</strong>
              </a>
            </div>
          </Container>
        </Section>
      </div>
    );
  }
}

export default App;
