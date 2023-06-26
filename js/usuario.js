//Expandir Menu
const btnExp = document.querySelector("#btn-exp");
const menuLateral = document.querySelector(".menu-lateral");
const header = document.querySelector("header");

btnExp.addEventListener("click", () => {
  header.classList.toggle("expandir");
  menuLateral.classList.toggle("expandir");
});

if (window.innerWidth < 900) {
  if (header.classList.contains("expandir")) {
    header.classList.remove("expandir");
    menuLateral.classList.remove("expandir");
  }
}

//CRUD

//CREATE
let pag = 0;

const getApiData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.content;
};

const getApiPag = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.totalElements;
};

async function pesquisarUsuario() {
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/usuario/buscar?nome=${pesquisa}&page=${pag}`
    : getPageUrl();

  try {
    const apiData = await getApiData(url);
    clearTable();
    apiData.forEach((usuario, index) => {
      createRow(usuario, index);
    });

    const totalElements = pesquisa
      ? apiData.length
      : await getApiPag(getPageUrl());
    await getRangeText(totalElements);
  } catch (error) {
    console.error("Erro ao obter os dados:", error);
  }
}

const getdadosUsuario = async () => {
  const url = getPageUrl();
  const apiData = await getApiData(url);
  return apiData ?? [];
};

function getPageUrl() {
  return `http://18.233.181.140:8000/hmlg/gestao/usuario/p?page=${pag}`;
}

const setdadosUsuario = async (dbUsuario) => {
  const jsonData = JSON.stringify(dbUsuario);

  const url = "http://18.233.181.140:8000/hmlg/gestao/usuario";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: jsonData,
    });

    if (response.ok) {
      console.log("Dados enviados com sucesso!");
      updateTable();
    } else {
      console.error("Erro ao enviar os dados:", response.statusText);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};

const createUsuario = async (usuario) => {
  const novaUsuario = {
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  };

  const url = "http://18.233.181.140:8000/hmlg/gestao/usuario";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(novaUsuario),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      updateTable();
    });
};

//READ

const readUsuario = () => getdadosUsuario();

//UPDATE

async function updateUsuario(index, usuario) {
  const dbUsuario = await getdadosUsuario();
  const url = "http://18.233.181.140:8000/hmlg/gestao/usuario";
  const bodyData = {
    id: dbUsuario[index].id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  };
  console.log(bodyData);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Dados atualizados com sucesso!");
      console.log(data);
      updateTable();
    })
    .catch((error) => {
      console.error("Erro ao atualizar os dados:", error);
    });
}

//DELETE

const deleteUsuario = (id) => {
  fetch(`http://18.233.181.140:8000/hmlg/gestao/usuario?id=${id}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Usuario excluída com sucesso!");
      updateTable();
    })
    .catch((error) => {
      console.error("Erro ao excluir a usuario:", error);
    });
};
//INTERAÇÃO COM O LAYOUT
const clearFields = () => {
  const fields = document.querySelectorAll(".formulario-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("nome").dataset.index = "new";
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const saveUsuario = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Usuario";
  if (isValidFields()) {
    const usuario = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      perfil: document.getElementById("perfil").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index === "new") {
      createUsuario(usuario);
      updateTable();
      clearFields();
      document.getElementById("nome").dataset.index = "new";
    } else {
      updateUsuario(index, usuario);
      updateTable();
      clearFields();
    }
  }
};

const cancelaUsuario = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Usuario";
  clearFields();
};

const createRow = (usuario, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td data-label="#:">${index + 1}</td>
    <td data-label="Nome:">${usuario.nome}</td>
    <td data-label="Email:">${usuario.email}</td>
    <td data-label="Perfil:">${usuario.perfil}</td>
    <td data-label="Ação:">
    <button type="button" class="button green" id="edit-${index}">Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
  </td>`;
  document.querySelector("#tableUsuario>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableUsuario>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  clearTable();
  getdadosUsuario().then((apiData) => {
    apiData.forEach((usuario, index) => {
      createRow(usuario, index);
    });
  });
  getRangeText(); // Atualizar o texto de paginação
};

const fillFields = (usuario) => {
  document.getElementById("nome").value = usuario.nome;
  document.getElementById("email").value = usuario.email;
  document.getElementById("perfil").value = usuario.perfil;
  document.getElementById("nome").dataset.index = usuario.index.toString();
  console.log(document.getElementById("nome").dataset.index);
  console.log(usuario.id);
};

const editUsuario = async (index) => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Alterando Usuario #" + (Number(index) + 1);
  const usuario = (await readUsuario())[index];
  usuario.index = index;
  fillFields(usuario);
};

const editDelete = async (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    console.log([action, index]);
    if (action === "edit") {
      editUsuario(index);
    } else {
      const dbUsuario = await readUsuario();
      const usuario = dbUsuario[index];
      const response = confirm(
        `Deseja realmente excluir a usuario ${usuario.nome}?`
      );
      if (response) {
        deleteUsuario(usuario.id);
        updateTable();
      }
    }
  }
};

