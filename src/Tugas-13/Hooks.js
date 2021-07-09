import { useState, useEffect } from "react";
import "./Hooks.css";
import axios from "axios";

const Hooks = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const url = "http://backendexample.sanbercloud.com/api/";
  const [counter, setCounter] = useState(0);

  const [dataMahasiswa, setDataMahasiswa] = useState({
    id: "",
    name: "",
    course: "",
    score: 0,
  });

  useEffect(() => {
    const getMahasiswa = () => {
      axios
        .get(url + "student-scores")
        .then(({ data }) => {
          console.log(data);
          setMahasiswa(data);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    };

    getMahasiswa();
  }, [counter]);

  const grade = (nilai) => {
    if (nilai <= 100 && nilai >= 80) {
      return "A";
    } else if (nilai >= 70 && nilai < 80) {
      return "B";
    } else if (nilai >= 60 && nilai < 70) {
      return "C";
    } else if (nilai >= 50 && nilai < 60) {
      return "D";
    } else if (nilai < 50 && nilai >= 0) {
      return "E";
    }
  };

  const onChange = (e) => {
    setDataMahasiswa({ ...dataMahasiswa, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if(dataMahasiswa.score > 100 || dataMahasiswa.score < 0){
        alert("Nilai maksimal 100 dan nilai minimal 0")
    }else{
    if (dataMahasiswa.id === "") {
      axios
        .post(url + "student-scores", dataMahasiswa)
        .then(({ data }) => {
          console.log("Berhasil");
          setDataMahasiswa({
            id: "",
            name: "",
            course: "",
            score: 0,
          });
          setCounter(oldValue => oldValue +1)
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    } else {
      const newData = {
        name: dataMahasiswa.name,
        course: dataMahasiswa.course,
        score: dataMahasiswa.score,
      };
      axios
        .put(url + "student-scores/" + dataMahasiswa.id, newData)
        .then(({ data }) => {
          console.log("Berhasil");
          setDataMahasiswa({
            id: "",
            name: "",
            course: "",
            score: 0,
          });
          setCounter(oldValue => oldValue +1)
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }}
  };

  const handleEdit = (id) => {
    axios
      .get(url + "student-scores/" + id)
      .then(({ data }) => {
        setDataMahasiswa({
          id: data.id,
          name: data.name,
          course: data.course,
          score: data.score,
        });
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${url}student-scores/${id}`)
    .then(({ data}) => {
        console.log("Berhasil")
        alert("Apakah Data Akan Dihapus ?")
        setCounter(oldValue => oldValue + 1)
    })
    .catch((error) => {
        alert(error);
        console.log(error);
    })
  }

  return (
    <>
      <h1>Daftar Nilai Mahasiswa</h1>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Mata Kuliah</th>
              <th>Nilai</th>
              <th>Index Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.length > 0 ? (
              mahasiswa.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.course}</td>
                    <td>{item.score}</td>
                    <td>{grade(item.score)}</td>
                    <td>
                      <button className="button-aksi" onClick={() => handleEdit(item.id)}>Edit</button>

                      <button className="button-aksi" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>

        <h1>Form Nilai Mahasiswa</h1>

        <div className="flex justify-content-center">
          <div className="form-submit">
            <div className="flex justify-content-between form-group">
              <label className="label-form">Nama :</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={dataMahasiswa.name}
                onChange={onChange}
              />
            </div>
            <div className="flex justify-content-between form-group">
              <label className="label-form">Mata Kuliah :</label>
              <input
                type="text"
                name="course"
                className="form-input"
                value={dataMahasiswa.course}
                onChange={onChange}
              />
            </div>
            <div className="flex justify-content-between form-group">
              <label className="label-form">Nilai : </label>
              <input
                type="number"
                name="score"
                className="form-input"
                min="0"
                max="100"
                value={dataMahasiswa.score}
                onChange={onChange}
              />
            </div>
            <div className="flex justify-content-end">
              <button className="submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hooks;