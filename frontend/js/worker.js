export default class Worker {

  // конструктор класса (функция)
  constructor(name, surname, lastname, birthday, studyStart, faculty, id) {
    this.name = name
    this.surname = surname
    this.lastname = lastname
    this.birthday = birthday
    this.studyStart = studyStart
    this.faculty = faculty
    this.id = id
  }

  // геттер для fio

  get fio() {
    return this.surname + ' ' + this.name + ' ' + this.lastname
  }

  set __faculty(value) {
    return this.faculty = value
  }

  get __faculty() {
    return this.faculty
  }

  get start() {
    this.studyStart = this.studyStart
  }

  // метод класса для получения периода работы

  getWorkPeriod() {
    let currentTime = new Date()
    let year = currentTime.getFullYear()
    let periodFourYear = this.studyStart + 4

    let thisPeriod = this.studyStart + '-' + periodFourYear

   if(periodFourYear <= year) {
    thisPeriod = this.studyStart + '-' + periodFourYear + ' ' + '(закончил)'
   }

    return  thisPeriod
  }

  // метод класса для получения даты рождения

  getBirthDayDataString() {
    const yyyy = this.birthday.getFullYear();
    let mm = this.birthday.getMonth() + 1;
    let dd = this.birthday.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
  }

  // метод класса для получения возраста

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthday.getFullYear();
    let m = today.getMonth() - this.birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthday.getDate())) {
      age--
    }

    return age
  }
}



