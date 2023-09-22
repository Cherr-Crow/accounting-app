import Worker from './worker.js'

const SERVER__URL = `http://localhost:3000`

async function serverAdd(copyClass) {
  let response = await fetch(SERVER__URL + `/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(copyClass)
  })

  console.log(JSON.stringify(copyClass))
  let data = await response.json()

  return data
}

async function serverGet() {
  let response = await fetch(SERVER__URL + `/api/students`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  let data = await response.json()

  return data
}

async function serverRemove(id) {
  let response = await fetch(SERVER__URL + `/api/students/` + id, {
    method: 'DELETE',
  })

  let data = await response.json()

  return data
}

let getServerData = await serverGet()

let workers = []

if (getServerData !== null) {
  for (const item of getServerData) {
    workers.push(new Worker(item.name, item.surname, item.lastname, new Date(item.birthday), Number(item.studyStart), item.faculty, item.id))
  }
}

const $workersList = document.getElementById('workersList'),
  $workersListThALL = document.querySelectorAll('workers__table th')

let column = 'fio',
  columnDir = true

// получить колонку
function newWorkerTR(worker) {
  const $workerTR = document.createElement('tr'),
    $fioTD = document.createElement('td'),
    $dataBirthTD = document.createElement('td'),
    $workStartTD = document.createElement('td'),
    $postTD = document.createElement('td'),
    $btnTD = document.createElement('td'),
    $btn = document.createElement('button')
  $btn.classList.add('button-remove')

  $workerTR.classList.add('table__th-second')
  $fioTD.textContent = worker.fio
  $dataBirthTD.textContent = worker.getBirthDayDataString() + ' ' + '(' + worker.getAge() + ')'
  $workStartTD.textContent = worker.getWorkPeriod()
  $postTD.textContent = worker.faculty
  $btn.textContent = 'Удалить'

  $btn.addEventListener('click', async function (elem) {
    elem.preventDefault()

    await serverRemove(worker.id)
    $workerTR.remove

    let arrayWorkers = [...workers]
    let newArrayWorkers = []

    for (const iterator of arrayWorkers) {
       if(iterator.id !== worker.id) newArrayWorkers.push(iterator)
    }

    console.log(newArrayWorkers)
    render(newArrayWorkers)
  })

  $workerTR.append($fioTD)
  $workerTR.append($dataBirthTD)
  $workerTR.append($postTD)
  $workerTR.append($workStartTD)
  $btnTD.append($btn)
  $workerTR.append($btnTD)

  return $workerTR
}

// получить сортировку массива по параметрам

function getSortWorkers(prop, dir) {
  const workersCopy = [...workers]

  return workersCopy.sort(function (workerA, workerB) {
    if ((!dir == false ? workerA[prop] < workerB[prop] : workerA[prop] > workerB[prop]))
      return -1
  })
}

// получить фильтрацию массива по параметрам

function filter(arr, prop, value) {
  let result = [],
    copyArray = [...arr]

  for (const iterator of copyArray) {
    if (String(iterator[prop]).includes(value) == true) result.push(iterator)
  }

  return result

}

// отрисовать

function render(renderArray) {
  renderArray = [...workers]

  renderArray = getSortWorkers('fio', columnDir)

  let inputFioFilter = document.getElementById('filter__InputOne').value,
    inputPostFilter = document.getElementById('filter__InputTwo').value,
    inputStartYearFilter = document.getElementById('filter__InputThree').value,
    inputlastYearFilter = document.getElementById('filter__InputFour').value
  // newArray = [...workers]

  if (inputPostFilter !== '') renderArray = filter(renderArray, 'faculty', inputPostFilter)

  if (inputFioFilter !== '') renderArray = filter(renderArray, 'fio', inputFioFilter)

  if (inputStartYearFilter !== '') renderArray = filter(renderArray, 'studyStart', inputStartYearFilter)

  if (inputlastYearFilter !== '') renderArray = filter(renderArray, 'last', inputlastYearFilter)

  $workersList.innerHTML = ''

  for (const workerOne of renderArray) {
    $workersList.append(newWorkerTR(workerOne))
  }
}

// событие сортировки

$workersListThALL.forEach(elem => {
  elem.addEventListener('click', function () {
    column = this.dataset.column;
    columnDir = !columnDir
    render()
  })
})

document.getElementById('filterForm').addEventListener('submit', function (event) {
  event.preventDefault()
  render()
})

// валидация

function validation(form) {

  function removeError(input) {
    const parent = input.parentNode

    if (parent.classList.contains('error')) {
      parent.querySelector('errorLabel').remove()
      parent.classList.remove('error')
    }
  }

  function createError(input, text) {
    const parent = input.parentNode
    const errorLabel = document.createElement('label')
    errorLabel.classList.add('errorLabel')
    errorLabel.textContent = text
    parent.classList.add('error')

    parent.append(errorLabel)
  }

  let result = true;

  const allInputs = form.querySelectorAll('input')

  for (const input of allInputs) {
    removeError(input)
    if (input.value == '') {
      createError(input, 'заполните все поля')
      result = false
    }
  }

  const starYearValidate = document.getElementById('inputWorkStart')
  if (starYearValidate.value !== '') {
    if (Number(starYearValidate.value) < 2000 || Number(starYearValidate.value) > new Date().getFullYear()) {
      createError(starYearValidate, 'диапазон соблюдайте пжлс')
      result = false
    }
  }

  const inputBirthDate = document.getElementById('inputBirthDate')
  if (inputBirthDate.value !== '') {
    if (inputBirthDate.valueAsDate < new Date(1900, 1, 1) || inputBirthDate.valueAsDate > new Date() || inputBirthDate.valueAsDate === null) {
      createError(inputBirthDate, 'диапазон соблюдайте пжлс')
      result = false
    }
  }


  return result
}

// добавляем студента через форму

document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault()

  if (validation(this) == true) {
    alert('валидация прошла успешно!')

    const newStudent = new Worker(
      document.getElementById('inputSurname').value,
      document.getElementById('inputName').value,
      document.getElementById('inputLastname').value,
      new Date(document.getElementById('inputBirthDate').value),
      Number(document.getElementById('inputWorkStart').value),
      document.getElementById('inputPost').value,
    )

    let serverData = await serverAdd(newStudent)
    workers.push(new Worker(serverData.name, serverData.surname, serverData.lastname, new Date(serverData.birthday), Number(serverData.studyStart), serverData.faculty))
    render()

  }

  const allInputs = form.querySelectorAll('input')
  for (const inputOne of allInputs) {
    inputOne.value = ''
  }

})

// рендерим
render()
