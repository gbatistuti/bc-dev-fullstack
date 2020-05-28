let total = 0, male = 0, fem = 0, sumAge = 0, avgAge = 0
let users = []

async function start() {

  await getUsers()
  showUsers(users)
  refreshData(users)
  statisticsBox(users.length, male, fem, sumAge, avgAge)

  const inputElement = document.querySelector('#searchInput')
  const searchButton = document.querySelector('#searchButton')

  inputElement.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      searchButton.click()
    }
  })

  searchButton.addEventListener('click', () => {
    const filteredUsers = filter(inputElement.value)
    refreshData(filteredUsers)
    showUsers(filteredUsers)
    statisticsBox(filteredUsers.length, male, fem, sumAge, avgAge)
  })
}

function refreshData(array) {
  total = 0, male = 0, fem = 0, sumAge = 0, avgAge = 0

  array.map((el, index) => {
    if (el.gender === "female") fem++
    if (el.gender === "male") male++
    sumAge += el.age
    avgAge = (sumAge / (index + 1)).toFixed(2).replace('.', ',')
  })
}

async function getUsers() {
  const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
  const toJson = await response.json()

  users = toJson.results.map(({ name: { first, last }, picture: { thumbnail }, dob: { age }, gender }) => {
    return {
      name: `${first} ${last}`,
      thumbnail,
      age,
      gender
    }
  })
}

function statisticsBox(total, male, female, sumAge, avgAge) {
  const totalElement = document.querySelector('#total')
  totalElement.innerHTML = total

  const maleElement = document.querySelector('#male')
  maleElement.innerHTML = male

  const femaleElement = document.querySelector('#female')
  femaleElement.innerHTML = female

  const sumElement = document.querySelector('#sum')
  sumElement.innerHTML = sumAge

  const avgElement = document.querySelector('#avg')
  avgElement.innerHTML = avgAge
}

function filter(texto) {
  return users.filter(el => {
    const { name } = el
    return name.toLowerCase().includes(texto.toLowerCase())
  })
}

function showUsers(users) {
  const usersDiv = document.querySelector("#users")

  const sortedUsers = users.sort((a, b) => {
    return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0)
  })

  const usersList = sortedUsers.map(({ name, age, thumbnail }) => {
    return `
    <div>
      <img src=${thumbnail} alt="avatar">
      ${name}, ${age}
    </div>
    `
  })

  usersDiv.innerHTML = usersList.sort().join('')
}

start()