async function getRangeText() {
  const paginas = document.querySelector(".localizacao-pag");
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/usuario/buscar?nome=${pesquisa}&page=0`
    : `http://18.233.181.140:8000/hmlg/gestao/usuario/p?page=0`;
  const totalElements = await getApiPag(url);

  if (pesquisa) {
    const start = pag * 10 + 1;
    const end = Math.min((pag + 1) * 10, totalElements);
    paginas.innerHTML = `Mostrando ${start} até ${end} de ${totalElements}`;
  } else {
    const start = pag * 10 + 1;
    const end = Math.min((pag + 1) * 10, totalElements);
    paginas.innerHTML = `Mostrando ${start} até ${end} de ${totalElements}`;
  }
}

async function voltaProxPag(event) {
  const targetClass = event.currentTarget.classList.value;
  const pesquisa = document.getElementById("valor-pesquisa").value;
  let totalElements;

  if (pesquisa) {
    const url = `http://18.233.181.140:8000/hmlg/gestao/usuario/buscar?nome=${pesquisa}&page=${pag}`;
    totalElements = await getApiPag(url);
  } else {
    const url = getPageUrl();
    totalElements = await getApiPag(url);
  }

  if (targetClass.includes("volta-pag") && pag > 0) {
    pag--;
    const url = pesquisa
      ? `http://18.233.181.140:8000/hmlg/gestao/usuario/buscar?nome=${pesquisa}&page=${pag}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((usuario, index) => {
          createRow(usuario, index);
        });
      })
      .catch((error) => {
        console.error("Erro ao obter os dados:", error);
      });
    getRangeText(totalElements);
  } else if (
    targetClass.includes("proxima-pag") &&
    pag < Math.ceil(totalElements / 10) - 1
  ) {
    pag++;
    const url = pesquisa
      ? `http://18.233.181.140:8000/hmlg/gestao/usuario/buscar?nome=${pesquisa}&page=${pag}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((usuario, index) => {
          createRow(usuario, index);
        });
      })
      .catch((error) => {
        console.error("Erro ao obter os dados:", error);
      });
    getRangeText(totalElements);
  }
}

updateTable();

//EVENTOS
document.getElementById("salvar").addEventListener("click", saveUsuario);
document.getElementById("cancelar").addEventListener("click", cancelaUsuario);

document
  .getElementById("btn-pesquisar")
  .addEventListener("click", pesquisarUsuario);

document
  .getElementById("valor-pesquisa")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      pesquisarUsuario();
    }
  });

document.querySelector(".volta-pag").addEventListener("click", voltaProxPag);

document.querySelector(".proxima-pag").addEventListener("click", voltaProxPag);

document
  .querySelector("#tableUsuario>tbody")
  .addEventListener("click", editDelete);
