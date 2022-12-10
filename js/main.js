const loaderContainer = document.getElementById('loader-container')
const overlay = document.getElementById('overlay')
const selectCity = document.getElementById('select_city')
const cardCity = document.getElementById('city-card')
const ccbSelectCity = document.getElementById('ccb-select-city')
const ccbTags = document.getElementById('ccb-tags')
const cardCityBtn = document.getElementById('card-city-btn')
const inputSearchCity = document.getElementById('input-search-city')
const ccbInputImg = document.getElementById('ccb-input-img')
const areas = document.getElementById('ccb-select-city')

var arrowCountry = []
var sendArrowCountry = []
var arrowTags = []
var newArrowTags = []
var loaderCity = false
var arrowCity
var tagsItem
var textInput = []

const apiCountry = async () => {
  console.log('func api')
  const URL = 'https://studika.ru/api/areas'
  /* const URL = 'https://api.hh.ru/areas/113' */
  await fetch(URL, {
    method: 'POST',
  })
    .then((response) => {
      if (response.status !== 200) {
        console.log('Проблема загрузки городов. Статус: ' + response.status)
        return
      }
      response.json().then((data) => {
        var arrowData = data
        arrowCountry = arrowData
        sendArrowCountry = arrowData
      })
    })
    .catch((e) => {
      console.log('e', e)
    })
}

const clicks = () => {
  console.log('func click')
  selectCity.addEventListener('click', () => {
    cardCity.style.display = 'flex'
    overlay.style.display = 'block'
    eachInner()
  })
  overlay.addEventListener('click', () => {
    cardCity.style.display = 'none'
    overlay.style.display = 'none'
  })
  cardCityBtn.addEventListener('click', (e) => {
    arrowTags.forEach((t) => {
      sendArrowCountry.filter((e) => {
        if (e.name == t) {
          newArrowTags.push(e)
        }
      })
      document.cookie += `city=${JSON.stringify(newArrowTags)}`
      console.log(document.cookie)
      return
    })
    cardCity.style.display = 'none'
    overlay.style.display = 'none'
  })
  inputSearchCity.addEventListener('click', (e) => {
    ccbInputImg.style.display = 'block'
    inputSearchCity.oninput = async (e) => {
      textInput = e.target.value
      arrowCountry = arrowCountry.filter((s) => {
        if (s.name.toLowerCase().includes(textInput.toLowerCase())) {
          return s.name
        }
      })
      areas.innerHTML = ''
      arrowCountry.forEach((e) => {
        areas.innerHTML += `
                      <div id="arrow-city" class="arrow-city">
                     ${e.name}
                       </div>`
        arrowCity = document.querySelectorAll('#arrow-city')
      })
      startApp()
      await apiCountry()
    }
  })

  ccbInputImg.addEventListener('click', async (e) => {
    inputSearchCity.value = ''
    areas.innerHTML = ''
    arrowCountry.forEach((e) => {
      areas.innerHTML += `
                    <div id="arrow-city" class="arrow-city">
                   ${e.name}
                     </div>`
      arrowCity = document.querySelectorAll('#arrow-city')
    })
    startApp()
    await apiCountry()
    console.log('text input close', inputSearchCity.value)
  })
}

const eachInner = () => {
  console.log('func eachInner')
  try {
    console.log('areas', areas.children.length)

    const req = () => {
      console.log('start')
      if (areas.children.length <= 0) {
        arrowCountry.forEach((e) => {
          areas.innerHTML += `
                                <div id="arrow-city" class="arrow-city">
                               ${e.name}
                                 </div>`
          arrowCity = document.querySelectorAll('#arrow-city')
          loaderCity = true
        })
        startApp()
      }
    }

    if (!loaderCity) {
      loaderContainer.style.display = 'flex'
      ccbSelectCity.style.display = 'none'
      setTimeout(() => {
        req()
        loaderContainer.style.display = 'none'
        ccbSelectCity.style.display = 'block'
      }, 500)
    } else {
      req()
    }
  } catch (e) {
    console.log('e', e)
  }
}

const clickSetCity = () => {
  console.log('func SetCity')
  arrowCity.forEach((item) => {
    item.addEventListener('click', (e) => {
      let itemTag = e.target.childNodes[0].data.trim()
      let test = arrowTags.includes(itemTag)
      if (!test) {
        arrowTags.push(itemTag)
        console.log('Добавил тег', arrowTags.length)
      } else {
        arrowTags = arrowTags.filter((e) => {
          return e !== itemTag
        })
        console.log('удалил тег', arrowTags.length)
      }
      tagsInner()
    })
  })
}

const tagsInner = () => {
  try {
    console.log('func tagsInner')
    ccbTags.innerHTML = ''
    console.log('массив тегов', arrowTags)
    arrowTags.forEach((e) => {
      ccbTags.innerHTML += `
          <div id="tags-item" class="tags-item">
                    <span class="tags-item-span">${e}</span>
                    <img class="tags-item-img" src="/img/close.svg" alt="" />
                  </div>  `
    })
    if (arrowTags.length >= 1) {
      cardCityBtn.children[0].disabled = false
    } else if (arrowTags.length <= 0) {
      cardCityBtn.children[0].disabled = true
    }
    clickRemoveTags()
  } catch (e) {
    console.log('e', e)
  }
}

const clickRemoveTags = () => {
  tagsItem = document.querySelectorAll('#tags-item')
  tagsItem.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.localName === 'img') {
        const i = e.target.nextSibling.parentElement.children[0].innerText
        arrowTags = arrowTags.filter((g) => {
          return g.trim() !== i.trim()
        })
        tagsInner()
      } else if (e.target.localName === 'span') {
        item.style.background = 'wheat'
      }
    })
  })
}

const startApp = async () => {
  console.log('func startApp')
  if (arrowCountry.length <= 0) {
    await apiCountry()
  }
  if (loaderCity) {
    clickSetCity()
  }
}

startApp()
clicks()
