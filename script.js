//Нашу общую функцию нужно записать с маленькой буквы и вызывать без new потому что с new у нас либо конструктор, либо класс
//это не конструктор, потому что мы вызываем ее единожды (конструктор use для многократных вызовов с разными аргументами);
//это не класс, потому что мы не создаем публичные методы типа this.toggle = toggle;
function affairs(options) {
  const elem = options.elem;
  const input = document.getElementById('input');
  const paws = document.querySelector('.main__add');
  const catWithHeart = document.querySelector('.main__checkAll');
  const itemsContainer = document.querySelector('.itemsContainer');
  const footerContainer = document.querySelector('.footerContainer');
  const noteWithNumberOfUndoneDoings =
      document.querySelector('.footerContainer__content');

  //Для функции addToList
  let itemsArray = [];
  let  item, number, checkbox, label, removeButton;

  // Для функции catchClickOnButton (нужна для функции addFooter)
  let pressedButton;

  //Для функции reduceCounter
  let deletedItemPosition;

  //Для функции renameAttributes
  let ii;

  //Для onchange
  let numberOfUndoneDoings;

  //Для addToDoneDoings
  let doneDoings = [];

  //Для функции createElement
  let el;

  //Для функции addFooter
  let AllButton, ActiveButton, CompletedButton, ClearCompletedButton;
  let ButtonsOfFooter = [];

  // Для функции performButtonAction
  let listButton;

  elem.onclick = function(event) {
    if (event.target == input) {
      input.focus();
    }
    else if (event.target == paws && input.value !== '') {
      addToList();
      addFooter();
    } else if (event.target == catWithHeart) {
      markAllDoings();
    } else if (event.target.tagName == 'BUTTON') {
      catchClickOnButton(event.target);
    } else if (event.target.tagName !== 'INPUT') {
      console.log('тут нажатия ловиться не должны');
    }
  };

  elem.onkeyup = function(event) {
    if (event.keyCode == 13 && input.value != '') {
      addToList();
      addFooter();
    }
  };

  // Эта функция отвечает за чекбоксы
  elem.onchange = function(event) {
    //если есть галочка - убираем галочку
    if (event.target.hasAttribute('data-check')) {

      event.target.removeAttribute('data-check');
      removeFromDoneDoings(event.target.parentElement);
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML =
          'В планах у кота ' + numberOfUndoneDoings;
      updateCurrentList(pressedButton.getAttribute('data-name'));

    //поставили галочку
    } else if (event.target.hasAttribute('type') &&
        event.target.getAttribute('type') == 'checkbox') {

      event.target.setAttribute('data-check', 'checked');
      addToDoneDoings(event.target.parentElement);
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML =
          'В планах у кота ' + numberOfUndoneDoings;
      updateCurrentList(pressedButton.getAttribute('data-name'));
    }
  };

  // Функции добавления и удаления дел в/из коллекцию/и сделанных дел
  function addToDoneDoings(item) {
    doneDoings.push(item);
    return doneDoings;
  }

  function removeFromDoneDoings(item) {
    let index = doneDoings.indexOf(item);
    doneDoings.splice(index,1);
    return doneDoings;
  }

  // Функция обновляет список дел в зависимости от того, какая кнопка нажата
  function updateCurrentList(x) {
    if (!x) return;
    switch(x) {
      case 'All':
        showAllList;
        break;
      case 'Active':
        showActiveList();
        break;
      case 'Completed':
        showCompletedList();
        break;
    }
  }

  // Функция, сортирующая кнопки: ловит клики на разных кнопках и проделывает в
  // соответствии с кнопкой различные действия
  function catchClickOnButton(target) {
    // конпка удаления divа - правый крестик
    if (target.closest('.items__removeButtons')) {
      removeFromList(
          event.target.closest('.items__removeButtons').parentNode
      );
    }
    // кнопки снизу в футере
    if (target.closest('.footerContainer__Buttons')) {
      pressedButton = target;
      performButtonAction(pressedButton);
    }
  }

  // Функция, выполняющая действия кнопок футера
  function performButtonAction(pressedButton) {
    if (!pressedButton) return;
    if (pressedButton.getAttribute('data-name') == 'All') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showAllList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.getAttribute('data-name') == 'Active') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showActiveList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.getAttribute('data-name') == 'Completed') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showCompletedList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.getAttribute('data-name') == 'ClearCompleted') {
      deleteCompletedDoings();
      console.log(pressedButton.innerHTML);
    }
  }

  // Функции, создающие элемент, удаляющие элемент, задающие атрибут и
  // изменяющие иннер
  function createElement(pars) {
    el = document.createElement(pars.tag);
    el.className = pars.className;
    pars.parent.appendChild(el);
    if (pars.inner) {
      el.innerHTML = pars.inner;
    }
    return el;
  }

  // А тут была функция, которая мне очень нравилась, но нехороший Ярослав
  // сказал, что эта функция нехорошая, и мне пришлось ее удалить. Вот.
  // Я недовольна, поэтому на ее месте будет комментарий, полный недовольства.
  // Р...

  function setAttributes(el,obj) {
    for (let key in obj) {
      let name = key.toString();
      let value = obj[key];
      el.setAttribute(name, value);
    }
  }

  // Функция добавления пункта в лист заданий
  function addToList() {
    itemsContainer.classList.remove('hidden');

    item = createElement({
      tag: 'div',
      className: 'items',
      parent: itemsContainer,
    });
    itemsArray.push(item);
    number = (itemsArray.indexOf(item)) + 1;

    checkbox = createElement({
      tag: 'input',
      className: 'items__checkboxes',
      parent: item,
    });
    setAttributes(checkbox,{
      type: 'checkbox',
      name: 'doings',
      value: number,
      id: 'checkbox'+number
    });

    label = createElement({
      tag: 'label',
      className: 'items__labels',
      parent: item,
      inner: input.value
    });
    setAttributes(label,{for: 'checkbox'+number});

    removeButton = createElement({
      tag: 'button',
      className: 'items__removeButtons',
      parent: item,
      inner: 'x'
    });
    input.value = '';
  }

  function removeFromList(item){
    // стоит галочка
    if (doneDoings.indexOf(item) !== -1) {

      removeFromDoneDoings(item);
      removeDoingsFromItemsArray(item);
      item.remove();
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML =
          'В планах у кота ' + numberOfUndoneDoings;

      //  галочки нет
    } else {

      removeDoingsFromItemsArray(item);
      item.remove();
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML =
          'В планах у кота ' + numberOfUndoneDoings;
    }

    if (itemsContainer.childNodes.length === 0) {
      itemsContainer.classList.add('hidden');
      removeFooter();
    }
  }

  function removeDoingsFromItemsArray(deletedItem) {
    if (deletedItem == itemsContainer.lastElementChild ) {
      itemsArray.pop();
    } else {
      deletedItemPosition = itemsArray.indexOf(deletedItem);
      itemsArray.splice(deletedItemPosition,1);
      renameAttributes();
    }
  }

  function renameAttributes() {
    itemsArray.forEach(function(item, i) {
      ii = i + 1;
      item.children[0].setAttribute('value', '' + ii);
      item.children[0].setAttribute('id', 'checkbox' + ii);
      item.children[1].setAttribute('for', 'checkbox' + ii);
    });
  }

  // Функция подсчитывает число несделанных дел, отображающихся в футере
  function calculateNumberOfUndoneDoings() {
    numberOfUndoneDoings = itemsArray.length - doneDoings.length;
    return numberOfUndoneDoings;
  }

  //Функция создания футера (нижней части выпадающего списка)
  function addFooter() {
    if (!footerContainer.classList.contains('hidden')) {
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML =
          'В планах у кота ' + numberOfUndoneDoings;
      return;
    }

    footerContainer.classList.remove('hidden');
    calculateNumberOfUndoneDoings();
    noteWithNumberOfUndoneDoings.innerHTML =
        'В планах у кота ' + numberOfUndoneDoings;

    AllButton = footerContainer.children[1];
    ButtonsOfFooter.push(AllButton);
    pressedButton = AllButton;

    ActiveButton = footerContainer.children[2];
    ButtonsOfFooter.push(ActiveButton);

    CompletedButton = footerContainer.children[3];
    ButtonsOfFooter.push(CompletedButton);

    ClearCompletedButton = footerContainer.children[4];
    ButtonsOfFooter.push(ClearCompletedButton);
  }

  function removeFooter() {
    itemsContainer.classList.add('hidden');
    footerContainer.classList.add('hidden');
    doneDoings = [];
    itemsArray = [];
    numberOfUndoneDoings = 0;
  }

  // если кнопка не выделена, у других кнопок выделение удаляем, этой добавляем
  function buttonIllumination(button) {
    if (!button.classList.contains('footerContainer__Buttons_selected')) {
      ButtonsOfFooter.forEach(function(item, i, arr) {
        item.classList.remove('footerContainer__Buttons_selected');
      });
      button.classList.add('footerContainer__Buttons_selected');
    }
  }

  function showAllList() {
    itemsArray.forEach(function(item) {
      item.classList.remove('hidden');
    })
  }

  // чтобы показать несделанные дела, прячем все сделанные
  function showActiveList() {
    showAllList();
    doneDoings.forEach(function(item) {
      item.classList.add('hidden');
    })
  }

  function showCompletedList() {
    itemsArray.forEach(function(item) {
      if (doneDoings.indexOf(item) !== -1) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    })
  }

  function deleteCompletedDoings() {
    if (!doneDoings || doneDoings == []) return;

    doneDoings.forEach(function(item) {
      item.remove();
      removeDoingsFromItemsArray(item);
      doneDoings = [];
    });

    if (itemsArray.length == 0) {
      itemsContainer.classList.add('hidden');
      removeFooter();
    }
  }

  function markAllDoings() {
    //если  все дела с галочками  -  удалить все галочки
    if (doneDoings.length == itemsArray.length) {

      for (let n = 0; n < itemsArray.length; n++) {
        checkbox = itemsArray[n].firstElementChild;
        checkbox.checked = false;
        checkbox.removeAttribute('data-check');
        removeFromDoneDoings(checkbox.parentElement);
        calculateNumberOfUndoneDoings();
        noteWithNumberOfUndoneDoings.innerHTML =
            'В планах у кота ' + numberOfUndoneDoings;
        updateCurrentList(pressedButton.getAttribute('data-name'));
      }
      //если галочек нет или не все дела с галочками  -  добавить везде галочки
    } else {
      for (let n = 0; n < itemsArray.length; n++) {
        checkbox = itemsArray[n].firstElementChild;

        if (!checkbox.hasAttribute('data-check')) {
          checkbox.checked = true;
          checkbox.setAttribute('data-check', 'checked');
          addToDoneDoings(checkbox.parentElement);
          calculateNumberOfUndoneDoings();
          noteWithNumberOfUndoneDoings.innerHTML =
              'В планах у кота ' + numberOfUndoneDoings;
          updateCurrentList(pressedButton.getAttribute('data-name'));
        }
      }
    }
  }
}

window.onload = function(){affairs({
  elem: document.querySelector('.main')
});
};
