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

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("dbEscola")) ?? [];

const setLocalStorage = (dbEscola) =>
  localStorage.setItem("dbEscola", JSON.stringify(dbEscola));

const createEscola = (escola) => {
  const dbEscola = getLocalStorage();
  dbEscola.push(escola);
  setLocalStorage(dbEscola);
};

//READ

const readEscola = () => getLocalStorage();

//UPDATE

const updateEscola = (index, escola) => {
  const dbEscola = readEscola();
  dbEscola[index] = escola;
  setLocalStorage(dbEscola);
};

//DELETE

const deleteEscola = (index) => {
  const dbEscola = readEscola();
  dbEscola.splice(index, 1);
  setLocalStorage(dbEscola);
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
  const h1 = document.querySelector(".form-header h1");
  h1.innerHTML = "Cadastro de Escola";
  if (isValidFields()) {
    const escola = {
      nome: document.getElementById("nome").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
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
  clearFields();
};

const createRow = (escola, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${escola.nome}</td>
  <td>${escola.cidade}</td>
  <td>${escola.estado}</td>
  <td>
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
  const dbEscola = readEscola();
  clearTable();
  dbEscola.forEach(createRow);
};

const fillFields = (escola) => {
  document.getElementById("nome").value = escola.nome;
  document.getElementById("cidade").value = escola.cidade;
  document.getElementById("estado").value = escola.estado;
  document.getElementById("nome").dataset.index = escola.index;
};

const editEscola = (index) => {
  const h1 = document.querySelector(".form-header h1");
  h1.innerHTML = "Alterando Escola #" + (Number(index) + 1);
  const escola = readEscola()[index];
  escola.index = index;
  fillFields(escola);
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editEscola(index);
    } else {
      const escola = readEscola()[index];
      const response = confirm(
        `Deseja Realmente excluir a escola ${escola.nome}?`
      );
      if (response) {
        deleteEscola(index);
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
