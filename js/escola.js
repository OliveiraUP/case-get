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

async function pesquisarEscola() {
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/escola/buscar?page=${pag}&valor=${pesquisa}`
    : getPageUrl();

  try {
    const apiData = await getApiData(url);
    clearTable();
    apiData.forEach((escola, index) => {
      createRow(escola, index);
    });

    const totalElements = pesquisa
      ? apiData.length
      : await getApiPag(getPageUrl());
    await getRangeText(totalElements);
  } catch (error) {
    console.error("Erro ao obter os dados:", error);
  }
}

const getdadosEscola = async () => {
  const url = getPageUrl();
  const apiData = await getApiData(url);
  return apiData ?? [];
};

function getPageUrl() {
  return `http://18.233.181.140:8000/hmlg/gestao/escola/p?page=${pag}`;
}

const setdadosEscola = async (dbEscola) => {
  const jsonData = JSON.stringify(dbEscola);

  const url = "http://18.233.181.140:8000/hmlg/gestao/escola";

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

const createEscola = async (escola) => {
  const novaEscola = {
    nome: escola.nome,
    cidade: escola.cidade,
    uf: escola.estado,
  };

  const url = "http://18.233.181.140:8000/hmlg/gestao/escola";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(novaEscola),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      updateTable();
    });
};

//READ

const readEscola = () => getdadosEscola();

//UPDATE

async function updateEscola(index, escola) {
  const dbEscola = await getdadosEscola();
  const url = "http://18.233.181.140:8000/hmlg/gestao/escola";
  const bodyData = {
    id: dbEscola[index].id,
    nome: escola.nome,
    cidade: escola.cidade,
    uf: escola.estado,
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

const deleteEscola = (id) => {
  fetch(`http://18.233.181.140:8000/hmlg/gestao/escola?id=${id}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Escola excluída com sucesso!");
      updateTable();
    })
    .catch((error) => {
      console.error("Erro ao excluir a escola:", error);
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

const saveEscola = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Escola";
  if (isValidFields()) {
    const escola = {
      nome: document.getElementById("nome").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index === "new") {
      createEscola(escola);
      updateTable();
      clearFields();
      document.getElementById("nome").dataset.index = "new";
    } else {
      updateEscola(index, escola);
      updateTable();
      clearFields();
    }
  }
};

const cancelaEscola = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Escola";
  clearFields();
};

const createRow = (escola, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td data-label="#:">${index + 1}</td>
    <td data-label="Nome:">${escola.nome}</td>
    <td data-label="Cidade:">${escola.cidade}</td>
    <td data-label="Estado:">${escola.uf}</td>
    <td data-label="Ação:">
    <button type="button" class="button green" id="edit-${index}">Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
  </td>`;
  document.querySelector("#tableEscola>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableEscola>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  clearTable();
  getdadosEscola().then((apiData) => {
    apiData.forEach((escola, index) => {
      createRow(escola, index);
    });
  });
  getRangeText(); // Atualizar o texto de paginação
};

const fillFields = (escola) => {
  document.getElementById("nome").value = escola.nome;
  document.getElementById("cidade").value = escola.cidade;
  document.getElementById("estado").value = escola.uf;
  document.getElementById("nome").dataset.index = escola.index.toString();
  console.log(document.getElementById("nome").dataset.index);
  console.log(escola.id);
};

const editEscola = async (index) => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Alterando Escola #" + (Number(index) + 1);
  const escola = (await readEscola())[index];
  escola.index = index;
  fillFields(escola);
};

const editDelete = async (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    console.log([action, index]);
    if (action === "edit") {
      editEscola(index);
    } else {
      const dbEscola = await readEscola();
      const escola = dbEscola[index];
      const response = confirm(
        `Deseja realmente excluir a escola ${escola.nome}?`
      );
      if (response) {
        deleteEscola(escola.id);
        updateTable();
      }
    }
  }
};

async function getRangeText() {
  const paginas = document.querySelector(".localizacao-pag");
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/escola/buscar?page=0&valor=${pesquisa}`
    : `http://18.233.181.140:8000/hmlg/gestao/escola/p?page=0`;
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
    const url = `http://18.233.181.140:8000/hmlg/gestao/escola/buscar?page=${pag}&valor=${pesquisa}`;
    totalElements = await getApiPag(url);
  } else {
    const url = getPageUrl();
    totalElements = await getApiPag(url);
  }

  if (targetClass.includes("volta-pag") && pag > 0) {
    pag--;
    const url = pesquisa
      ? `http://18.233.181.140:8000/hmlg/gestao/escola/buscar?page=${pag}&valor=${pesquisa}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((escola, index) => {
          createRow(escola, index);
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
      ? `http://18.233.181.140:8000/hmlg/gestao/escola/buscar?page=${pag}&valor=${pesquisa}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((escola, index) => {
          createRow(escola, index);
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
document.getElementById("salvar").addEventListener("click", saveEscola);
document.getElementById("cancelar").addEventListener("click", cancelaEscola);

document
  .getElementById("btn-pesquisar")
  .addEventListener("click", pesquisarEscola);

document
  .getElementById("valor-pesquisa")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      pesquisarEscola();
    }
  });

document.querySelector(".volta-pag").addEventListener("click", voltaProxPag);

document.querySelector(".proxima-pag").addEventListener("click", voltaProxPag);

document
  .querySelector("#tableEscola>tbody")
  .addEventListener("click", editDelete);
