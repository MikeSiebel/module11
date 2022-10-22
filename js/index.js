// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// функция реализующая введение в input только числа
const channHandler = e => {
  const value = e.value
  e.value = value.replace(/\D/g,'')
}

// массив цветов (ключи соответсвуют классам)
const classArray = [{
  "fruit_violet": "фиолетовый",
  "fruit_green": "зеленый",
  "fruit_carmazin": "розово-красный",
  "fruit_yellow": "желтый",
  "fruit_lightbrown": "светло-коричневый",
  "fruit_black": "черный",
  "fruit_orange": "оранжевый",
  "fruit_red": "красный"
}];

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

// /*** ОТОБРАЖЕНИЕ ***/
//функция поиска ключа по значению (нужна для заливки соответсвующим цветом рамку элемента)
Object.prototype.getKeyByValue = function (value, objs) {

  // защита от циклических ссылок
  if (!objs)
    objs = [];

  for (var prop in this) {
    if (this.hasOwnProperty(prop)) {
      if (this[prop] === value) {
        return prop;
      } else if (typeof this[prop] === "object" && objs.indexOf(this[prop]) == -1) {
        objs.push(this[prop]);
        var res = this[prop].getKeyByValue(value, objs);
        if (res)
          return res;

      }

    }
  }
}

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  while (fruitsList.firstChild) fruitsList.removeChild(fruitsList.firstChild);


  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    const valArr = fruits[i].color;
    let li = document.createElement('li');
    li.className = 'fruit__item ' + classArray.getKeyByValue(valArr);
    // li_1.innerHTML = 'Первый элемент';
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    fruitsList.appendChild(li);
    let div = document.createElement('div');
    div.className = 'fruit__info';
    li.appendChild(div);
    let div_1 = document.createElement('div');
    let index = 'index: ' + i;
    div_1.appendChild(document.createTextNode(index));
    div.appendChild(div_1);
    let div_2 = document.createElement('div');
    div_2.appendChild(document.createTextNode('kind: ' + fruits[i].kind));
    div.appendChild(div_2);
    let div_3 = document.createElement('div');
    div_3.appendChild(document.createTextNode('color: ' + fruits[i].color));
    div.appendChild(div_3);
    let div_4 = document.createElement('div');
    div_4.appendChild(document.createTextNode('weight: ' + fruits[i].weight));
    div.appendChild(div_4);


  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    // функция перемешивания массива
    // находим случайный элемент из fruits, используя getRandomInt
    let r = getRandomInt(0, fruits.length - 1);
    let elem = fruits.splice(r, 1)[0];
    result.push(elem);
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
  }
  if (JSON.stringify(fruits) === JSON.stringify(result)) {
    alert('Порядок элементов не изменился!')
  } else {
    fruits = result;
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  //fruits = JSON.parse(fruitsJSON);
  let result = [];
  let minWeight = document.getElementById('minValue').value;
  let maxWeight = document.getElementById('maxValue').value;
  if ((minWeight === '') || (maxWeight === '')) {
    alert('Одно или несколько полей незаполнены.')
  
  } else {
  result = fruits.filter((item) => {
    if ((item.weight >= minWeight) && (item.weight <= maxWeight)) {
      return true;
    } else {
      return false;
    }
  });
  fruits = result;
}
}

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки



const comparationColor = (a, b) => {
  // функция сравнения двух элементов по цвету
  if (a.color === b.color) {
    return 0;
  }
  return a.color < b.color ? -1 : 1;
};
//Функция обмена элементов
function swap(fruits, firstIndex, secondIndex) {
  const temp = fruits[firstIndex];
  fruits[firstIndex] = fruits[secondIndex];
  fruits[secondIndex] = temp;
};
//функция разделитель
function partition(fruits, left, right) {
  var pivot = fruits[Math.floor((right + left) / 2)],
    i = left,
    j = right;
  while (i <= j) {
    while (fruits[i] < pivot) {
      i++;
    }
    while (fruits[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(fruits, i, j);
      i++;
      j--;
    }
  }
  return i;
};
//Функция с алгоритмом быстрой сортировки
function quickSort(fruits, left, right) {
  var index;
  if (parseInt(fruits.length) > 1) {
    left = typeof left != "number" ? 0 : left;
    right = typeof right != "number" ? fruits.length - 1 : right;
    index = partition(fruits, left, right);
    if (left < index - 1) {
      quickSort(fruits, left, index - 1);
    }
    if (index < right) {
      quickSort(fruits, index, right);
    }
  }
  return fruits;

};
const sortAPI = {
  bubbleSort(fruits, comparation = comparationColor) {
    // функция сортировки пузырьком
    const n = fruits.length;
    for (let i = 0; i < n - 1; i++) {
      // внутренняя итерация для перестановки элемента в конец массива
      for (let j = 0; j < n - 1 - i; j++) {
        // сравниваем элементы
        if (comparation(fruits[j], fruits[j + 1]) === 1) {
          // делаем обмен элементов
          let temp = fruits[j + 1];
          fruits[j + 1] = fruits[j];
          fruits[j] = temp;
        }
      }
    }

  },


  // функция выполняет сортировку и производит замер времени
  startSort(sort, fruits, comparation) {
    const start = new Date().getTime();
    sort(fruits, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // переключает значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // выводит в sortTimeLabel значение 'sorting...'
  if (sortKind === 'bubbleSort') {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    console.log(sortKind);
    display();
    // выводит в sortTimeLabel значение sortTime
    sortTimeLabel.textContent = sortTime;
  } else {
    sortTimeLabel.textContent = 'sorting...';
    quickSort(fruits, 0, fruits.length - 1);
    sortTimeLabel.textContent = sortTime;
    console.log(sortKind);
    display();
  }
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if ((kindInput.value === '') || (weightInput.value === '') || (colorInput.value === '')) {
    alert('Не заполнено одно из полей')
  } else {
    fruits.push({
      "kind": kindInput.value,
      "color": colorInput.value,
      "weight": weightInput.value
    })
    display();
  }
});