const modal = document.querySelector('.modal-container')
const listaFilmes = document.querySelector('#lista-filmes')
const btnAdicionar = document.querySelector('#btn-adicionar')
const sTitulo = document.querySelector('#m-nome')
const sGenero = document.querySelector('#m-funcao')
const sPoster = document.querySelector('#m-foto')
const posterPreview = document.querySelector('#foto-preview')
const btnSalvar = document.querySelector('#btnSalvar')
const btnCancelar = document.querySelector('.btn-cancelar')

let itens
let id

const getItensBD = () => JSON.parse(localStorage.getItem('dbmylist')) ?? []
const setItensBD = () => localStorage.setItem('dbmylist', JSON.stringify(itens))

sPoster.addEventListener('input', mostrarPreviewPoster)

function mostrarPreviewPoster() {
  const url = sPoster.value.trim()
  
  if (url) {
    posterPreview.style.display = 'block'
    posterPreview.src = url
    
    posterPreview.onerror = function() {
      this.style.display = 'none'
      this.src = ''
    }
  } else {
    posterPreview.style.display = 'none'
    posterPreview.src = ''
  }
}

function openModal(edit = false, index = 0) {
  modal.classList.add('active')
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }
  
  if (edit) {
    sTitulo.value = itens[index].titulo
    sGenero.value = itens[index].genero
    sPoster.value = itens[index].poster || ''
    mostrarPreviewPoster()
    id = index
  } else {
    sTitulo.value = ''
    sGenero.value = ''
    sPoster.value = ''
    posterPreview.style.display = 'none'
    posterPreview.src = ''
    id = undefined
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  if (confirm('Tem certeza que deseja excluir este filme?')) {
    itens.splice(index, 1)
    setItensBD()
    loadItens()
  }
}

function insertItem(item, index) {
  let div = document.createElement('div')
  div.className = 'item'
  
  const posterHTML = item.poster 
    ? `<img src="${item.poster}" onerror="this.outerHTML='<div class=\'poster-placeholder\'>?</div>'">`
    : `<div class="poster-placeholder">?</div>`
  
  div.innerHTML = `
    ${posterHTML}
    <div class="acoes">
      <button onclick="editItem(${index})" class="btn-editar"><i class='bx bx-edit'></i></button>
      <button onclick="deleteItem(${index})" class="btn-excluir"><i class='bx bx-trash'></i></button>
    </div>
  `
  listaFilmes.appendChild(div)
}

btnSalvar.onclick = e => {
  if (sTitulo.value == '' || sGenero.value == '') {
    return
  }

  e.preventDefault();
  
  if (id !== undefined) {
    itens[id].titulo = sTitulo.value
    itens[id].genero = sGenero.value
    itens[id].poster = sPoster.value
  } else {
    itens.push({
      'titulo': sTitulo.value, 
      'genero': sGenero.value, 
      'poster': sPoster.value
    })
  }
  
  setItensBD()
  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  listaFilmes.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

function closeModal() {
    modal.classList.remove('active')
    sTitulo.value = ''
    sGenero.value = ''
    sPoster.value = ''
    posterPreview.style.display = 'none'
    posterPreview.src = ''
    id = undefined
}

btnCancelar.addEventListener('click', e => {
    e.preventDefault()
    closeModal()
})

loadItens() 