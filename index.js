const ID_LIST = {
    1: 'Chai',
    3: 'Syrup',
    4: 'Cajun Seasoning',
    5: 'Olive Oil',
    6: 'Boysenberry Spread',
    7: 'Dried Pears',
    8: 'Curry Sauce',
    14: 'Walnuts',
    17: 'Fruit Cocktail',
    19: 'Chocolate Biscuits Mix',
    20: 'Marmalade',
    21: 'Scones',
    34: 'Beer',
    40: 'Crab Meat',
    41: 'Clam Chowder',
    43: 'Coffee',
    48: 'Chocolate',
    51: 'Dried Apples',
    52: 'Long Grain Rice',
    56: 'Gnocchi',
    57: 'Ravioli',
    65: 'Hot Pepper Sauce',
    66: 'Tomato Sauce',
    72: 'Mozzarella',
    74: 'Almonds',
    77: 'Mustard',
    80: 'Dried Plums',
    81: 'Green Tea',
    82: 'Granola',
    83: 'Potato Chips',
    85: 'Brownie Mix',
    86: 'Cake Mix',
    87: 'Tea',
    88: 'Pears',
    89: 'Peaches',
    90: 'Pineapple',
    91: 'Cherry Pie Filling',
    92: 'Green Beans',
    93: 'Corn',
    94: 'Peas',
    95: 'Tuna Fish',
    96: 'Smoked Salmon',
    97: 'Hot Cereal',
    98: 'Vegetable Soup',
    99: 'Chicken Soup'
  };
  
  const queryList = (stringValue, maxLength = 0) => {
    const input = stringValue;
    let nameArray = [];
    if (input.length >= 1) {
      // name searching
      if (isNaN(input)) {
        for (let id in ID_LIST) {
          if (ID_LIST[id].toUpperCase().includes(input.toUpperCase())) {
            nameArray.push(id);
          }
          if (maxLength > 0 && nameArray.length >= maxLength) break;
        }
      // id searching
      } else {
        for (let id in ID_LIST) {
          if (id.includes(input)) {
            nameArray.push(id);
          }
          if (maxLength > 0 && nameArray.length >= maxLength) break;
        }
      }
    }
    return nameArray;
  };
  
  const refreshRecommended = () => {
    const stringValue = document.getElementById('maininput').value.trim();
    const nameArray = queryList(stringValue, 6);
    if (nameArray.length) {
      document.getElementById('recommended').innerHTML = '';
  
      if (document.getElementById('recommended').classList.contains('recommended-empty')) {
        document.getElementById('recommended').classList.remove('recommended-empty');
      }
      for (let id of nameArray) {
        const productName = ID_LIST[id];
        const newProductName = productName.toUpperCase().replace(stringValue.toUpperCase(), `<span class="selected-match">${stringValue.toUpperCase()}</span>`);
        document.getElementById('recommended').insertAdjacentHTML('beforeend',
          `<div data-value="${id}">
            <span class="reccommended-productName">${newProductName}</span>
            <span class="reccommended-ID">${id}</span>
          </div>`);
      }
    } else if (stringValue.length > 0) {
      document.getElementById('recommended').innerHTML = `<div><span style="margin: auto">nothing found :(</span></div>`;
    } else if (!document.getElementById('recommended').classList.contains('recommended-empty')) {
      document.getElementById('recommended').classList.add('recommended-empty');
    }
  };
  
  document.getElementById('maininput').addEventListener('input', e => {
    refreshRecommended();
  });
  
  document.getElementById('maininput').onblur = e => {
    if (!document.getElementById('mainContainer').classList.contains('lostFocus')) {
      document.getElementById('mainContainer').classList.add('lostFocus');
    }
  };
  document.getElementById('maininput').onfocus = e => {
    if (document.getElementById('mainContainer').classList.contains('lostFocus')) {
      document.getElementById('mainContainer').classList.remove('lostFocus');
    }
    refreshRecommended();
  
    document.getElementById('maininput').setSelectionRange(0, document.getElementById('maininput').value.length);
  };
  
  const displayResults = () => {
    const nameArray = queryList(document.getElementById('maininput').value.trim());
    if (nameArray.length) {
      const textInput = document.getElementById('mainContainer');
      const oldPosition = textInput.getBoundingClientRect().y;
  
      document.getElementById('maininput').blur();
      document.getElementById('results').innerHTML = '';
  
      for (let id of nameArray) {
        document.getElementById('results').insertAdjacentHTML('beforeend',
          `<div class="resultCard">
            <span class="resultCard-productName">${ID_LIST[id]}</span>
            <span class="resultCard-ID">${id}</span>
          </div>`);
      }
  
      textInput.style.position = 'relative';
      textInput.style.transform = 'none';
      textInput.style.transition = 'none';
      const newPosition = textInput.getBoundingClientRect().y;
  
      textInput.style.position = '';
      textInput.style.transform = `translateY(-50%) translateY(${textInput.difference}px)`;
  
      setTimeout(e => {
        let transitionTime = Math.abs(newPosition - oldPosition) / 750;
        transitionTime = transitionTime < 0.4 ? 0.4 : transitionTime;
  
        textInput.style.transition = `transform ${transitionTime}s ease, opacity .4s ease`;
        textInput.difference += newPosition - oldPosition;
        textInput.style.transform = `translateY(-50%) translateY(${textInput.difference}px)`;
        document.body.querySelector('#results div.resultCard:nth-child(1)').style.marginTop = '4em';
  
        for (let element of document.body.querySelectorAll('#results div.resultCard')) {
          element.style.animation = `enterIn .5s ease ${transitionTime}s backwards`;
          transitionTime += 0.025;
        }
      }, 0)
      ;
    }
  };
  
  document.querySelector("#mainContainer > form > div[data-button-action='submit']").addEventListener('click', e => {
    displayResults();
  });
  
  document.querySelector('#mainContainer > form').addEventListener('submit', e => {
    e.preventDefault();
    displayResults();
  });
  
  document.getElementById('mainContainer').difference = 0;
  
  document.body.addEventListener('mousedown', e => {
    if (e.target && e.target.closest('#recommended > div')) {
      const selectedOption = e.target.closest('#recommended > div');
      document.getElementById('maininput').value = selectedOption.dataset.value;
      displayResults();
    }
  });
  
  document.body.addEventListener('click', function (e) {
    if (e.target && e.target.closest('.resultCard')) {
      const wrapper = document.getElementById('wrapper');
  
      if (!wrapper.classList.contains('hasEnlarged')) {
        e.target.closest('.resultCard').classList.add('resultCard--enlarged');
  
        wrapper.classList.add('hasEnlarged');
      } else {
        document.body.querySelector('.resultCard.resultCard--enlarged').classList.remove('resultCard--enlarged');
        wrapper.classList.remove('hasEnlarged');
      }
    } else if (e.target && !e.target.closest('#goBackUp')) {
      const wrapper = document.getElementById('wrapper');
  
      if (wrapper.classList.contains('hasEnlarged')) {
        document.body.querySelector('.resultCard.resultCard--enlarged').classList.remove('resultCard--enlarged');
        wrapper.classList.remove('hasEnlarged');
      }
    }
  });
  
  document.addEventListener('scroll', function (e) {
    if (document.getElementById('goBackUp').classList.contains('goBackUp--hidden') && window.scrollY > window.innerHeight / 2) {
      document.getElementById('goBackUp').classList.remove('goBackUp--hidden');
    } else if (!document.getElementById('goBackUp').classList.contains('goBackUp--hidden') && window.scrollY <= window.innerHeight / 2) {
      document.getElementById('goBackUp').classList.add('goBackUp--hidden');
    }
  });
  
  document.body.addEventListener('click', function (e) {
    if (e.target && e.target.closest('#goBackUp:not(.goBackUp--hidden)')) {
      document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });