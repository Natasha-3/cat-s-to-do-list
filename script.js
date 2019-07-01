
function Affairs(options) {
  const elem = options.elem;
  const input = document.getElementById('input');
  const placeholder = document.querySelector('.list__main__placeholder');
  const paws = document.querySelector('.list__main__add');
  const catWithHeart = document.querySelector('.list__main__checkAll');

  //Для функции addToList
  let itemsArray = [];
  let itemsContainer, item, number, checkbox, label, removeButton;

  // Для функции catchClickOnButton (нужна для функции addFooter)
  let pressedButton;

  //Для функции reduceCounter
  let deletedItemPosition;

  //Для функции renameAttributes
  let ii;

  //Для onchange
  let numberOfUndoneDoings;

  //Для addDoings
  let collectionOfDoneDoings = [];

  //Для функции addFooter
  let footerContainer, noteWithNumberOfUndoneDoings, AllButton, ActiveButton,
      CompletedButton, ClearCompletedButton;
  let ButtonsOfFooter = [];

  // Для функции performButtonAction
  let listButton;

  elem.onclick = function(event) {
    if (event.target == placeholder || event.target == input) {
      input.focus();
    } else if (event.target == paws && input.value !=='') {
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
    if (event.keyCode == 13 && input.value !='') {
      addToList();
      addFooter();
    }
  };

  input.onfocus = function() {
    placeholder.style.display = 'none';
  };

  //при снятии фокуса, если в строке ничего не введено, будет Кошачьи дела
  input.onblur = function() {
    if(input.value =='') {
      placeholder.style.display = 'block';
    }
  };

  // Эта функция отвечает за чекбоксы
  elem.onchange = function(event) {

    //если есть галочка - убираем галочку
    if (event.target.hasAttribute('data-check')) {

      event.target.removeAttribute('data-check');
      removeDoingsFromCollectionOfDoneDoings(event.target.parentElement);
      calculateNumberOfUndoneDoings();
      changeInner(noteWithNumberOfUndoneDoings,
          'В планах у кота ' + numberOfUndoneDoings);
      updateCurrentList(pressedButton.innerHTML);

    //поставили галочку
    } else if (event.target.hasAttribute('type') &&
        event.target.getAttribute('type') == 'checkbox') {

      event.target.setAttribute('data-check', 'checked');
      addDoingsToCollectionOfDoneDoings(event.target.parentElement);
      calculateNumberOfUndoneDoings();
      changeInner(noteWithNumberOfUndoneDoings,
          'В планах у кота ' + numberOfUndoneDoings);
      updateCurrentList(pressedButton.innerHTML);
    }
  };

  // Функции добавления и удаления дел в/из коллекцию/и сделанных дел
  function addDoingsToCollectionOfDoneDoings(item) {
    collectionOfDoneDoings.push(item);
    return collectionOfDoneDoings;
  }

  function removeDoingsFromCollectionOfDoneDoings(item) {
    let index = collectionOfDoneDoings.indexOf(item);
    collectionOfDoneDoings.splice(index,1);
    return collectionOfDoneDoings;
  }

  // Функция обновляет список дел в зависимости от того, какая кнопка нажата
  function updateCurrentList(x) {
    if (!x) return;
    switch(x) {
      case 'All':
        showAllList();
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
    if (target.closest('.list__main__itemsContainer__items__removeButtons')) {
      RemoveFromList(event.target.closest
      ('.list__main__itemsContainer__items__removeButtons').parentNode);
    }
    // кнопки снизу в футере
    if (target.closest('.list__main__footerContainer__Buttons')) {
      pressedButton = target;
      performButtonAction(pressedButton);
    }
  }

  // Функция, выполняющая действия кнопок футера
  function performButtonAction(pressedButton) {
    if (!pressedButton) return;
    if (pressedButton.innerHTML == 'All') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showAllList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.innerHTML == 'Active') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showActiveList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.innerHTML == 'Completed') {
      listButton = pressedButton;
      buttonIllumination(pressedButton);
      showCompletedList();
      console.log(pressedButton.innerHTML);
    }
    if (pressedButton.innerHTML == 'Clear Completed') {
      deleteCompletedDoings();
      console.log(pressedButton.innerHTML);
    }
  }

  // Функции, создающие элемент, удаляющие элемент, задающие атрибут и
  // изменяющие иннер
  function createElement(variable, tag ,addedClass, parent, inner) {
    variable = document.createElement(tag);
    variable.className = addedClass;
    parent.appendChild(variable);
    if (inner) {variable.innerHTML = inner;}
    return variable;
  }

  // Эта функция нужна для того, чтобы
  // во-первых, упростить понимание работы функций, куда я ее включаю;
  // во-вторых, для улучшения моей ориентации в коде.
  // Поэтому она будет здесь присутствовать ^_^ мяу
  function removeElement(el) {
    el.remove();
  }

  function setAttributes(el,obj) {
    for (let key in obj) {
      let name = key.toString();
      let value = obj[key];
      el.setAttribute(name, value);
    }
  }

  function changeInner(variable, inner) {
    variable.innerHTML = inner;
  }

  // Функция добавления пункта в лист заданий
  function addToList() {
    if (!elem.querySelector('.list__main__itemsContainer')) {
      itemsContainer = createElement(itemsContainer, 'div',
          'list__main__itemsContainer', elem);
    }

    item = createElement(item, 'div', 'list__main__itemsContainer__items',
        itemsContainer);
    itemsArray.push(item);
    number = (itemsArray.indexOf(item)) + 1;

    checkbox = createElement(checkbox, 'input',
        'list__main__itemsContainer__items__checkboxes', item);
    setAttributes(checkbox,{
      type: 'checkbox',
      name: 'doings',
      value: number,
      id: 'checkbox'+number
    });

    label = createElement(label, 'label',
        'list__main__itemsContainer__items__labels', item, input.value);
    setAttributes(label,{for: 'checkbox'+number});

    removeButton = createElement(removeButton, 'button',
        'list__main__itemsContainer__items__removeButtons', item, 'x');
    input.value = '';
  }


  function RemoveFromList(item){

    // стоит галочка
    if (findSmthInArray(collectionOfDoneDoings,item)) {

      removeDoingsFromCollectionOfDoneDoings(item);
      removeDoingsFromItemsArray(item);
      removeElement(item);
      calculateNumberOfUndoneDoings();
      changeInner(noteWithNumberOfUndoneDoings, 'В планах у кота '
          + numberOfUndoneDoings);

      //  галочки нет
    } else {

      removeDoingsFromItemsArray(item);
      removeElement(item);
      calculateNumberOfUndoneDoings();
      changeInner(noteWithNumberOfUndoneDoings, 'В планах у кота '
          + numberOfUndoneDoings);
    }

    if (itemsContainer.childNodes.length === 0) {
      removeFooter();
    }
  }

  // Функция находит что-то искомое в массиве
  function findSmthInArray(arr,smth) {
    var i = arr.length;
    while (i--) {
      if (arr[i] == smth) {
        return true;
      }
    }
    return false;
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
    numberOfUndoneDoings = itemsArray.length - collectionOfDoneDoings.length;
    return numberOfUndoneDoings;
  }

  //Функция создания футера (нижней части выпадающего списка)
  function addFooter() {

    if (elem.contains(footerContainer)) {
      calculateNumberOfUndoneDoings();
      noteWithNumberOfUndoneDoings.innerHTML = 'В планах у кота '
          + numberOfUndoneDoings;
      return;
    }

    footerContainer = createElement(footerContainer, 'div',
        'list__main__footerContainer', elem);
    calculateNumberOfUndoneDoings();
    noteWithNumberOfUndoneDoings = createElement(noteWithNumberOfUndoneDoings,
        'p', 'list__main__footerContainer__content',
        footerContainer, 'В планах у кота '+ numberOfUndoneDoings);

    AllButton = createElement(AllButton, 'button',
        'list__main__footerContainer__Buttons', footerContainer, 'All');
    ButtonsOfFooter.push(AllButton);
    addColorButtonSelection(AllButton);
    pressedButton = AllButton;

    ActiveButton = createElement(ActiveButton, 'button',
        'list__main__footerContainer__Buttons', footerContainer, 'Active');
    ButtonsOfFooter.push(ActiveButton);

    CompletedButton = createElement(CompletedButton, 'button',
        'list__main__footerContainer__Buttons', footerContainer, 'Completed');
    ButtonsOfFooter.push(CompletedButton);

    ClearCompletedButton = createElement(ClearCompletedButton, 'button',
        'list__main__footerContainer__Buttons', footerContainer,
        'Clear Completed');
    ButtonsOfFooter.push(ClearCompletedButton);
  }

  function removeFooter() {
    removeElement(itemsContainer);
    removeElement(footerContainer);
    collectionOfDoneDoings = [];
    itemsArray = [];
    numberOfUndoneDoings = 0;
  }

  function addColorButtonSelection(button) {
    button.classList.add('selectedButton');
  }

  function removeColorButtonSelection(button) {
    button.classList.remove('selectedButton');
  }

  // если кнопка не выделена, у других кнопок выделение удаляем, этой добавляем
  function buttonIllumination(button) {
    if (!button.classList.contains('selectedButton')) {
      ButtonsOfFooter.forEach(function(item, i, arr) {
        removeColorButtonSelection(item);
      });
      addColorButtonSelection(button);
    }
  }

  function showAllList() {
    itemsArray.forEach(function(item, i, arr) {
      show(item);
    })
  }

  // чтобы показать несделанные дела, прячем все сделанные
  function showActiveList() {
    showAllList();
    collectionOfDoneDoings.forEach(function(item, i, arr) {
      hide(item);
    })
  }

  function showCompletedList() {
    itemsArray.forEach(function(item, i, arr) {
      if (findSmthInArray(collectionOfDoneDoings,item)) {
        show(item);
      } else {
        hide(item);
      }
    })
  }

  function deleteCompletedDoings() {

    if (!collectionOfDoneDoings || collectionOfDoneDoings == []) return;

    collectionOfDoneDoings.forEach(function(item, i, arr) {
      removeElement(item);
      removeDoingsFromItemsArray(item);
      collectionOfDoneDoings = [];
    });

    if (itemsArray.length ==0) {
      removeFooter();
    }
  }

  // Функции: 1-я скрывает дело (в массиве itemsArray  оно остается),
  // 2-я показывает скрытое дело
  function hide(item) {
    item.classList.add('hidden');
  }

  function show(item) {
    item.classList.remove('hidden');
  }

  function markAllDoings() {
    //если  все дела с галочками  -  удалить все галочки
    if (collectionOfDoneDoings.length == itemsArray.length) {

      for (let n = 0; n < itemsArray.length; n++) {
        checkbox = itemsArray[n].firstElementChild;
        checkbox.checked = false;
        checkbox.removeAttribute('data-check');
        removeDoingsFromCollectionOfDoneDoings(checkbox.parentElement);
        calculateNumberOfUndoneDoings();
        changeInner(noteWithNumberOfUndoneDoings, 'В планах у кота '
            + numberOfUndoneDoings);
        updateCurrentList(pressedButton.innerHTML);
      }
      //если галочек нет или не все дела с галочками  -  добавить везде галочки
    } else {

      for (let n = 0; n < itemsArray.length; n++) {
        checkbox = itemsArray[n].firstElementChild;

        if (!checkbox.hasAttribute('data-check')) {
          checkbox.checked = true;
          checkbox.setAttribute('data-check', 'checked');
          addDoingsToCollectionOfDoneDoings(checkbox.parentElement);
          calculateNumberOfUndoneDoings();
          changeInner(noteWithNumberOfUndoneDoings, 'В планах у кота '
              + numberOfUndoneDoings);
          updateCurrentList(pressedButton.innerHTML);
        }
      }
    }
  }

}

let affairs = new Affairs ({
  elem: document.querySelector('.list__main')
});