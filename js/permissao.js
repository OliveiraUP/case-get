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

async function pesquisarPermissao() {
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/permissao/buscar?page=${pag}&valor=${pesquisa}`
    : getPageUrl();

  try {
    const apiData = await getApiData(url);
    clearTable();
    apiData.forEach((permissao, index) => {
      createRow(permissao, index);
    });

    const totalElements = pesquisa
      ? apiData.length
      : await getApiPag(getPageUrl());
    await getRangeText(totalElements);
  } catch (error) {
    console.error("Erro ao obter os dados:", error);
  }
}

const getdadosPermissao = async () => {
  const url = getPageUrl();
  const apiData = await getApiData(url);
  return apiData ?? [];
};

function getPageUrl() {
  return `http://18.233.181.140:8000/hmlg/gestao/permissao/p?page=${pag}`;
}

const setdadosPermissao = async (dbPermissao) => {
  const jsonData = JSON.stringify(dbPermissao);

  const url = "http://18.233.181.140:8000/hmlg/gestao/permissao";

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

const createPermissao = async (permissao) => {
  const novaPermissao = {
    dataInicio: permissao.dataInicio,
    ano: permissao.ano,
    serie: permissao.serie,
    duracaoPermissao: permissao.duracaoPermissao,
    escola: permissao.escola,
  };

  const url = "http://18.233.181.140:8000/hmlg/gestao/permissao";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(novaPermissao),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      updateTable();
    });
};

//READ

const readPermissao = () => getdadosPermissao();

//UPDATE

async function updatePermissao(index, permissao) {
  const dbPermissao = await getdadosPermissao();
  const url = "http://18.233.181.140:8000/hmlg/gestao/permissao";
  const bodyData = {
    id: dbPermissao[index].id,
    dataInicio: permissao.dataInicio,
    ano: permissao.ano,
    serie: permissao.serie,
    duracaoPermissao: permissao.duracaoPermissao,
    escola: permissao.escola,
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

const deletePermissao = (id) => {
  fetch(`http://18.233.181.140:8000/hmlg/gestao/permissao?id=${id}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Permissao excluída com sucesso!");
      updateTable();
    })
    .catch((error) => {
      console.error("Erro ao excluir a permissao:", error);
    });
};
//INTERAÇÃO COM O LAYOUT
const clearFields = () => {
  const fields = document.querySelectorAll(".formulario-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("dataInicio").dataset.index = "new";
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const savePermissao = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Permissão";
  if (isValidFields()) {
    const permissao = {
      dataInicio: document.getElementById("dataInicio").value,
      ano: document.getElementById("ano").value,
      serie: document.getElementById("serie").value,
      duracaoPermissao: document.getElementById("duracaoPermissao").value,
      escola: document.getElementById("escola").value,
    };
    const index = document.getElementById("dataInicio").dataset.index;
    if (index === "new") {
      createPermissao(permissao);
      updateTable();
      clearFields();
      document.getElementById("nome").dataset.index = "new";
    } else {
      updatePermissao(index, permissao);
      updateTable();
      clearFields();
    }
  }
};

const cancelaPermissao = () => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Cadastro de Permissão";
  clearFields();
};

const createRow = (permissao, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td data-label="#:">${index + 1}</td>
    <td data-label="Código:">${permissao.codigo}</td>
    <td data-label="Escola:">${permissao.escola.nome}</td>
    <td data-label="Data de Início:">${permissao.dataInicio}</td>
    <td data-label="Data de Validade:">${permissao.dataValidade}</td>
    <td data-label="Período:">${permissao.ano} - ${permissao.serie}</td>
    <td data-label="Duração:">${permissao.tempoPermissao}</td>
    <td data-label="Ação:">
    <button type="button" class="button green" id="edit-${index}">Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
  </td>`;
  document.querySelector("#tablePermissao>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tablePermissao>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  clearTable();
  getdadosPermissao().then((apiData) => {
    apiData.forEach((permissao, index) => {
      createRow(permissao, index);
    });
  });
  getRangeText(); // Atualizar o texto de paginação
};

const fillFields = (permissao) => {
  (document.getElementById("dataInicio").value = permissao.dataInicio),
    (document.getElementById("ano").value = permissao.ano),
    (document.getElementById("serie").value = permissao.serie),
    (document.getElementById("duracaoPermissao").value =
      permissao.duracaoPermissao),
    (document.getElementById("escola").value = permissao.escola),
    (document.getElementById("dataInicio").dataset.index =
      permissao.index.toString());

  console.log(document.getElementById("nome").dataset.index);
  console.log(permissao.id);
};

const editPermissao = async (index) => {
  const h1 = document.querySelector(".header h1");
  h1.innerHTML = "Alterando Permissão #" + (Number(index) + 1);
  const permissao = (await readPermissao())[index];
  permissao.index = index;
  fillFields(permissao);
};

const editDelete = async (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    console.log([action, index]);
    if (action === "edit") {
      editPermissao(index);
    } else {
      const dbPermissao = await readPermissao();
      const permissao = dbPermissao[index];
      const response = confirm(
        `Deseja realmente excluir a permissao ${permissao.nome}?`
      );
      if (response) {
        deletePermissao(permissao.id);
        updateTable();
      }
    }
  }
};

async function getRangeText() {
  const paginas = document.querySelector(".localizacao-pag");
  const pesquisa = document.getElementById("valor-pesquisa").value;
  const url = pesquisa
    ? `http://18.233.181.140:8000/hmlg/gestao/permissao/buscar?page=0&valor=${pesquisa}`
    : `http://18.233.181.140:8000/hmlg/gestao/permissao/p?page=0`;
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
    const url = `http://18.233.181.140:8000/hmlg/gestao/permissao/buscar?page=${pag}&valor=${pesquisa}`;
    totalElements = await getApiPag(url);
  } else {
    const url = getPageUrl();
    totalElements = await getApiPag(url);
  }

  if (targetClass.includes("volta-pag") && pag > 0) {
    pag--;
    const url = pesquisa
      ? `http://18.233.181.140:8000/hmlg/gestao/permissao/buscar?page=${pag}&valor=${pesquisa}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((permissao, index) => {
          createRow(permissao, index);
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
      ? `http://18.233.181.140:8000/hmlg/gestao/permissao/buscar?page=${pag}&valor=${pesquisa}`
      : getPageUrl();
    getApiData(url)
      .then((apiData) => {
        clearTable();
        apiData.forEach((permissao, index) => {
          createRow(permissao, index);
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
document.getElementById("salvar").addEventListener("click", savePermissao);
document.getElementById("cancelar").addEventListener("click", cancelaPermissao);



document
  .getElementById("btn-pesquisar")
  .addEventListener("click", pesquisarPermissao);

document
  .getElementById("valor-pesquisa")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      pesquisarPermissao();
    }
  });

document.querySelector(".volta-pag").addEventListener("click", voltaProxPag);

document.querySelector(".proxima-pag").addEventListener("click", voltaProxPag);

document
  .querySelector("#tablePermissao>tbody")
  .addEventListener("click", editDelete);
