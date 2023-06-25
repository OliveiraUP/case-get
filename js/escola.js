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

const getApiData = async () => {
  const response = await fetch(
    "http://18.233.181.140:8000/hmlg/gestao/escola/p?page=0"
  );
  const data = await response.json();
  return data.content;
};

const getdadosEscola = async () => {
  const apiData = await getApiData();
  return apiData ?? [];
};


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

const updateTable = async () => {
  const dbEscola = await readEscola();
  clearTable();
  dbEscola.forEach(createRow);
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

updateTable();

//EVENTOS
document.getElementById("salvar").addEventListener("click", saveEscola);
document.getElementById("cancelar").addEventListener("click", cancelaEscola);

document
  .querySelector("#tableEscola>tbody")
  .addEventListener("click", editDelete);
