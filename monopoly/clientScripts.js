var id,                     //Id получает с сервера
    data = {},              // данные с сервера
    currentIcon = document.createElement('div'), //выбранная иконка
    opponents = {},
    escapeFromPrison = false,               //обычный ход
    prisonEscapeCounter = 3,        //сбежать за три хода
    lastId,                         //id последнего бросавшего
    auctionForm = document.forms.auction,
    auctionValue = auctionForm.elements.mainvalue,
    auctionObject = {},
    plusOneButton = document.getElementById('plusone'),
    plusFiveButton = document.getElementById('plusfive'),
    plusTenButton = document.getElementById('plusten'),
    plusFiftyButton = document.getElementById('plusfifty'),
    savedTurn,                  //запоминает перед аукционом чей был ход, id
    auctionTimer,                   //таймер до прекращения аукциона
    info = document.querySelector('.info'),
    houseSrc,               //стиль для домиков
    hotelSrc,               //стиль для отелей
    chooseHomes = document.querySelector('.choose-homes'),
    building = document.forms.building,
    freeCommunityCard = document.querySelector('.free-cards .community-free'),
    freeChanceCard = document.querySelector('.free-cards .chance-free'),
    showCard = document.querySelector('.show-card');

auctionForm.style.visibility = 'hidden';
chooseHomes.style.visibility = 'hidden';
building.style.visibility = 'hidden';
freeCommunityCard.style.visibility = 'hidden';
freeChanceCard.style.visibility = 'hidden';
showCard.hidden = true;

var centerField = document.querySelector('.center');

//Звуки бросания костей
var throwingSound = [{start: 0  , duration: 1200},
  {start: 2.2 , duration: 1200},
  {start: 3.6 , duration: 1200},
{start: 5.6, duration: 1200}];

var shakingSound = [ {start: 0 , duration:1100 },			//годятся все
{start: 1.6 , duration: 1100},
{start: 8.1 , duration: 1000},
{start:  11.1, duration: 1000},
{start: 13.7 , duration:1200 },
{start: 21.8, duration: 1000},
{start:  24.4, duration: 1200}];

//Карточки "ШАНС"
var chance = ['ОТПРАВЛЯЙСЯ НА УЛ. АРБАТ.',
              'ВЕРНИСЬ НА ТРИ ПОЛЯ НАЗАД.',
             'ИДИ НА ПОЛЕ ВПЕРЁД. (ПОЛУЧИ $200)',
            'ТЫ АРЕСТОВАН! ОТПРАВЛЯЙСЯ СРАЗУ В ТЮРЬМУ! ТЫ НЕ ПРОХОДИШЬ ПОЛЕ ВПЕРЁД И НЕ ПОЛУЧАЕШЬ $200.',
            'ТЕБЯ ИЗБРАЛИ ПРЕДСЕДАТЕЛЕМ СОВЕТА ДИРЕКТОРОВ. ЗАПЛАТИ КАЖДОМУ ИГРОКУ ПО $50.',
            'ОТПРАВЛЯЙСЯ НА БЛИЖАЙШЕЕ КОММУНАЛЬНОЕ ПРЕДПРИЯТИЕ. Если оно НИКОМУ НЕ ПРИНАДЛЕЖИТ, можешь заплатить в Банк и купить его. Если оно ЯВЛЯЕТСЯ СОБСТВЕННОСТЬЮ ДРУГОГО ИГРОКА, бросай кубики и заплати владельцу ренту, равную сумме выпавших очков, умноженных на 10.',
            'ССУДА НА СТРОИТЕЛЬСТВО. ПОЛУЧИ $150',
            'ОТПРАВЛЯЙСЯ НА БЛИЖАЙШУЮ СТАНЦИЮ. Если она НИКОМУ НЕ ПРИНАДЛЕЖИТ, можешь заплатить в банк и купить её. Если она ЯВЛЯЕТСЯ СОБСТВЕННОСТЬЮ ДРУГОГО ИГРОКА, заплати владельцу ренту в два раза больше обычной',
            'БАНК ВЫПЛАЧИВАЕТ ТЕБЕ ДИВИДЕНТЫ В РАЗМЕРЕ $50.',
            'КАПИТАЛЬНЫЙ РЕМОНТ ВСЕЙ ТВОЕЙ СОБСТВЕННОСТИ. ЗАПЛАТИ $25 ЗА КАЖДЫЙ ДОМ И $100 ЗА КАЖДЫЙ ОТЕЛЬ.',
            'ОТПРАВЛЯЙСЯ НА ПЛОЩАДЬ МАЯКОВСКОГО. ЕСЛИ ТЫ ПРОХОДИШЬ ПОЛЕ ВПЕРЁД, ПОЛУЧИ $200.',
            'ОТПРАВЛЯЙСЯ НА БЛИЖАЙШУЮ СТАНЦИЮ. Если она НИКОМУ НЕ ПРИНАДЛЕЖИТ, можешь заплатить в банк и купить её. Если она ЯВЛЯЕТСЯ СОБСТВЕННОСТЬЮ ДРУГОГО ИГРОКА, заплати владельцу ренту в два раза больше обычной',
            'ПРОКАТИСЬ ПО РИЖСКОЙ ЖЕЛЕЗНОЙ ДОРОГЕ. ПОЛУЧИ $200 ЕСЛИ ПРОХОДИШЬ ПОЛЕ ВПЕРЁД.',
            'ШТРАФ ЗА ПРЕВЫШЕНИЕ СКОРОСТИ $15.',
            'ОТПРАВЛЯЙСЯ НА УЛ. ПОЛЯНКА. ПОЛУЧИ $200, ЕСЛИ ПРОХОДИШЬ ПОЛЕ ВПЕРЁД.',
            'ВЫЙТИ ИЗ ТЮРЬМЫ БЕСПЛАТНО. Эту карточку можно сохранить на будущее или обменять'];
//Карточки "Общественная казна"
var community = ['ПОЛУЧИ $25 ЗА КОНСУЛЬТАЦИЮ.',
                'ДЕНЬ РОЖДЕНИЯ. ПОЛУЧИ В ПОДАРОК ПО $10 ОТ КАЖДОГО ИГРОКА.',
                'ВЫЙТИ ИЗ ТЮРЬМЫ БЕСПЛАТНО. Эту карточку можно сохранить на будущее или обменять.',
                'ВОЗВРАТ ПОДОХОДНОГО НАЛОГА. ПОЛУЧИ $25.',
                'ТЫ ДОЛЖЕН ОТРЕМОНТИРОВАТЬ УЛИЦЫ: ЗАПЛАТИ $40 ЗА КАЖДЫЙ ДОМ И $115 ЗА КАЖДЫЙ ОТЕЛЬ В ТВОЕЙ СОБСТВЕННОСТИ.',
                'РАСХОДЫ НА ЛЕЧЕНИЕ В БОЛЬНИЦЕ. ЗАПЛАТИ $100.',
                'НА ПРОДАЖЕ АКЦИЙ ТЫ ЗАРАБАТЫВАЕШЬ $50.',
                'ИДИ НА ПОЛЕ ВПЕРЁД. (ПОЛУЧИ $200)',
                'РАСХОДЫ НА ЛЕЧЕНИЕ У ВРАЧА. ЗАПЛАТИ $50.',
                'ТЫ АРЕСТОВАН! ОТПРАВЛЯЙСЯ СРАЗУ В ТЮРЬМУ. ТЫ НЕ ПРОХОДИШЬ ПОЛЕ ВПЕРЁД И НЕ ПОЛУЧАЕШЬ $200.',
                'ТЫ ПОЛУЧАЕШЬ В НАСЛЕДСТВО $100.',
                'ТЫ ЗАНЯЛ(А) ВТОРОЕ МЕСТО НА КОНКУРСЕ КРАСОТЫ! ПОЛУЧИ $10.',
                'ОТПУСКНЫЕ. ПОЛУЧИ $100.',
                'БАНКОВСКАЯ ОШИБКА В ТВОЮ ПОЛЬЗУ. ПОЛУЧИ $200.',
                'ВЫПЛАТА СТРАХОВКИ. ПОЛУЧИ $100.',
                'РАСХОДЫ НА ОБУЧЕНИЕ. ЗАПЛАТИ $50'];


document.body.ondragstart = function () {
    return false;
}
document.body.onselectstart = function () {
    return false;
}

//Кнопка: ПодключитьсЯ
var connectButton = document.createElement('button');
connectButton.innerHTML = 'ПодключитьсЯ';
connectButton.className = 'connect';

centerField.appendChild(connectButton);

connectButton.onclick = function (e) {
    var nameOfPerson = prompt('Введите ваше имя:', '');
    // var nameOfPerson = 'vasya';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/connect?name='+nameOfPerson, true);
    xhr.send();

    xhr.onload = function (e) {
        id = JSON.parse(this.responseText);

        console.log(id);
        setTimeout(function () {
            centerField.removeChild(connectButton);
        }, 200);
        setTimeout(function () {
            showFigures();
        }, 400);
    }
}

//Выбор фигурок
function showFigures () {
    var chooseFigure = document.createElement('span'),
        cannon = document.createElement('div'),
        cat = document.createElement('div'),
        conqueror = document.createElement('div'),
        train = document.createElement('div'),
        lamp = document.createElement('div');

    chooseFigure.className = 'choose-figure';
    cannon.className = 'cannon';
    cat.className = 'cat';
    conqueror.className = 'conqueror';
    train.className = 'train';
    lamp.className = 'lamp';

    cannon.style.animation = 'enscale 1s';
    chooseFigure.appendChild(cannon);
    setTimeout(function () {
        cat.style.animation = 'enscale 1s';
        chooseFigure.appendChild(cat);
    }, 1100);
    setTimeout(function () {
        conqueror.style.animation = 'enscale 1s';
        chooseFigure.appendChild(conqueror);
    }, 2300);
    setTimeout(function () {
        train.style.animation = 'enscale 1s';
        chooseFigure.appendChild(train);
    }, 3500);
    setTimeout(function () {
        lamp.style.animation = 'enscale 1s';
        chooseFigure.appendChild(lamp);
    }, 4700);
    setTimeout(function () {
        cannon.style.animation = cat.style.animation = conqueror.style.animation = train.style.animation = lamp.style.animation = '';
    }, 5700);

    centerField.appendChild(chooseFigure);

    chooseFigure.onclick = function (e) {
        if (e.target.tagName != 'DIV') return;

        askForIcon(e.target);

    }

    //Проиграть анимацию выбора
    function playAnimation(icon) {
        var others = getArrayOfOthers(icon);
        others.forEach(function(item) {
            item.style.visibility = 'hidden';
        });

        icon.style.animation = 'enscale 1s';
        icon.style.animationFillMode = 'forwards';
        setTimeout(function () {
            centerField.removeChild(chooseFigure);
        }, 1100);
    }

    //Свободна ли иконка?
    function askForIcon(icon) {
            var xhr = new XMLHttpRequest();

            var iconName = getNameOfIcon(icon);

            xhr.open('GET', '/start?id='+id+'&icon='+iconName, true);
            xhr.send();

            xhr.onload = function () {
                if (this.status == 200) {
                    playAnimation(icon);
                    currentIcon.classList = getNameOfIcon(icon);
                    choosePlayingHomes();
                    sendCoordsToStartPosition();
                } else {
                    console.log('Icon IS NOT free');
                    if (!centerField.contains(message)) {
                        showMsg('Выберите другую иконку, эта уже занята', {color: 'red'});
                    }
                    var chosen = getChosen(iconName);
                    chosen.style.visibility = 'hidden';
                }
            }
    }

    //Возвращает выбранную иконку
    function getChosen (name) {
        switch (name) {
            case 'cannon': return cannon;
            case 'cat': return cat;
            case 'conqueror': return conqueror;
            case 'lamp': return lamp;
            case 'train-icon': return train;
        }
    }
}
//Показывает меню выбора стиля для домиков
function choosePlayingHomes() {
    var first = document.querySelector('.first-style');
    var second = document.querySelector('.second-style');

    chooseHomes.style.visibility = 'visible';
    showAnotherMsg('и выберите стиль домиков', {color: 'blue'}, 4000);

    first.onclick = function () {
        houseSrc = 'img/house.png';
        hotelSrc = 'img/hotel.png';
        chooseHomes.style.visibility = 'hidden';

    }
    second.onclick = function () {
        houseSrc = 'img/house1.png';
        hotelSrc = 'img/hotel1.png';
        chooseHomes.style.visibility = 'hidden';

    }
}
//Глобальные переменные
var message = document.createElement('span'),
    message2 = document.createElement('span'),
    message3 = document.createElement('span'),
    message4 = document.createElement('span'),
    timer, timer2, timer3, timer4;

message.className = 'message';
message2.className = 'message2';
message3.className = 'message3';
message4.className = 'message4';

//Показать сообщение
function showMsg(text, settings, timeToDelete) {
    timeToDelete = timeToDelete || 1500;
    var color = 'red';
    if (settings) {
        color = settings.color || color;
    }

    clearTimeout(timer);
    message.style.color = color;

    message.innerHTML = text;
    centerField.appendChild(message);
    timer = setTimeout(function () {
        if (centerField.contains(message)) {
            centerField.removeChild(message);
        }
    }, timeToDelete);
}
//Показывает другое сообщение ниже
function showAnotherMsg(text, settings, timeToDelete, timeToDelay) {
    timeToDelete = timeToDelete || 1500;
    timeToDelay = timeToDelay || 0;

    var color = 'black';
    if (settings) {
        color = settings.color || color;
    }
    clearTimeout(timer2);
    message2.style.color = color;
    message2.innerHTML = text;


    setTimeout(function (){
        centerField.appendChild(message2);
        timer2 = setTimeout(function () {
            if (centerField.contains(message2)) {
                centerField.removeChild(message2);
            }
        }, timeToDelete);
    }, timeToDelay);

}
//показывает 3е сообщение
function showThirdMsg(text, settings, timeToDelete) {
    timeToDelete = timeToDelete || 1500;
    var color = 'black';
    if (settings) {
        color = settings.color || color;
    }
    clearTimeout(timer3);
    message3.innerHTML = text;
    centerField.appendChild(message3);
    timer3 = setTimeout(function () {
        if (centerField.contains(message3))
            centerField.removeChild(message3);
    }, timeToDelete);
}
//вывести сообщение повыше остальных
function showFourthMsg(text, settings, timeToDelete) {
    timeToDelete = timeToDelete || 1500;
    var color = 'black';
    if (settings) {
        color = settings.color || color;
    }
    clearTimeout(timer4);
    message4.innerHTML = text;
    message4.style.color = color;
    centerField.appendChild(message4);
    timer4 = setTimeout(function () {
        if (centerField.contains(message4))
            centerField.removeChild(message4);
    }, timeToDelete);
}
//Возвращает название иконки
function getNameOfIcon (iconContainer) {
    if (iconContainer.classList.contains('cannon')) {
        return 'cannon';
    } else if (iconContainer.classList.contains('cat')){
        return 'cat';
    } else if (iconContainer.classList.contains('conqueror')) {
        return 'conqueror';
    } else if (iconContainer.classList.contains('train')) {
        return 'train-icon';
    } else {
        return 'lamp';
    }
}
//Возвращает массив невыбранных иконок
function getArrayOfOthers(current) {
    var parent = current.parentNode;
    var others = [];

    for (var i=0; i < parent.children.length; i++) {
        if (parent.children[i] != current) {
            others.push(parent.children[i]);
        }
    }
    return others;
}

//Позиция в зависимости от поля
function getPositionFromCell(cell) {
    var place = cell.querySelector('.place-to-stand');
    var coords = place.getBoundingClientRect();
    var x = coords.left + window.pageXOffset;
    var y = coords.top + window.pageYOffset;
    return Math.round(x) + ':' + Math.round(y);
}

//Принимает номер ячейки, возвращает её cаму
function numberToCell(number) {
    var tds = document.querySelectorAll('.cell');
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].dataset.number == number) return tds[i];
    }
}

//Поставить на стартовую позицию
function sendCoordsToStartPosition() {
    var xhr = new XMLHttpRequest();
    var coords = getPositionFromCell(numberToCell(1));
    xhr.open('GET', '/position?id='+id+'&coords='+coords +'&cell=1', true);
    xhr.send();

    xhr.onload = function () {
        if (this.status=='200') {
            try {
                data = JSON.parse(this.responseText);
            } catch (e) {
                console.log('On Position '+e);
                console.log(data);
            }

            createOpponents();
            putFigures();
            startGame();
        } else
            console.log('Can\'t get data object');
    }
}
//Расположить фигурки
function putFigures() {
    try {
        for (var key in data) {
                var coords = data[key]["position"].split(':');
                opponents[key].style.top = coords[1] + 'px';
                opponents[key].style.left = coords[0] + 'px';
                document.body.appendChild(opponents[key]);
        }
    } catch (e) {
        console.log('on PUT FIGURES'+e);
        console.log(data);
    }

}
//Создать оппонентов
function createOpponents () {
    for (var key in data) {
        opponents[key] = document.createElement('div');
        opponents[key].className = data[key].icon == 'train' ? 'train-icon' : data[key].icon;
        opponents[key].style.position = 'absolute';
    }
}

//Глобальные переменные
var thrown = document.createElement('div'), //кинутые кости аним.
    cubes = centerField.querySelector('.cubes'), //статичные кости
    chanceThrowing = false;         //бросание для ШАНСА

thrown.className = 'thrown';

//Корневая функция начала игры
function startGame() {
    showMsg('Бросайте кубики, нажмите на них', {color: 'red'}, 3500);

    var firstTime = true;               //бросаем кости первый раз


//Бросаем кости
  cubes.onclick = function (e) {
    if (data[id]["isDead"] || !data[id]["turn"]) return;
    //убирать контейнер с продажей
    var findContainer = document.querySelector('.build-or-sale');
    if (findContainer) {
        findContainer.parentNode.removeChild(findContainer);
    }


    var promise = new Promise(function(resolve, reject){
      //звук
      playSoundAndAnimation(resolve);

    });

    promise.then(function() {
      var thrownResult = getThrownResult();
      var xhr = new XMLHttpRequest();

      var containerForS = centerField.querySelector('.streets');
      if (containerForS) centerField.removeChild(containerForS);
      var containerForB = centerField.querySelector('.buy-or-auction');
      if (containerForB) centerField.removeChild(containerForB);

      if (firstTime) {
        xhr.open('GET', '/thrown?id='+id, true);
        xhr.send();

        xhr.onload = function () {
          if (this.status = 200) {
            firstTime = false;
            data = JSON.parse(this.responseText);

            showMsg('Результат вашего броска '+ data[id].cubes, {color: 'black'}, 2000);

            if (data[id]["turn"]) {
            showAnotherMsg('Вы выйграли! Бросайте ещё раз.', {color: 'red'}, 4000);
            }
            subscribe();


            } else {
              console.log('Error on server');
            }
            }
            } else if (chanceThrowing) {
                  var street = (data[id]["cell"] == 29)? 'vodokanal':'electrostanciya';
                  var sum = thrownResult.split(':');
                  sum = +sum[0] + +sum[1];
                  var currentPrice = sum * 10;
                  var request = 'id='+id+'&cell='+data[id]["cell"];
                  request += '&position='+data[id]["position"];
                  request += '&thrown='+data[id]["cubes"];
                  request += '&payForStreet='+currentPrice;
                  request += '&to='+streets[street].owner;
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', '/publish?'+request, true);
                  xhr.send();
                  xhr.onload = function () {
                      console.log('RENT FOR COMMUNAL has been paid...');
                      console.log(this.responseText);
                  }
                  chanceThrowing = false;
              } else if (data[id]["toPrison"]) {
                  //Эта ветка будет разрешена только если нажаты кубики для побега

                  console.log("Trying to escape");

                  //чтобы не нажал ещё раз на кубики освободить их через 2 секунды
                  data[id]["turn"] = false;
                  var timer = setTimeout(function () {
                      data[id]["turn"] = true;
                  }, 2000);

                  //получить результаты для сравнения
                  var result = thrownResult.split(':');

                  showMsg("Вы выбросили "+thrownResult, {color: 'black'}, 3000);

                  //если выброшены дубли, то...
                  if (result[0] == result[1]) {
                      console.log('Successfull escape!');

                      //отменить восстановление хода
                      clearTimeout(timer);

                      // //сообщение, что успешно бежал
                      showAnotherMsg('Успешно бежал из тюрьмы!', {color: 'black'}, 3000);

                      //обновить счётчик попыток побега
                      prisonEscapeCounter = 3;

                      //получить новую позицию от выброшенных кубиков
                      var newPosition = getPositionFromThrownResult(thrownResult);

                      //сформировать на основе новой позиции запрос
                      var request = 'id='+id+'&thrown='+thrownResult+'&cell='+data[id]['cell']+'&position='+newPosition+'&prisonFreeEscape=true';
                      if (data[id]["chance"]) {
                          request += '&chance=true';
                      }
                      if (data[id]["community"]) {
                          request += '&community=true';
                      }
                      if (data[id]["street"]) {
                          request += '&street=true';
                      }
                      //отправить этот запрос. Побег бесплатный
                      xhr.open('GET', '/publish?'+request, true);
                      xhr.send();
                      xhr.onload = function () {
                          console.log(this.responseText);
                      }

                  } else {                            //НЕуспешный бросок костей
                      console.log('Not successfull escape!');
                      //сделать счётчик попыток на 1 меньше
                      prisonEscapeCounter--;

                      //показать сообщение, что неудачно выбросил кости
                      if (prisonEscapeCounter==1) {
                          showAnotherMsg('Неудачно! Осталась последняя попытка.', {color: 'black'}, 3000);
                      } else if (prisonEscapeCounter > 1) {
                          showAnotherMsg('Неудачно! Осталось '+prisonEscapeCounter+' попытки', {color: 'black'}, 3000);
                      }

                      if (prisonEscapeCounter == 0) {
                          //обновить счётчик попыток побега
                          prisonEscapeCounter = 3;

                          //запретить разрешение хода если три раза подряд было неудачно
                          clearTimeout(timer);

                          //получить новую позицию от выброшенных кубиков
                          var newPosition = getPositionFromThrownResult(thrownResult);

                          //сформировать на основе новой позиции запрос
                          var request = 'id='+id+'&thrown='+thrownResult+'&cell='+data[id]["cell"]+'&position='+newPosition+'&payForPrison=true';
                          if (data[id]["chance"]) {
                              request += '&chance=true';
                          }
                          if (data[id]["community"]) {
                              request += '&community=true';
                          }
                          if (data[id]["street"]) {
                              request += '&street=true';
                          }
                          xhr.open('GET', '/publish?'+request, true);
                          xhr.send();
                          xhr.onlosd= function () {
                              console.log(this.responseText);
                          }

                      }
                  }

              } else { //ОБЫЧНЫЙ БРОСОК КУБИКОВ
                  console.log('USUAL throwing of cubes');
                  //получить новую позицию
                  var newPosition = getPositionFromThrownResult(thrownResult);

                  //сформировать запрос
                  var request = 'id='+id+'&thrown='+thrownResult;

                  //Если стоит аттрибут toPrison
                  if (data[id]["toPrison"]==true) {
                      //получить координаты ячейки тюрьмы
                      var coords = numberToCell(11).querySelector('.place-to-stand').getBoundingClientRect();

                      //добавить к запросу координы ячейки тюрьмы и ячейку 11
                      request+='&position='+`${coords.left+window.pageXOffset}:${coords.top+window.pageYOffset}`+'&toPrison='+true+'&cell=11';

                      //удалить свойство toPrison
                      delete data[id]["toPrison"];
                  } else {
                      //поставить обычную позицию и ячейку
                      request += '&position='+newPosition+'&cell='+data[id]["cell"];
                  }

                  //Если есть свойство
                  if (data[id]["giveMoney"]) {
                      //К запросу добавить это свойство
                      request += '&giveMoney=true';
                  }
                  if (data[id]["badCell"]) {
                      request += '&badCell=' + data[id]["badCell"];
                  }
                  //если стоит аттрибут "хочу заплатить за тюрьму"
                  if (data[id]["payForPrison"]) {
                      //добавить его к запросу
                      request += '&payForPrison=true&toPrison=false';
                  }
                  if (data[id]["street"]) {
                      request += '&street='+true;
                  }
                  //если новая клетка - шанс
                  if (data[id]["chance"]) {
                      request +='&chance=true';
                  }
                  //если новая клетка - общественная казна
                  if (data[id]["community"]) {
                      request += '&community=true';
                  }
                  //если использована одна из карточек побега из тюрьмы
                  if (data[id]["freeChanceCard"]=='used') {
                      request += '&freeChanceCard=used';
                  }
                  if (data[id]["freeCommunityCard"] == 'used') {
                      request += '&freeCommunityCard=used';
                  }
                  xhr.open('GET', '/publish?'+request, true);
                  xhr.send();
                  xhr.onload = function () {
                      console.log(this.responseText);
                  }

              }
        });


    }
}
//проиграть рандомный звук бросания костей
function playSoundAndAnimation(resolve2) {
  //анимация
  cubes.style.visibility = 'hidden';
  centerField.appendChild(thrown);
  setTimeout(function () {
      if (centerField.contains(thrown)) {
          centerField.removeChild(thrown);
          cubes.style.visibility = 'visible';
      }
  }, 2000);

  var promise = new Promise(function (resolve, reject) {
    var audio = document.createElement('audio');
    audio.src = 'img/shaking.mp3';
    var pos = shakingSound[getRandomInt(0, shakingSound.length -1)];

    audio.currentTime = pos.start;
    document.body.appendChild(audio);
    audio.play();

    setTimeout(function() {
      document.body.removeChild(audio);
      resolve();
    }, pos.duration);
  });
  promise.then(function () {
    var audio = document.createElement('audio');
    audio.src = 'img/throwing.mp3';
    var pos = throwingSound[getRandomInt(0, throwingSound.length -1)];

    audio.currentTime = pos.start;
    document.body.appendChild(audio);
    audio.play();

    setTimeout(function() {
      document.body.removeChild(audio);
      resolve2();
    }, pos.duration);
  });
}
//подписаться на обновления пассивно
function subscribe() {
    console.log('subscribed');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/subscribe?id='+id, true);
    xhr.send();

    //получить данные, на основе них сделать изменения
    xhr.onload = function () {
        if (this.status == 200) {
            try {
                data = JSON.parse(this.responseText);
            } catch(e) {
                console.log(this.responseText + '\n'+e);
            }
        }

        //получить id последнего бросавшего
        getLastId();

        if (data[lastId]["auction"]) {
            //показать уведомление всем
            showFourthMsg('Аукцион за '+getNameFromDataname(data[lastId]["forStreet"]), {color: 'black'}, 4000);
            //сделали форму видимой
            auctionForm.style.visibility = 'visible';
            var cap = auctionForm.querySelector('.bigger');
            cap.style.display = 'none';
            //значение сбросили в начальное
            auctionValue.value = 11;

            //запустить таймер по отсчёту вниз
            runAuctionTimer();

            //запомнить чей ход был до начала аукциона
            for (var key in data) {
                if(data[key]["turn"]) savedTurn = key;
            }
            //запретить бросание костей всем
            for (var key in data) {
                data[key]["turn"] = false;
            }
            //и подписались на обновления с аукциона
            subscribeAuction();
        } else {
            if (!data[id]["isDead"]) {
                subscribe();
                setChanges();
            } else {
                data[id]["turn"] = false;
                opponents[id].parentNode.removeChild(opponents[id]);
                showMsg('Вы проиграли...', {color: 'red'}, 15000);
            }

        }
    }
    xhr.onerror = function () {
        subscribe();
        showMsg('Переподключаемся...', {color: 'black'}, 4000);
    }
}
//Обновления с аукциона
function subscribeAuction() {
    console.log('auction subscribed');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/auction_s?id='+id, true);
    xhr.send();
    xhr.onload = function () {
        if (this.status == 200) {
            try {
                auctionObject = JSON.parse(this.responseText);
            } catch (e) {
                console.log('Mistake during parsing auctionObj '+e);
            }
            if (auctionObject["finish"]) {
                //спрятать форму
                auctionForm.style.visibility = 'hidden';
                if (auctionObject["id"]) {
                    var buyer = auctionObject["id"];
                    showFourthMsg('Продано '+data[buyer]["name"]+' за '+auctionObject["price"], {color: 'black'}, 4000);
                    data[auctionObject["id"]]["bought"] = auctionObject["street"];
                    setNewStreetOwner();
                } else {
                    showFourthMsg('Возвращено банку', {color: 'black'}, 4000);
                }
                //восстановить ход
                data[savedTurn]["turn"] = true;
                //показать сообщение - кто ходит
                showWhoIsNext();
                if (data[id]["toPrison"] && data[id]["turn"]) showPrisonMenu();
                subscribe();
                // setChanges();

                if (auctionObject["id"]== id) {
                    var money = document.getElementById('money');
                    money.innerHTML = '$ '+(+data[id]["money"]-(+auctionObject["price"]));
                    showCurrentStreets();
                }
                auctionObject["price"] = 10;
            } else {
                showAuctionChanges();
                subscribeAuction();
            }
        }
    }
}

//Показывает уведомления об аукционе
function showAuctionChanges() {
    //остановить предыдущий таймер
    clearInterval(auctionTimer);

    //запустить таймер по нопой
    runAuctionTimer();

    //показывает кто-сколько предложил
    if (auctionObject["price"]==10) {
        showFourthMsg('Начальная цена 10. Кто даст больше?', {color: 'black'}, 4000);
    } else {
        var idOfPerson = auctionObject["id"];
        var message = getRandomAuctionMessage();
        var cap = auctionForm.querySelector('.bigger');
        if (idOfPerson == id) {
            cap.style.display = 'block';
            showFourthMsg('Вы дали '+auctionObject["price"]+'. Кто больше?', {color: 'black'},4000);
        } else {
            cap.style.display = 'none';
            showFourthMsg(data[idOfPerson]["name"]+message+auctionObject["price"]+'. Кто больше?', {color: 'black'},4000);
        }

        auctionValue.value = auctionObject["price"];
    }
    //делает возможную цену на 1 больше
    auctionValue.value = +auctionValue.value + 1;
}
//запускает таймер для обратного отсчёта аукциона
function runAuctionTimer() {
    //вернуть настройки на исходные
    info.innerHTML = 15;
    info.style.fontWeight= 'normal';
    info.style.color = 'white';
    info.style.right = '80px';
    info.style.animation = '';
    auctionTimer = setInterval(function () {
        if (+info.innerHTML == 0) clearInterval(auctionTimer);
        info.innerHTML--;
        if(+info.innerHTML < 10) {
            info.style.right = '65px';
        }
        if (+info.innerHTML < 4) {
            info.style.animation = 'smallscale 1s infinite';
            info.style.color = 'red';
            info.style.fontWeight = 'bold';
        }
    }, 1000);
}
//Сообщения для аукциона
function getRandomAuctionMessage() {
    var arr = [' выложил за это ', ' хочет купить это за '];
    return arr[getRandomInt(0, arr.length)];
}
// Сделать изменения
function setChanges() {
    if (data[id]["turn"]) console.log('------turnOPENED');
        //Если угодил в Тюрьму
        if (data[lastId]["toPrison"]) {
            showPrisonMsg();

            //Сказать кто сколько выбросил
            showThrownNumber();

        } else {
            if (!data[lastId]["sale"]) {
                //Сказать кто сколько выбросил
                showThrownNumber();
                //Если выброшены дубли
                showDiceThrown();
            } else {
                if (id != lastId) {
                    showFourthMsg(data[lastId]["name"] + ' продал '+getNameFromDataname(data[lastId]["sale"]), {color: 'black'}, 4000);
                }

            }

        }
        if (data[lastId]["street"]
            && id != lastId) {
            showFourthMsg(data[lastId]["name"]+' раздумывает что делать с улицей', {color: 'black'}, 4000);
        } else {
            //Кто бросает следующим
            showWhoIsNext();
        }



        //Если я в тюрьме и мой ход, то показать меню выбора
        showPrisonMenu();

        //Показать сколько денег у человека
        showMoney();

        //поставить на новую позицию last
        setNewPosition();

        //Если прошел поле вперед, то получает +200
        giveMoneyIfForwardPassed();

        //Если наступил на плохую ячейку -
        getMoneyFromIfBadCell();

        //если нужно покупать улицу
        showBuyMenu();

        //если кто-то что-то купил
        showWhatWasBought();
        //установить нового владельца улицы
        setNewStreetOwner();

        //кто кому и сколько заплатил
        showIfRentWasPaid();

        //Показать какими улицами владеет
        showCurrentStreets();

        //показать купленную собственность
        showBuildHouses();

        //если последний проиграл все свои деньги
        checkIfIsDead();

        //Если наступил на шанс или общественную казну- показать эту карточку
        showChanceMsg();
        showCommunityMsg();

        //очистить собственность, если помер
        clearOwnIfDead();
}
//Присваивает всю собственность банку, если игрок обанкротился
function clearOwnIfDead() {
    if (!data[lastId]["isDead"]) return;
    for (var street in streets) {
        if (streets[street].owner == lastId) {
            streets[street].owner = '-';
            streets[street].currentHouses = 0;
            streets[street].currentHotel = false;
        }
    }
}
//Глобальные переменные
var showCardText = document.querySelector('.show-card .text'),
    showCardApplyButton = document.querySelector('.show-card .apply'),
    smallCommunityCard = document.querySelector('.maincommunitycard'),
    smallChanceCard = document.querySelector('.mainchancecard'),
    bigRequest,
    bigXhr,
    sendRequest = true,
    showCommunityCard = false,
    showChanceCard = false;

//Если наступил на шанс
function showChanceMsg() {
    showMsg();
    function showMsg() {
        if (lastId == id || !data[lastId]["chance"]) return;
        switch(+data[lastId]["chance"]) {
            case 0:
                showFourthMsg(data[lastId]["name"]+' отправляется на ул. Арбат', {color: 'black'}, 4000);
                break;
            case 1:
                showFourthMsg(data[lastId]["name"]+' вернулся на 3 поля назад', {color: 'black'}, 4000);
                break;
            case 2:
                showFourthMsg(data[lastId]["name"]+' идёт на поле ВПЕРЁД', {color: 'black'}, 4000);
                break;
            case 3:
                showFourthMsg(data[lastId]["name"]+' арестован и отправляется в тюрьму', {color: 'black'}, 4000);
                break;
            case 4:
                showFourthMsg(data[lastId]["name"]+' избрали председателем. Он платит каждому по 50', {color: 'black'}, 4000);
                break;
            case 5:
                showFourthMsg(data[lastId]["name"]+' отправился на ближайшее коммунальное предприятие', {color: 'black'}, 4000);
                break;
            case 6:
                showFourthMsg(data[lastId]["name"]+' получил 150 в ссуду на строительство', {color: 'black'}, 4000);
                break;
            case 7:
                showFourthMsg(data[lastId]["name"]+' отправился на ближайшую станцию', {color: 'black'}, 4000);
                break;
            case 8:
                showFourthMsg(data[lastId]["name"]+' получил дивиденды от Банка в размере 50', {color: 'black'}, 4000);
                break;
            case 9:
                showFourthMsg(data[lastId]["name"]+' отремонтировал всю свою собственность', {color: 'black'}, 4000);
                break;
            case 10:
                showFourthMsg(data[lastId]["name"]+' отправляется на пл. Маяковского', {color: 'black'}, 4000);
                break;
            case 11:
                showFourthMsg(data[lastId]["name"]+' отправился на ближайшую станцию. Платит ренту в два раза больше', {color: 'black'}, 4000);
                break;
            case 12:
                showFourthMsg(data[lastId]["name"]+' пошёл кататься на Рижской Железной Дороге', {color: 'black'}, 4000);
                break;
            case 13:
                showFourthMsg(data[lastId]["name"]+' получил штраф 15 за превышение скорости', {color: 'black'}, 4000);
                break;
            case 14:
                showFourthMsg(data[lastId]["name"]+' отправился на ул. Полянка', {color: 'black'}, 4000);
                break;
            case 15:
                showFourthMsg(data[lastId]["name"]+' получил карточку "Выйти из тюрьмы бесплатно"', {color: 'black'}, 4000);
                break;
        }
    }
    if (data[lastId]["chance"] || data[lastId]["chance"] ===0) data[id]["turn"] = false;
    if (+data[id]["chance"] || data[id]["chance"]===0) {} else return;

    playChanceBeforeAnimation();
    //код
    bigRequest = 'id='+id+'&thrown='+data[id]["cubes"];
    bigXhr = new XMLHttpRequest();
    var setPosition = true;
    switch(+data[id]["chance"]) {
        case 0:
            //Отправляйся на ул. Арбат
            bigRequest += goTo(40);
            bigRequest += payRentOrBuy(40);
            setPosition = false;
            break;
        case 1:
            //Вернись на три поля назад
            var newCell = parseInt(data[id]["cell"]) - 3;
            bigRequest += goTo(newCell);
            var street = numberToDataname(newCell);
            if (street) {
                bigRequest += payRentOrBuy(newCell);
            } else if (newCell == 5) {
                bigRequest += '&badCell=200';
            } else if (newCell == 34) {
                bigRequest += '&community=true';
            }
            setPosition = false;
            break;
        case 2:
            //иди на поле вперёд, получи 200
            bigRequest += goTo(1);
            bigRequest += '&giveMoney=true';
            setPosition = false;
            break;
        case 3:
            //Отправляйся сразу в тюрьму
            bigRequest += goTo(11);
            bigRequest += '&toPrison=true';
            setPosition = false;
            break;
        case 4:
            //Тебя избрали председателем, заплати каждому по 50
            bigRequest += '&money=d';
            break;
        case 5:
            //Отправляйся на ближайшее коммунальное предприятие, кубы * 10
            //29 13
            if (data[id]["cell"] == 23 || data[id]["cell"] == 37) {
                data[id]["cell"] = 29;
            } else {
                data[id]["cell"] = 13;
            }
            bigRequest += goTo(data[id]["cell"]);
            var street = (data[id]["cell"] == 29)? 'vodokanal':'electrostanciya';
            if (streets[street].owner != '-' &&
                streets[street].owner != false &&
                streets[street].owner != id) {
                sendRequest = false;
            } else if (streets[street].owner == '-' || streets[street].owner == false) {
                bigRequest += '&street=true';
            }
            setPosition = false;
            break;
        case 6:
            //Ссуда на строительство. ПОлучи 150
            bigRequest += '&money=150p';
            break;
        case 11:
        case 7:
            //Отправляйся на ближайшую станцию. Рента в два раза больше
            //Ячейки шанса 37 23 8
            //16 36 26 6 - дороги
            if (data[id]["cell"] == 8) {
                data[id]["cell"] = 6;
            } else if (data[id]["cell"] == 23) {
                data[id]["cell"] = 26;
            } else if (data[id]["cell"] == 37) {
                data[id]["cell"] = 36;
            }
            var street = numberToDataname(data[id]["cell"]);
            bigRequest += goTo(data[id]["cell"]);
            bigRequest += payRentOrBuy(data[id]["cell"], 's');
            setPosition = false;
            break;
        case 8:
            //банк выплачивает тебе дивиденды в размере 50
            bigRequest += '&money=50p';
            break;
        case 9:
            //Капитальный ремонт всей собственности
            //25 за дом и 100 за отель
            var houses = 0, hotels = 0;
            for (var street in streets) {
                if (streets[street].owner == id) {
                    if (streets[street].currentHotel) {
                        hotels++;
                    } else if (streets[street].currentHouses) {
                        houses += +streets[street].currentHouses;
                    }
                }
            }
            var price = houses * 25 + hotels * 100;
            price += 'm';
            bigRequest += '&money='+price;
            break;
        case 10:
            //Отправляйся на площадь маяковского. Если проходишь поле
            //Вперёд - получи 200.
            if (data[id]["cell"] == 37) {
                bigRequest += '&giveMoney=true';
            }
            bigRequest += goTo(25);
            bigRequest += payRentOrBuy(25);
            setPosition = false;
            break;
        case 12:
            // Прокатись по Рижской Ж.Д. Получи 200 если проходишь поле
            // вперёд
            bigRequest += '&giveMoney=true';
            bigRequest += goTo(6);
            bigRequest += payRentOrBuy(6);
            setPosition = false;
            break;
        case 13:
            //Штраф за превышение скорости - 15
            bigRequest += '&money=15m';
            break;
        case 14:
            //Отправляйся на ул.Полянка. +200, если прошел п.Вперёд
            if (data[id]["cell"] != 8) {
                bigRequest += '&giveMoney=true';
            }
            bigRequest += goTo(12);
            bigRequest += payRentOrBuy(12);
            setPosition = false;
            break;
        case 15:
            //Выйти из тюрьмы бесплатно
            bigRequest += '&freeChanceCard=true';
            showChanceCard = true;
            break;
    }
    if (setPosition) {
        bigRequest += '&position=' + data[id]["position"];
        bigRequest += '&cell='+data[id]["cell"];
    }
    delete data[id]["chance"];
}
//Отправляйся на. Возвращает строку для запроса
function goTo(cellNumber) {
    data[id]["cell"] = cellNumber;
    var cell = numberToCell(cellNumber);
    var position = getPositionFromCell(cell);
    var request = '&cell=' + cellNumber;
    request += '&position='+position;
    data[id]["position"] = position;
    return request;
}
//Заплатить ренту или сделать статус о покупке
function payRentOrBuy(number, str) {
    var street = numberToDataname(number);
    var request = '';
    if (streets[street].owner != '-' &&
        streets[street].owner != id &&
        streets[street].owner != false) {
            if (str) {
                //если рента в два раза больше
                request += '&payForStreet='+streets[street].currentRent*2;
            } else {
                request += '&payForStreet='+streets[street].currentRent;
            }

            request += '&to='+streets[street].owner;
    } else if (streets[street].owner == '-' || streets[street].owner == false) {
        request += '&street=true';
    }
    return request;
}
//Если наступил на общественную казну
function showCommunityMsg() {
    showMsg();
    function showMsg() {
        if (id == lastId || !data[lastId]["community"]) return;
        switch (+data[lastId]["community"]) {
            case 0:
                showFourthMsg(data[lastId]["name"]+' получил 25 за консультацию', {color: 'black'}, 4000);
                break;
            case 1:
                showFourthMsg(data[lastId]["name"]+' получил по 10 от каждого игрока в подарок', {color: 'black'}, 4000);
                break;
            case 2:
                showFourthMsg(data[lastId]["name"]+' получил карточку "Выйти из тюрьмы бесплатно"', {color: 'black'}, 4000);
                break;
            case 3:
                showFourthMsg(data[lastId]["name"]+' получил 25 - возврат подоходного налога', {color: 'black'}, 4000);
                break;
            case 4:
                showFourthMsg(data[lastId]["name"]+' отремонтировал всю свою собственность', {color: 'black'}, 4000);
                break;
            case 5:
                showFourthMsg(data[lastId]["name"]+' лечился в больнице за 100', {color: 'black'}, 4000);
                break;
            case 6:
                showFourthMsg(data[lastId]["name"]+' заработал на продаже акций 50', {color: 'black'}, 4000);
                break;
            case 7:
                showFourthMsg(data[lastId]["name"]+' идёт на поле ВПЕРЁД', {color: 'black'}, 4000);
                break;
            case 8:
                showFourthMsg(data[lastId]["name"]+' лечился у врача за 50', {color: 'black'}, 4000);
                break;
            case 9:
                showFourthMsg(data[lastId]["name"]+' арестован и отправляется в тюрьму', {color: 'black'}, 4000);
                break;
            case 10:
                showFourthMsg(data[lastId]["name"]+' получил в наследство 100', {color: 'black'}, 4000);
                break;
            case 11:
                showFourthMsg(data[lastId]["name"]+' занял второе место на конкурсе красоты и получил 10', {color: 'black'}, 4000);
                break;
            case 12:
                showFourthMsg(data[lastId]["name"]+' едет в отпуск и получает 100', {color: 'black'}, 4000);
                break;
            case 13:
                showFourthMsg('Банковская ошибка в пользу '+data[lastId]["name"]+'. Получает 200. ', {color: 'black'}, 4000);
                break;
            case 15:
                showFourthMsg(data[lastId]["name"]+' потратил 50 на обучение.', {color: 'black'}, 4000);
                break;
            case 14:
                showFourthMsg(data[lastId]["name"]+' получил 100. Выплата страховки', {color: 'black'}, 4000);
                break;
        }
    }
    if (data[lastId]["community"] || data[lastId]["community"] === 0) data[id]["turn"] = false;
    if (+data[id]["community"] || data[id]["community"]=== 0) {} else return;

    playCommunityBeforeAnimation();
    //код
    bigRequest = 'id='+id+'&thrown='+data[id]["cubes"];
    bigXhr = new XMLHttpRequest();
    var setPosition = true;
    switch(+data[id]["community"]) {
        case 0:
            //получи 25 за консультацию
            bigRequest += '&money=25p';
            break;
        case 1:
            //День рождения, получи по 10 от каждого игрока
            bigRequest += '&money=b';
            break;
        case 2:
            //выйти из тюрьмы бесплатно
            bigRequest += '&freeCommunityCard=true';
            showCommunityCard = true;
            break;
        case 3:
            //Возврат подоходного налога. Получи 25
            bigRequest += '&money=25p';
            break;
        case 4:
            //Ремонт улиц. 40 за дом, 115 за отель
            var houses = 0, hotels = 0;
            for (var street in streets) {
                if (streets[street].owner == id) {
                    if (streets[street].currentHotel) {
                        hotels++;
                    } else if (streets[street].currentHouses) {
                        houses += +streets[street].currentHouses;
                    }
                }
            }
            var price = houses * 40 + hotels * 115;
            price += 'm';
            bigRequest += '&money='+price;
            break;
        case 5:
            //расходы на лечение. заплати 100
            bigRequest += '&money=100m';
            break;
        case 6:
            //на продаже акций ты зарабатываешь 50
            bigRequest += '&money=50p';
            break;
        case 7:
            //иди на поле вперёд, получи 200
            bigRequest += goTo(1);
            bigRequest += '&giveMoney=true';
            setPosition = false;
            break;
        case 8:
            //расходы на лечение у врача, заплати 50
            bigRequest += '&money=50m';
            break;
        case 9:
            //ты арестован
            bigRequest += goTo(11);
            bigRequest += '&toPrison=true';
            setPosition = false;
            break;
        case 10:
            //получаешь в наследство 100
            bigRequest += '&money=100p';
            break;
        case 11:
            //Второе место на конкурсе красоты, получи 10
            bigRequest += '&money=10p';
            break;
        case 12:
            //отпускные, получи 100
            bigRequest += '&money=100p';
            break;
        case 13:
            //Банковская ошибка в твою пользу, получи 200
            bigRequest += '&money=200p';
            break;
        case 14:
            //выплата страховки, получи 100
            bigRequest += '&money=100p';
            break;
        case 15:
            //расходы на обучение, заплати 50
            bigRequest += '&money=50m';
            break;
    }
    if (setPosition) {
        bigRequest += '&position=' + data[id]["position"];
        bigRequest += '&cell='+data[id]["cell"];
    }
    delete data[id]["community"];
}
function playChanceBeforeAnimation() {
    showCard.hidden = false;
    showCard.style.backgroundColor = '#e0ae3d';
    showCardText.innerHTML = chance[data[id]["chance"]];
    setAnimation2(smallChanceCard);
    setAnimation1(showCard);
}
function playCommunityBeforeAnimation() {
    showCard.hidden = false;
    showCard.style.backgroundColor = '#dbf24a';
    showCardText.innerHTML = community[data[id]["community"]];
    setAnimation2(smallCommunityCard);
    setAnimation1(showCard);
}
showCardApplyButton.onclick = function () {
    showCard.hidden = true;
    showCard.style.animation = '';
    smallCommunityCard.style.animation = '';
    smallChanceCard.style.animation = '';
    if (sendRequest) {
        if (showCommunityCard) {
            freeCommunityCard.style.visibility = 'visible';
            showCommunityCard = false;
        } else if (showChanceCard) {
            freeChanceCard.style.visibility = 'visible';
            showChanceCard = false;
        }
        // delete data[id]["chance"];
        // delete data[id]["community"];
        bigXhr.open('GET', '/publish?'+bigRequest, true);
        bigXhr.send();
        console.log('++++++++bR'+bigRequest);
        bigXhr.onload = function () {
            console.log('`````CHANCE OR COMMUNITY IS DONE!');
            console.log(this.responseText);
        }
    } else {
        chanceThrowing = true;
        showMsg('Бросайте кубики!', {color: 'black'}, 4000);
    }

}
//для главной карточки
function setAnimation1(elem) {
    elem.style.animation = 'move 2s';
    elem.style.animationFillMode = 'forwards';
    elem.style.animationDelay = '2s';
}
//для мелких карточек
function setAnimation2(elem) {
    elem.style.animation = 'move2 2s';
    elem.style.animationFillMode = 'forwards';
}
//номер ячейки превращает в dataname
function numberToDataname (number) {
    var sels = document.querySelectorAll('.sell');
    for (var i = 0; i <sels.length; i++) {
        if (sels[i].dataset.number == number) return sels[i].dataset.sname;
    }
}
//Показывает купленные дома и отели
function showBuildHouses() {
  if (!data[lastId]["houseBuild"]) return;

  var streetsAndHouses = data[lastId]["houseBuild"].split('e5');
  streetsAndHouses.forEach(function (item) {
      item = item.split('e1');
      //получаем место для домов из ячейки
      var street = item[0];
      var placeForHouses = getCellFromDataname(street).querySelector('.houses');
      var children = placeForHouses.children;
        //если есть дома, то сначала удаляем все
      if (children) {
        placeForHouses.parentNode.removeChild(placeForHouses);
        var newPlace = document.createElement('div');
        newPlace.className = 'houses';
        getCellFromDataname(street).appendChild(newPlace);
      }

      if (item[1] =='1hotel') {
          streets[street].currentHouses=4;
          streets[street].currentHotel = true;
          var hotel = document.createElement('img');
          hotel.src = hotelSrc;
          newPlace.appendChild(hotel);
      } else {
          var houses = item[1].split('houses');
          streets[street].currentHouses = +houses[0];
          streets[street].currentHotel = false;
          for (var i =0; i < houses[0]; i++) {
              var house = document.createElement('img');
              house.src = houseSrc;
              newPlace.appendChild(house);
          }
      }
  });

}
//ячейку cell из sName
function getCellFromDataname(dataname) {
    var sells = document.querySelectorAll('.sell');
    for (var i = 0; i < sells.length; i++) {
        if (sells[i].dataset.sname == dataname) return sells[i];
    }
}
//Показать улицы, которыми владеет
function showCurrentStreets() {
    var findContainer = document.querySelector('.streets');
    if (findContainer) {
        findContainer.parentNode.removeChild(findContainer);
    }

    var containerForStreets = document.createElement('div');
    containerForStreets.className = 'streets';

    for (var key in streets) {
        if (+streets[key].owner == id) {
            var item = document.createElement('div');
            item.classList.add('item');
            if (key =='vodokanal' || key == 'electrostanciya') {
                if (key == 'vodokanal') {
                    item.classList.add('vodokanal');
                } else {
                    item.classList.add('electrostanciya');
                }
            } else {
                item.classList.add(streets[key].color);
            }

            item.innerHTML = getNameFromDataname(key);
            containerForStreets.appendChild(item);
        }
    }
    centerField.appendChild(containerForStreets);
}

//Если кто-то кому-то заплатил ренту
function showIfRentWasPaid() {
    if (!data[lastId]["payForStreet"]) return;

    var nameOfPerson = data[data[lastId]["to"]]["name"];
    if (lastId == id) {
        showFourthMsg('Вы заплатили '+nameOfPerson+' '+data[id]["payForStreet"], {color: 'red'}, 4000);
    } else if (data[lastId]["to"] == id){
        showFourthMsg(data[lastId]["name"]+' заплатил мне '+data[lastId]["payForStreet"], {color: 'black'}, 4000);
    } else {
        showFourthMsg(data[lastId]["name"]+' заплатил '+nameOfPerson+' '+data[lastId]["payForStreet"], {color: 'black'}, 4000);
    }
}
//в объекте с улицами установить нового владельца улиц
function setNewStreetOwner() {
    //если были проданы
    for (var key in data) {
        //если у key есть аттрибут sale
        if (data[key]["sale"]) {
            streets[data[key]["sale"]].owner = '-';
        }
    }

    //если были куплены
    for (var key in data) {
        //если у key есть аттрибут bought
        if (data[key]["bought"]) {
            //присвоить этого владельца улице
            var street = data[key]["bought"];
            streets[street].owner = +key;
            //назначить счётчик, по истечению которого все улицы куплены
            var counter;
            //улицы из этой группы имеют по 3 улицы до полного комплекта
            if (streets[street].color =='orange' ||
                streets[street].color =='red' ||
                streets[street].color =='green' ||
                streets[street].color =='yellow' ||
                streets[street].color =='darkred' ||
                streets[street].color =='light') {
                    counter = 3;
                //для поездов полный комплект - 4
            } else if(streets[street].color =='trainy') {
                counter = 4;
                //для остальных: комуналка, синяя, фиолетовая
            } else {
                counter = 2;
            }
            // console.log('~~~~Сколько улиц ищем ='+counter);
            //проверять будем по цвету. Возьмём в переменную текущий цвет
            var color = streets[street].color;
            // console.log('~~~~Искомый цвет: '+color);
            //для каждой улицы
            for (var street in streets) {
                //если цвет подходит и владелец тот же
                // console.log('~~~~~~~~цвет:'+streets[street].color+' владелец:'+streets[street].owner);
                if (streets[street].color == color && streets[street].owner == key) {
                    //убавить счётчик на 1
                    counter--;
                    // console.log('~~~~Цвет подходит и владелец тот же');
                }
            }
            // console.log('~~~~После проверки счётчик ='+counter);
            //если это поезда или комуналка
            if (color == 'trainy' || color == 'communak'){
                //узнаем сколько улиц найдено
                if (color == 'trainy') {
                    //для поездов надо вычитать из 4 максимальных
                    var counter2 = 4 - counter;
                } else {
                    //иначе - это коммуналка, вычитать надо из 2 максимальных
                    var counter2 = 2 - counter;
                }
                //снова переберём улицы
                for (var street in streets) {
                    //если цвет у искомой и владелец совпадает, то
                    if (streets[street].color == color && key == streets[street].owner) {
                        //проставить для каждой новое значение владеемых улиц
                        streets[street].currentStreets = counter2;
                        // console.log('~~~~для поездов и комуналки ставим значение вледаемых улиц');
                    }
                }
            }
            //только если счётчик оказался равен 0, значит все улицы куплены
            if (counter == 0) {
                // console.log('~~~~Cчётчик равен 0');
                //если это для меня, то вывести сообщение про меня
                if (key == id) {
                    showMsg('Вы купили все улицы одного цвета!', {color: 'blue'}, 4000);
                    //иначе сообщение про кого-то другого
                } else {
                    showMsg(data[key]["name"]+' купил все улицы одного цвета!', {color: 'blue'}, 4000);
                }
                //переберём ещё раз улицы
                for (var street in streets) {
                    //если цвет выпавшей улицы совпадает с искомым цветом,
                    //вледельца не проверяем, т.к. счётчик равен 0 - это 1 владелец
                    if (streets[street].color == color) {
                        //только для _улиц_
                        if (color =='orange' || color =='red' || color =='green' || color =='yellow' || color =='darkred' || color =='light' || color =='blue' || color =='purple') {
                            //проставить true - что это все улицы одной группы
                            streets[street].currentStreets = true;
                        }
                    }
                }
            }
        }
    }

}

//Глобальные переменные
var table = document.getElementById('table');

//возвращает имя функции из её data аттрибута
function getNameFromDataname(dataname) {
    var elems = table.querySelectorAll('.sell');
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].dataset.sname == dataname) {
            return elems[i].querySelector('.text').innerHTML;
        }
    }
}

//показывает кто что и за сколько купил
function showWhatWasBought() {
    if (!data[lastId]["bought"]) return;

    var sname = getNameFromDataname(data[lastId]["bought"]);

    if (id == lastId) {
        showMsg('Вы купили '+ sname+' за '+data[id]["forPrice"], {color: 'black'}, 3000);
    } else {
        showMsg(data[lastId]["name"]+' купил '+sname+' за '+data[lastId]["forPrice"], {color: 'black'}, 3000);
    }
}


//Если ячейку можно купить, то показывает меню
function showBuyMenu() {
    if (!data[lastId]["street"]) return;
    var savedTurn;
    for (var key in data) {
        if (data[key]["turn"] == true) savedTurn = key;
    }
    if (data[lastId]["street"]) data[id]["turn"] = false;
    console.log('---------turnCLOSED');
    if (!data[id]["street"]) return;


    //получили саму ячейку
    var cellName = numberToCell(data[id]["cell"]);

    //синхронизировали её с объектом собственности
    var street = streets[cellName.dataset.sname];
    if(!street) return;


    console.log(street);
    var xhr = new XMLHttpRequest();
    var request = 'id='+id;

    var sName = cellName.querySelector('.text').innerHTML;
    var price = parseInt(cellName.querySelector('.money').innerHTML);
    var currentMoney = +centerField.querySelector('.show-current-money').innerHTML.split('$ ').join('');

    var container = document.createElement('div'),
        buy = document.createElement('div'),
        refuse = document.createElement('div');

    container.className = 'buy-or-auction';
    buy.className = 'buy';
    refuse.className = 'refuse';

    container.appendChild(buy);

    if (street.owner) {
        if(street.owner == '-') { //если был владелец раньше, но теперь свободна
            container.appendChild(refuse);
            centerField.appendChild(container);

            //по нажатию покупает ранее проданную улицу
            buy.onclick = function () {
                if (currentMoney - street.toBuyAgain > 0) {

                    request += '&bought='+cellName.dataset.sname;
                    request += '&forPrice='+street.toBuyAgain;
                    request += '&position='+data[id]["position"];
                    request += '&cell='+data[id]["cell"];
                    request += '&thrown='+data[id]["cubes"];

                    xhr.open('GET', '/publish?'+request, true);
                    xhr.send();
                    xhr.onload = function () {
                        console.log(this.responseText);
                    }

                    centerField.removeChild(container);
                } else {
                    showMsg('Недостаточно денег!', {color: 'black'}, 1000);
                }
                data[savedTurn]["turn"] =true;
            }
            refuse.onclick = function (e){
                request += '&position='+data[id]["position"];
                request += '&cell='+data[id]["cell"];
                request += '&thrown='+data[id]["cubes"];
                xhr.open('GET', '/publish?'+request, true);
                xhr.send();
                xhr.onload = function () {
                    console.log(this.responseText);
                }

                centerField.removeChild(container);
                data[savedTurn]["turn"] = true;
            }
        } else if (+street.owner == id) {
            return; // это я, ничего не показывать
        } else { //это не я, тогда заплатить
            if (data[id]["cell"]==29 || data[id]["cell"]==13) {
                var result = data[id]["cubes"].split(':');
                result = parseInt(result[0])+parseInt(result[1]);
                request += '&payForStreet='+result*street.currentRent;
            } else {
                request +='&payForStreet='+street.currentRent;
            }
            request +='&to='+street.owner;
            request += '&position='+data[id]["position"];
            request +='&cell='+data[id]["cell"];
            request += '&thrown='+data[id]["cubes"];

            xhr.open('GET', '/publish?'+request, true);
            xhr.send();
            data[savedTurn]["turn"] =true;
            xhr.onload = function () {
                console.log(this.responseText);
                console.log('rent is paid');
            }
        }
    } else { //ичаче владельца нет: owner == false
        //чтобы не мог бросить кости
        data[id]["turn"] = false;

        //добавили кнопку аукциона в контейнер
        var auction = document.createElement('div');

        auction.className = 'auction';

        //добавили кнопки на страницу
        container.appendChild(auction);
        centerField.appendChild(container);

        //по нажатию на кнопку покупает улицу
        buy.onclick = function() {

            //разрещает бросать кости стова
            // data[id]["turn"] = true;

            if (currentMoney - price > 0) {

                request += '&bought='+cellName.dataset.sname;
                request += '&forPrice='+price;
                request += '&position='+data[id]["position"];
                request += '&cell='+data[id]["cell"];
                request +='&thrown='+data[id]["cubes"];

                xhr.open('GET', '/publish?'+request, true);
                xhr.send();
                xhr.onload = function () {
                    console.log(this.responseText);
                }

                centerField.removeChild(container);
            } else {
                showMsg('Недостаточно денег!', {color: 'black'}, 1000);
            }
            data[savedTurn]["turn"] =true;
        }


        auction.onclick = function () {
            request +='&position='+data[id]["position"];
            request += '&cell='+data[id]["cell"];
            request += '&thrown=' +data[id]["cubes"];
            request += '&auction='+true;
            request += '&forStreet='+cellName.dataset.sname;
            xhr.open('GET', '/publish?'+request, true);
            xhr.send();
            xhr.onload = function () {
                console.log(this.responseText);
            }
            centerField.removeChild(container);
        }
    }


}
//Получает id последнего бросавшего
function getLastId() {
    for (var key in data) {
        if (data[key]["last"]) lastId = key;
    }
}

//показать Меню выхода из тюрьмы
function showPrisonMenu() {
    // if(data[lastId]["street"]) return;
    if (data[id]["toPrison"]==true || data[id]["toPrison"] =='true'&& data[id]["turn"]) {

        var container = document.createElement('div'),
            pay = document.createElement('div'),
            throwCubes = document.createElement('div'),
            releaseCard = document.createElement('div');
        //назначили классы
        container.className = 'pay-or-throw';
        pay.className = 'pay';
        throwCubes.className = 'throw';
        releaseCard.className = 'release';

        container.appendChild(pay);
        container.appendChild(throwCubes);

        if (data[id]["freeCommunityCard"] ||
            data[id]["freeChanceCard"]) {
            container.appendChild(releaseCard);
        }

        //получили координаты ЦЕНТРА
        var coords = centerField.getBoundingClientRect();

        container.style.left = coords.left + window.pageXOffset + 250 + 'px';
        container.style.top = coords.top + window.pageYOffset + 200 + 'px';

        document.body.appendChild(container);

        //запретить бросание костей
        data[id]["turn"] = false;

        //если хочу заплатить, то
        pay.onclick = function (e) {
            //чтобы бросать ПО-ОБЫЧНОМУ
            data[id]["toPrison"] = false;

            //аттрибут "хочу заплатить"
            data[id]["payForPrison"] = true;

            //разрешить бросание костей
            data[id]["turn"] = true;

            //обновить счётчик попыток побега
            prisonEscapeCounter = 3;

            //удалить это меню
            document.body.removeChild(container);
        }
        releaseCard.onclick = function () {
            delete data[id]["toPrison"];
            data[id]["turn"] = true;
            if (data[id]["freeCommunityCard"]) {
                data[id]["freeCommunityCard"] = 'used';
                freeCommunityCard.style.visibility = 'hidden';
            } else {
                data[id]["freeChanceCard"] = 'used';
                freeChanceCard.style.visibility = 'hidden';
            }
            document.body.removeChild(container);
        }

        throwCubes.onclick = function (e) {
            //бросать трижды и если не вышел, то платить

            //разрешить бросать кубики
            data[id]["turn"] = true;

            //удалить это меню
            document.body.removeChild(container);
        }
    } else return;

}

//Проверяет и выводит сообщение если угодил в тюрьму
function showPrisonMsg() {

        var message;
        if (id == lastId){
            message = getRandomPrisonMessage();
            showAnotherMsg(`${message}`, {color: 'red'}, 4500);
        } else {
            message = getRandomPrisonMessage2();
            showAnotherMsg(`${data[lastId]["name"]} ${message}`, {color: 'red'}, 4500);
        }

}
//Рандомное сообщение о причине попадания в тюрьму: Я
function getRandomPrisonMessage() {
    var arr  = ['Я не виновен, отпустите меня!', 'Посижу пока в каталажке'];
    return arr[getRandomInt(0, arr.length)];
}
//Рандомное сообщение для других
function getRandomPrisonMessage2() {
    var arr  = ['попал в тюрюму за свои грязные делишки', 'жульничал и попал в тюрьму', 'дал взятку и угодил в тюрьму', 'плохо себя вёл, поэтому попал в тюрьму', ' просто плохой человек. В тюрьме ему и место', 'пытался перелезть забор в неположенном месте. В тюрьму его!'];
    return arr[getRandomInt(0, arr.length)];
}
//Проверить мёртв ли
function checkIfIsDead() {
    if (data[lastId]["isDead"]) {
        document.body.removeChild(opponents[lastId]);
        showMsg(`${data[lastId]["name"]} проиграл! Спляшем на его могиле!`, {color: 'red'}, 3000);
        return true;
    } else return false;
}
//Анимация отымания денег за плохую клетку
function getMoneyFromIfBadCell() {
    if(!data[lastId]["badCell"]) return;

    if (id == lastId) {
        showAnotherMsg(`Придётся платить ${data[lastId]["badCell"]}`, {color: 'red'}, 4000);
    } else {
        showAnotherMsg(`${data[lastId]["name"]} заплатил ${data[lastId]["badCell"]}`, {color: 'red'}, 4000);
    }

    var containerOfAnim = document.createElement('div');
    var anim = document.createElement('div');

    containerOfAnim.className = 'anim-money-container';
    anim.className = (data[lastId]["badCell"] == 100) ? 'pay-100':'pay-200';

    containerOfAnim.appendChild(anim);

    var coords = opponents[lastId].getBoundingClientRect();
    containerOfAnim.style.left = coords.left +window.pageXOffset + 'px';
    containerOfAnim.style.top = coords.top + window.pageYOffset + 50 + 'px';

    document.body.appendChild(containerOfAnim);
    setTimeout(function () {
        document.body.removeChild(containerOfAnim);
    }, 1010);
    //удалить это свойство
    delete data[lastId]["badCell"];
}

//Если прошёл поле вперёд, то проиграть анимацию получения денег
function giveMoneyIfForwardPassed() {
    if (!data[lastId]["giveMoney"]) return;

    if (id == lastId) {
        showAnotherMsg(`Прошёл поле Вперёд. Получил 200`, {color: 'red'}, 3000);
    } else {
        showAnotherMsg(`${data[lastId]["name"]} прошёл поле Вперёд. Получил 200`, {color: 'red'}, 3000);
    }

    var containerOfAnim = document.createElement('div');
    var anim = document.createElement('div');

    containerOfAnim.className = 'anim-money-container';
    anim.className = 'get-200';

    containerOfAnim.appendChild(anim);

    var coords = opponents[lastId].getBoundingClientRect();
    containerOfAnim.style.left = coords.left +window.pageXOffset + 'px';
    containerOfAnim.style.top = coords.top + window.pageYOffset + 50 + 'px';

    document.body.appendChild(containerOfAnim);
    setTimeout(function () {
        document.body.removeChild(containerOfAnim);
    }, 1010);

    //удалить это свойство
    delete data[lastId]["giveMoney"];
}

//Сказать кто сколько выбросил
function showThrownNumber() {
    if (lastId == id) {
        showMsg(`Вы выбросили ${data[lastId]["cubes"]}`, {color: 'black'}, 4000);
    } else {
        showMsg(`${data[lastId]["name"]} выбросил ${data[lastId]["cubes"]}`, {color: 'black'}, 4000);
    }
}

//Если выброшены дубли
function showDiceThrown() {
    var split = data[lastId]["cubes"].split(':');
    if (split[0] == split[1]) {
        if (lastId == id) {
            showAnotherMsg('Дубль! Бросаю ещё.', {color: 'black'});
        } else {
            showAnotherMsg(`У ${data[lastId]["name"]} дубль. Бросает ещё.`, {color: 'black'});
        }
    }
}

//Кто бросает следующим
function showWhoIsNext() {
    if (data[id]["turn"]) {
        showThirdMsg('Моя очередь бросать кости', {color: 'black'}, 4000);
    } else {
        var nameOfPerson = whoseTurn();
        showThirdMsg('Очередь '+nameOfPerson+' бросать', {color: 'black'}, 4000);
    }
}


//располагает последнего ходившего на новой клетке        АНИМАЦИЮ БЫ!!
function setNewPosition () {
    var coords = data[lastId]["position"].split(':');
    opponents[lastId].style.left = +coords[0] + 'px';
    opponents[lastId].style.top = +coords[1] + 'px';
}

//Возвращает новые координаты
function getPositionFromThrownResult(result) {
    //разбить результат броска в массив
    result = result.split(':');

    //если это дубль, то кол-во дублей увеличить на 1
    if (+result[1] == result[0]) {
        data[id]["doublesInRow"]++;
    }

    //сложить результаты, чтобы получить кол-во ячеек для хода
    result = parseInt(result[0]) + parseInt(result[1]);

    //полуить старую ячейку
    var newCell = +data[id]["cell"];

    //получить новую ячейку
    newCell += result;

    //отправляется в тюрьму, если счётчик дублей == 3 или наступает на яч.Иди в Тюрьму
    if (newCell == 31 || data[id]["doublesInRow"] == 3) {
        console.log('three doubles in a row or cell #31');
        newCell = 11;
        data[id]["toPrison"] = true;
    }

    console.log('old cell:'+data[id]["cell"]);
    console.log('new position :'+newCell);


    //проверяет ячейку на  всякое
    if (newCell > 40) {
        //то новая ячейка = старая - 40
        newCell -= 40;
        //и получение денег если прошёл поле Вперёд
        data[id]["giveMoney"] = true;
    }
    //если это - ячейка
    if (newCell == 5 || newCell == 39) {
        data[id]["badCell"] = (newCell==5)? 200 : 100;
        console.log("bad cell #"+ newCell +' pay: '+data[id]["badCell"]);
    }
    if (newCell == 3 || newCell == 34 || newCell == 18) {
        data[id]["community"] = true;
    }
    if (newCell == 23 || newCell == 8 || newCell == 37) {
        data[id]["chance"] = true;
    }
    //установить результат новой ячейки в текущую переменную
    data[id]["cell"] = newCell;
    newCell = numberToCell(newCell);

    //если ячейка покупаемая, то сделать соответствующий статус
    if (newCell.dataset.sname && +streets[newCell.dataset.sname].owner != id) {
        data[id]["street"] = true;
    }

    //вернуть координаты поля 'place-to-stand' новой ячейки
    return getPositionFromCell(newCell);
}


//Сколько денег показывать
function showMoney() {
    var money = data[id]["money"];
    var showMoney = document.querySelector('.show-current-money');
    showMoney.innerHTML = '$ '+money;
    showMoney.style.visibility = 'visible';

    var ones = document.querySelector('.ones'),
        fives = document.querySelector('.fives'),
        tens = document.querySelector('.tens'),
        twelves = document.querySelector('.twelves'),
        fifties = document.querySelector('.fifties'),
        hundreds = document.querySelector('.hundreds'),
        fiveHundrs = document.querySelector('.five-hundrs');
    ones.style.visibility = fives.style.visibility = tens.style.visibility = twelves.style.visibility = fifties.style.visibility = hundreds.style.visibility = fiveHundrs.style.visibility = 'hidden';

    if (money > 1500) {
        fifties.style.visibility = hundreds.style.visibility = fiveHundrs.style.visibility = 'visible';
    } else if (money > 1000) {
        fifties.style.visibility = hundreds.style.visibility = twelves.style.visibility = 'visible';
    } else if (money > 600) {
        fifties.style.visibility = twelves.style.visibility = tens.style.visibility = 'visible';
    } else if (money > 300) {
        tens.style.visibility = twelves.style.visibility = fives.style.visibility = 'visible';
    } else if (money > 200) {
        tens.style.visibility = fives.style.visibility = ones.style.visibility = 'visible';
    } else if (money < 100) {
        fives.style.visibility = ones.style.visibility = 'visible';
    }
}
//Вернёт имя того, кто бросает кубики
function whoseTurn() {
    for (var key in data) {
        if (data[key]["turn"]) return data[key]["name"];
    }

}

//Получить результат броска кубиков
function getThrownResult() {
    return getRandomInt() + ':' + getRandomInt();
}

//Возвращает число для броска кубиков
// Возвращает случайное целое число между min (включительно) и max (не включая // max)
function getRandomInt(min, max) {
    min = min || 1;
    max = max || 7;
  return Math.floor(Math.random() * (max - min)) + min;
}

//Конструктор улицы
function Street (withoutStreets, withAllStreets, with1House, with2Houses,
                 with3Houses, with4Houses, withHotel, priceOfHouse, toBuyAgain,
                 color ) {
                     //КОНСТАНТЫ
    //без всех улиц в комплекте стоимость =
    this.withoutStreets = withoutStreets;
    //со всеми улицами в комплекте стоимость =
    this.withAllStreets = withAllStreets;
    //с одним домом стоимость равна
    this.with1House = with1House;
    //с двумя домами стоимость равна
    this.with2Houses = with2Houses;
    //с тремя домами стоимость равна
    this.with3Houses = with3Houses;
    //с четырьмя домами стоимость равна
    this.with4Houses = with4Houses;
    // с отелем стоимость равна
    this.withHotel = withHotel;
    //стоимость одного дома или отеля
    this.priceOfHouse = priceOfHouse;
    //Выкупить после продажи
    this.toBuyAgain = toBuyAgain;
    //название класса для ячейки
    this.color = color;

    this.owner = false;
    //Меняется во время игры
    this.currentStreets = false; /*allStreets or false*/
    this.currentHouses = 0; /*1,2,3,4*/
    this.currentHotel = false; /*true or false*/

    var self = this;
    //["currentRent"] получает своё значение в зависимости от других свойств
    Object.defineProperty(this, "currentRent", {get: function () {
        if(self.currentHotel) {
            return self.withHotel;
        } else if (self.currentHouses) {
            if (self.currentHouses == 4) return self.with4Houses;
            else if (self.currentHouses == 3) return self.with3Houses;
            else if (self.currentHouses == 2) return self.with2Houses;
            else return self.with1House;
        } else if (self.currentStreets) {
            return self.withAllStreets;
        } else
            return self.withoutStreets;
    }});
}
//конструктор Ж/Д
function Railway() {
    this.owner = false;
    this.toBuyAgain = 110;
    //Меняется по ходу игры
    this.currentStreets = 0; //1, 2, 3, 4
    this.color = 'trainy';

    var self = this;
    Object.defineProperty(this, "currentRent", {
        get: function () {
            switch (self.currentStreets) {
                case 1: return 25;
                        break;
                case 2: return 50;
                        break;
                case 3: return 100;
                        break;
                case 4: return 200;
                        break;
            }
        }
    });
}
//конструктор КОММУНАЛЬНЫХ ПРЕДПРИЯТИЙ
function Communal() {
    this.owner = false;
    this.toBuyAgain = 83;
    //Меняется по ходу игры
    this.currentStreets = 0; //1, 2
    this.color = 'communak';
    var self = this;
    Object.defineProperty(this, "currentRent", {
        get: function () {
            if (self.currentStreets == 2) {
                return 10;
            } else return 4;
        }
    });
}

//Собственность
var streets = {
    "nagatinskaya": new Street(4, 8, 20, 60, 180, 320, 450, 50, 33, "purple"),
    "zhitnaya": new Street(2, 4, 10, 30, 90, 160, 250, 50, 33, "purple"),
    "ogareva": new Street(6, 12, 30, 90, 270, 400, 550, 50, 55, "light"),
    "parkovaya": new Street(8, 16, 40, 100, 300, 450, 600, 50, 66, "light"),
    "varshavskoe": new Street(6, 12, 30, 90, 270, 400, 550, 50, 55, "light"),
    "rostovskaya": new Street(12, 24, 60, 180, 500, 700, 900, 100, 88, "darkred"),
    "sretenka": new Street(10, 20, 50, 150, 450, 625, 750, 100, 77, "darkred"),
    "polyanka": new Street(10, 20, 50, 150, 450, 625, 750, 100, 77, "darkred"),
    "rublevskoe": new Street(16, 32, 80, 220, 600, 800, 1000, 100, 110, "orange"),
    "ryazanskii": new Street(14, 28, 70, 200, 550, 750, 950, 100, 99, "orange"),
    "vavilova": new Street(14, 28, 70, 200, 550, 750, 950, 100, 99, "orange"),
    "tverskaya": new Street(18, 36, 90, 250, 700, 875, 1050, 150, 121, "red"),
    "pushkinskaya": new Street(18, 36, 90, 250, 700, 875, 1050, 150, 121, "red"),
    "mayakovskogo": new Street(20, 40, 100, 300, 750, 925, 1100, 150, 132, "red"),
    "gruzinskii": new Street(22, 44, 110, 330, 800, 975, 1150, 150, 143, "yellow"),
    "novinskii": new Street(22, 44, 110, 330, 800, 975, 1150, 150, 143, "yellow"),
    "smolenskaya": new Street(24, 48, 120, 360, 850, 1025, 1200, 150, 154, "yellow"),
    "gogolevskii": new Street(26, 52, 130, 390, 900, 1100, 1275, 200, 165, "green"),
    "kutuzovskii": new Street(28, 56, 150, 450, 1000, 1200, 1400, 200, 176, "green"),
    "shuseva": new Street(26, 52, 130, 390, 900, 1100, 1275, 200, 165, "green"),
    "arbat": new Street(50, 100, 200, 600, 1400, 1700, 2000, 200, 220, "blue"),
    "bronnaya": new Street(35, 70, 175, 500, 1100, 1300, 1500, 200, 193, "blue"),
    "kazanskaya": new Railway(),
    "rizhskaya": new Railway(),
    "leningradskaya": new Railway(),
    "kurskaya": new Railway(),
    "vodokanal": new Communal(),
    "electrostanciya": new Communal()
}
//Аукцион: Кнопки увеличения и подтверждения
plusOneButton.onclick = function () {
    auctionValue.value = +auctionValue.value + 1;
    return false;
}
plusFiveButton.onclick = function () {
    auctionValue.value = +auctionValue.value + 5;
    return false;
}
plusTenButton.onclick = function () {
    auctionValue.value = +auctionValue.value + 10;
    return false;
}
plusFiftyButton.onclick = function () {
    auctionValue.value = +auctionValue.value + 50;
    return false;
}
auctionForm.onsubmit = function () {
    var xhr = new XMLHttpRequest();
    var request = 'id='+id+'&price='+auctionValue.value;
    if (+auctionValue.value < auctionObject["price"]) {
        showFourthMsg('Меньше нельзя!', {color: 'black'}, 1000);
    } else {
        xhr.open('GET', '/auction_p?'+request, true);
        xhr.send();
        xhr.onload = function () {
            console.log(this.responseText);
        }
    }
    return false;
}
//Возвращает в массиве все улицы одного цвета
function getAllStreets (color) {
    if (color == 'purple') {
        return ['zhitnaya', 'nagatinskaya'];
    } else if (color == 'blue') {
        return ['arbat', 'bronnaya'];
    } else if (color == 'orange') {
        return ['ryazanskii', 'vavilova', 'rublevskoe'];
    } else if (color == 'red') {
        return ['tverskaya', 'pushkinskaya', 'mayakovskogo'];
    } else if (color == 'green') {
        return ['shuseva', 'gogolevskii', 'kutuzovskii'];
    } else if (color == 'yellow') {
        return ['gruzinskii', 'novinskii', 'smolenskaya'];
    } else if (color == 'darkred') {
        return ['polyanka', 'sretenka', 'rostovskaya'];
    } else if (color == 'light') {
        return ['varshavskoe', 'ogareva', 'parkovaya'];
    }
}
//Глобальные переменные
var firstHouse = building.elements.firsthouse,
    firstHotel = building.elements.firsthotel,
    secondHouse = building.elements.secondhouse,
    secondHotel = building.elements.secondhotel,
    thirdHouse = building.elements.thirdhouse,
    thirdHotel = building.elements.thirdhotel,
    firstBlock = document.querySelector('.block1'),//блоки содерж улицы
    secondBlock = document.querySelector('.block2'),
    thirdBlock = document.querySelector('.block3'),
    firstSpan = document.querySelector('.block1 .streetname'),//название улиц
    secondSpan = document.querySelector('.block2 .streetname'),
    thirdSpan = document.querySelector('.block3 .streetname'),
    animContainer1 = document.querySelector('.anim1'),  //блоки с анимацией
    animContainer2 = document.querySelector('.anim2'),
    animContainer3 = document.querySelector('.anim3'),
    animCounter1 = 0,                           //счётчики для анимации
    animCounter2 = 0,
    animCounter3 = 0,
    names;                              //массив, содержащий названия улиц

//Клики по ячейкам таблицы
table.onclick = function (e) {
    var target = e.target;
    while(target.tagName && target.tagName != 'TD') {
        target = target.parentNode;
    }
    console.log('==click on '+target.tagName);
    if (target.tagName != 'TD') return;
    if (!data[id]["turn"]) return;

    var street = target.dataset.sname;
    if (!street) return;
    if (+streets[street].owner != id) return;
    var elem = centerField.querySelector('.build-or-sale');
    if (elem) centerField.removeChild(elem);

    var container = document.createElement('div');
    var sale = document.createElement('div');

    container.className = 'build-or-sale';
    sale.className = 'sale';

    container.appendChild(sale);

    //продажа только улиц
    if (streets[street].currentStreets === true) {
        //строительство домов и продажа домов и улице
        var build = document.createElement('div');
        build.className = 'build';
        container.appendChild(build);

        centerField.appendChild(container);

        //Кнопки
        build.onclick = function (e) {
            centerField.removeChild(container);
            prepareBuildingMenu(streets[street].color);
        }

        sale.onclick = function () {
            var names = getAllStreets(streets[street].color);
            if (names[2]) {
                if (streets[names[0]].currentHouses > 0 ||
                    streets[names[1]].currentHouses > 0 ||
                    streets[names[2]].currentHouses > 0) {
                    showMsg('Сначала продайте дома!', {color: 'black'}, 3000);
                    return;
                }
            } else {
                if (streets[names[0]].currentHouses > 0 ||
                    streets[names[1]].currentHouses > 0) {
                    showMsg('Сначала продайте дома!', {color: 'black'}, 3000);
                    return;
                }
            }

            var price = +target.querySelector('.money').innerHTML / 2;
            //поставить новое количество денег
            var newMoney = +money.innerHTML.split('$ ');
            newMoney += price;
            data[id]["money"] = newMoney;
            money.innerHTML = '$ '+newMoney;
            //владельца у улицы больше нет
            streets[street].owner = '-';

            data[id]["sale"] = street;
            data[id]["salePrice"] = price;
            var request = 'id='+id+'&position='+data[id]["position"];
            request +='&cell='+data[id]["cell"];
            request +='&thrown='+data[id]["cubes"];
            request +='&sale='+data[id]["sale"];
            request +='&salePrice='+data[id]["salePrice"];
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/publish?'+request, true);
            xhr.send();
            xhr.onload = function () {
                console.log('saling singular street'+this.responseText);
            }
            showCurrentStreets();
            centerField.removeChild(container);
        }
    } else if (!streets[street].currentStreets || streets[street].currentStreets >0) {
        //возможна только продажа, кнопка: продать
        centerField.appendChild(container);
        sale.onclick = function (e) {
            var price = +target.querySelector('.money').innerHTML / 2;
            console.log("==price of the street: "+price);
            //поставить новое количество денег
            var newMoney = +money.innerHTML.split('$ ');
            newMoney += price;
            data[id]["money"] = newMoney;
            money.innerHTML = '$ '+newMoney;
            //владельца у улицы больше нет
            streets[street].owner = '-';

            data[id]["sale"] = street;
            data[id]["salePrice"] = price;
            var request = 'id='+id+'&position='+data[id]["position"];
            request +='&cell='+data[id]["cell"];
            request +='&thrown='+data[id]["cubes"];
            request +='&sale='+data[id]["sale"];
            request +='&salePrice='+data[id]["salePrice"];
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/publish?'+request, true);
            xhr.send();
            xhr.onload = function () {
                console.log('saling singular street'+this.responseText);
            }
            showCurrentStreets();
            centerField.removeChild(container);
        }
    }
}

//Подготовка меню строительства к показу
function prepareBuildingMenu(color) {
    names = getAllStreets(color);
    var numberOfStreets = names.length;

    firstSpan.innerHTML = getNameFromDataname(names[0]);
    restoreClassList(firstSpan);
    firstSpan.classList.add(color);
    putRightHouses(names[0], 1);
    secondSpan.innerHTML = getNameFromDataname(names[1]);
    restoreClassList(secondSpan);
    secondSpan.classList.add(color);
    putRightHouses(names[1], 2);

    if (numberOfStreets == 2) {
        thirdBlock.style.visibility = 'hidden';
    } else { //иначе 3
        thirdSpan.innerHTML = getNameFromDataname(names[2]);
        restoreClassList(thirdSpan);
        thirdSpan.classList.add(color);
        putRightHouses(names[2], 3);
    }
    building.style.visibility = 'visible';
}
//восстановить старые значения классов
function restoreClassList(spanElement) {
    spanElement.className = '';
    spanElement.classList.add('streetname');
}

//Проставить правильное количество домиков, которые уже куплены
function putRightHouses(street, container) {
    if (container == 1) {
        firstHouse.value = streets[street].currentHouses;
        firstHotel.value = (streets[street].currentHotel)? 1 : 0;
    } else if (container == 2) {
        secondHouse.value  = streets[street].currentHouses;
        secondHotel.value  = (streets[street].currentHotel)? 1 : 0;
    } else if (container == 3) {
        thirdHouse.value  = streets[street].currentHouses;
        thirdHotel.value = (streets[street].currentHotel)? 1 : 0;
    }
    var counter = 0;
    if (streets[street].currentHotel) {
        counter = 4;
        setCounterForAnimation(counter, container);
        showAnimationOfFallingHouses(container);
    } else if (streets[street].currentHouses > 0) {
        for (var i=0; i<streets[street].currentHouses; i++) {
            showAnimationOfFallingHouses(container);
            counter++;
            setCounterForAnimation(counter, container);
        }
    }
}
//Форма по строительству домиков
//Глобальные переменные
var firstHousePlusButton = document.querySelector('.first-house-plus'),
    firstHouseMinusButton = document.querySelector('.first-house-minus'),
    secondHousePlusButton = document.querySelector('.second-house-plus'),
    secondHouseMinusButton = document.querySelector('.second-house-minus'),
    thirdHousePlusButton = document.querySelector('.third-house-plus'),
    thirdHouseMinusButton = document.querySelector('.third-house-minus'),
    firstHotelPlusButton = document.querySelector('.first-hotel-plus'),
    firstHotelMinusButton = document.querySelector('.first-hotel-minus'),
    secondHotelPlusButton = document.querySelector('.second-hotel-plus'),
    secondHotelMinusButton = document.querySelector('.second-hotel-minus'),
    thirdHotelPlusButton = document.querySelector('.third-hotel-plus'),
    thirdHotelMinusButton = document.querySelector('.third-hotel-minus'),
    containerOne = animContainer1.children,
    containerTwo = animContainer2.children,
    containerThree = animContainer3.children;


//анимация падающих домиков
function showAnimationOfFallingHouses(containerZ, mode) {
    var container;
    var counter;
    if (containerZ == 1) {
        container = containerOne;
        counter = animCounter1;
    } else if (containerZ == 2) {
        container = containerTwo;
        counter = animCounter2;
    } else if (containerZ == 3) {
        container = containerThree;
        counter = animCounter3;
    }
    if (!mode) {
        if (counter == 5) counter = 4;
        if (counter < 4) {
            if (container[counter].classList.contains('anim-house-reverse')) {
                container[counter].classList.remove('anim-house-reverse');
            }
            container[counter].classList.add('anim-house');
        } else if (counter == 4) {
            if (container[counter].classList.contains('anim-hotel-reverse')) {
                    container[counter].classList.remove('anim-hotel-reverse');
            }
            container[counter].classList.add('anim-hotel');
        }

        setCounterForAnimation(counter, containerZ);
    } else {
        if (counter <0) counter = 0;
        if (container[counter].classList.contains('anim-house')) {
            container[counter].classList.remove('anim-house');
            container[counter].classList.add('anim-house-reverse');
        } else if (container[counter].classList.contains('anim-hotel')) {
            container[counter].classList.remove('anim-hotel');
            container[counter].classList.add('anim-hotel-reverse');
        }

        setCounterForAnimation(counter, containerZ);
    }

}

function setCounterForAnimation(counter, containerZ) {

    if (containerZ == 1) {
        animCounter1 = counter;
    } else if (containerZ == 2) {
        animCounter2 = counter;
    } else if (containerZ == 3) {
        animCounter3 = counter;
    }
}

firstHouse.oninput =
secondHouse.oninput =
thirdHouse.oninput =  function () {
    if (this.value > 4) this.value = 4;
    if (this.value < 0) this.value = 0;
}
firstHotel.oninput =
secondHotel.oninput =
thirdHotel.oninput = function () {
    if (this.value > 1) this.value = 1;
    if (this.value <0) this.value = 0;
}


firstHousePlusButton.onclick = function (e) {
    e.preventDefault();
    if (+firstHouse.value == 4) {
        return;
    }
    if (thirdBlock.style.visibility == 'hidden') {
        if (+firstHouse.value+1 == +secondHouse.value+2) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+firstHouse.value+1 == +secondHouse.value +2 ||
            +firstHouse.value+1 == +thirdHouse.value +2) {
                showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
                return;
        }
    }

    showAnimationOfFallingHouses(1);
    animCounter1++;
    if (+firstHouse.value <4) {
        +firstHouse.value++ ;
    }
    showCurrentPrice();
}
firstHouseMinusButton.onclick = function (e) {
    e.preventDefault();
    if (+firstHouse.value == 0) return;
    if (thirdBlock.style.visibility == 'hidden') {
        if (+firstHouse.value-1 == +secondHouse.value-2) {
            showFourthMsg('Уберите дома с других улиц!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+firstHouse.value-1 == +secondHouse.value -2 ||
            +firstHouse.value-1 == +thirdHouse.value -2) {
                showFourthMsg('Уберите дома с других улиц!', {color: 'black'}, 1000);
                return;
        }
    }

    animCounter1--;
    showAnimationOfFallingHouses(1, 'u');
    if (+firstHouse.value>0) {
        +firstHouse.value--;
    }
    showCurrentPrice();
}

secondHousePlusButton.onclick = function (e) {
    e.preventDefault();
    if (+secondHouse.value == 4) {
        return;
    }
    if (thirdBlock.style.visibility == 'hidden') {
        if (+secondHouse.value+1 == +firstHouse.value+2) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+secondHouse.value+1 == +firstHouse.value +2 ||
            +secondHouse.value+1 == +thirdHouse.value +2) {
                showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
                return;
        }
    }

    showAnimationOfFallingHouses(2);
    animCounter2++;
    if (+secondHouse.value <4) {
        +secondHouse.value++ ;
    }
    showCurrentPrice();
}
secondHouseMinusButton.onclick = function (e) {
    e.preventDefault();
    if (+secondHouse.value == 0) return;
    if (thirdBlock.style.visibility == 'hidden') {
        if (+secondHouse.value-1 == +firstHouse.value -2) {
            showFourthMsg('Уберите дома с других улиц!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+secondHouse.value-1 == +firstHouse.value -2 ||
            +secondHouse.value-1 == +thirdHouse.value -2) {
                showFourthMsg('Уберите дома с других улиц!', {color: 'black'}, 1000);
                return;
        }
    }

    animCounter2--;
    showAnimationOfFallingHouses(2, 'u');
    if (+secondHouse.value>0) {
        +secondHouse.value--;
    }
    showCurrentPrice();
}

thirdHousePlusButton.onclick = function (e) {
    e.preventDefault();
    if (+thirdHouse.value == 4) {
        return;
    }
    if (+thirdHouse.value+1 == +secondHouse.value +2 ||
        +thirdHouse.value+1 == +firstHouse.value +2) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
        }
    showAnimationOfFallingHouses(3);
    animCounter3++;
    if (+thirdHouse.value <4) {
        +thirdHouse.value++ ;
    }
    showCurrentPrice();
}
thirdHouseMinusButton.onclick = function (e) {
    e.preventDefault();
    if (+thirdHouse.value == 0) return;
    if (+thirdHouse.value-1 == +firstHouse.value -2 ||
        +thirdHouse.value-1 == +secondHouse.value -2) {
            showFourthMsg('Уберите дома с других улиц!', {color: 'black'}, 1000);
            return;
        }
    animCounter3--;
    showAnimationOfFallingHouses(3, 'u');
    if (+thirdHouse.value>0) {
        +thirdHouse.value--;
    }
    showCurrentPrice();
}
//Кнопки к отелям
firstHotelPlusButton.onclick = function (e) {
    e.preventDefault();
    if (firstHotel.value == 1) return;
    if (thirdBlock.style.visibility == 'hidden') {
        if (+firstHouse.value<4 || +secondHouse.value < 4) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+firstHouse.value < 4 || +secondHouse.value < 4 || + thirdHouse.value < 4) {
                showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
                return;
        }
    }
    animCounter1 = 4;
    for (var i =0; i < 4; i++) {
        animCounter1--;
        showAnimationOfFallingHouses(1, 'u');
    }
    animCounter1 = 4;
    showAnimationOfFallingHouses(1);
     +firstHotel.value++;
     firstHouse.value = 4;
     showCurrentPrice();
}
firstHotelMinusButton.onclick = function (e) {
    e.preventDefault();
    if (firstHotel.value == 0)  return;
    showAnimationOfFallingHouses(1, 'u');
    animCounter1 = 0;
    for (var i = 0; i<4; i++){
        showAnimationOfFallingHouses(1);
        animCounter1++;
    }
    animCounter1 = 4;
    firstHouse.value = 4;
    +firstHotel.value--;
    showCurrentPrice();
}

secondHotelPlusButton.onclick = function (e) {
    e.preventDefault();
    if (secondHotel.value == 1) return;
    if (thirdBlock.style.visibility == 'hidden') {
        if (+firstHouse.value<4 || +secondHouse.value < 4) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+firstHouse.value < 4 || +secondHouse.value < 4 || + thirdHouse.value < 4) {
                showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
                return;
        }
    }
    animCounter2 = 4;
    for (var i =0; i < 4; i++) {
        animCounter2--;
        showAnimationOfFallingHouses(2, 'u');
    }
    animCounter2 = 4;
    showAnimationOfFallingHouses(2);
     +secondHotel.value++;
     secondHouse.value = 4;
     showCurrentPrice();
}
secondHotelMinusButton.onclick = function (e) {
    e.preventDefault();
    if (secondHotel.value == 0)  return;
    showAnimationOfFallingHouses(2, 'u');
    animCounter2 = 0;
    for (var i = 0; i<4; i++){
        showAnimationOfFallingHouses(2);
        animCounter2++;
    }
    animCounter2 = 4;
    secondHouse.value = 4;
    +secondHotel.value--;
    showCurrentPrice();
}
thirdHotelPlusButton.onclick = function (e) {
    e.preventDefault();
    if (thirdHotel.value == 1) return;

    if (+firstHouse.value<4 || +secondHouse.value < 4 || +thirdHouse.value < 4) {
            showFourthMsg('Постройте дома на других улицах!', {color: 'black'}, 1000);
            return;
    }

    animCounter3 = 4;
    for (var i =0; i < 4; i++) {
        animCounter3--;
        showAnimationOfFallingHouses(3, 'u');
    }
    animCounter3 = 4;
    showAnimationOfFallingHouses(3);
     +thirdHotel.value++;
     thirdHouse.value = 4;
     showCurrentPrice();
}
thirdHotelMinusButton.onclick = function (e) {
    e.preventDefault();
    if (thirdHotel.value == 0)  return;
    showAnimationOfFallingHouses(3, 'u');
    animCounter3 = 0;
    for (var i = 0; i<4; i++){
        showAnimationOfFallingHouses(3);
        animCounter3++;
    }
    animCounter3 = 4;
    thirdHouse.value = 4;
    +thirdHotel.value--;
    showCurrentPrice();
}
//Глобальные переменные
var currentSum,
    newSum,
    price,
    total = document.querySelector('.totalprice');

 function showCurrentPrice() {
     var firstHouseValue = +streets[names[0]].currentHouses || 0;
     var firstHotelValue = +streets[names[0]].currentHotel || 0;
     var secondHouseValue = +streets[names[1]].currentHouses || 0;
     var secondHotelValue = +streets[names[1]].currentHotel || 0;
     var currentSum = firstHouseValue + firstHotelValue + secondHouseValue + secondHotelValue;

     //новая сумма, вместе с покупками
    var newSum = +firstHouse.value + (+firstHotel.value) + (+secondHouse.value) + (+secondHotel.value);

     if (names[2]) {
         var thirdHouseValue = +streets[names[2]].currentHouses || 0;
         var thirdHotelValue = +streets[names[2]].currentHotel || 0;
         currentSum += thirdHouseValue + thirdHotelValue;
         //новая сумма, вместе с покупками
         newSum += (+thirdHouse.value + +thirdHotel.value);
     }
     price = +streets[names[0]].priceOfHouse;
     //сумма текущих построек

    if (newSum > currentSum) { //если покупает
        var result = (parseInt(newSum) - parseInt(currentSum)) * price;
        total.innerHTML = '-'+ result;
        if (parseInt(money.innerHTML.split('$ ').join('')) < +result) {
            showFourthMsg('А деньги вы свои считали?!', {color: 'red'}, 4000);
        }
    } else { //продаёт
        var result = (parseInt(currentSum)-parseInt(newSum))*(price/2);
        total.innerHTML = '+'+ result;

    }
}
//При подтверждении формы
building.onsubmit = function (e) {
    e.preventDefault();

    var request = 'id='+id+'&cell='+data[id]["cell"];
    request += '&position='+data[id]["position"]+'&thrown='+data[id]["cubes"];
    //текущие значения
    var firstHouseValue = +streets[names[0]].currentHouses || 0;
    var firstHotelValue = +streets[names[0]].currentHotel || 0;
    var secondHouseValue = +streets[names[1]].currentHouses || 0;
    var secondHotelValue = +streets[names[1]].currentHotel || 0;
    price = +streets[names[0]].priceOfHouse;

    //сумма текущих построек
    currentSum = firstHouseValue + firstHotelValue + secondHouseValue + secondHotelValue;
    //новая сумма, вместе с покупками
    newSum = +firstHouse.value + (+firstHotel.value) + (+secondHouse.value) + (+secondHotel.value);

    if (names.length == 2) { //только две улицы
        if (+firstHouse.value > firstHouseValue ||
            +secondHouse.value > secondHouseValue ||
            +firstHotel.value > firstHotelValue ||
            +secondHotel.value > secondHotelValue) {
            var whatIwant = (newSum - currentSum) * price;
            whatIwant += 'm';
        } else { //наоборот продано
            var whatIwant = (currentSum - newSum) * (price / 2);
            whatIwant +='p'
        }
        request += '&houseBuild='+names[0]+'e1';
        var temp = (firstHotel.value ==1)?'1hotel' : firstHouse.value +'houses';
        request += temp+'e5'+names[1]+'e1';
        temp = (secondHotel.value == 1)?'1hotel' : secondHouse.value+'houses';
        request += temp;
        request += '&buildPrice='+whatIwant;
    } else if (names.length == 3) { // три улицы
        //текущие значения
        var thirdHouseValue = +streets[names[2]].currentHouses || 0;
        var thirdHotelValue = +streets[names[2]].currentHotel || 0;
        //сумма старых купленных
        currentSum += thirdHouseValue + thirdHotelValue;

        //новая сумма, вместе с покупками
        newSum += (+thirdHouse.value + +thirdHotel.value);
        if (+firstHouse.value > firstHouseValue ||
            +secondHouse.value > secondHouseValue ||
            +firstHotel.value > firstHotelValue ||
            +secondHotel.value > secondHotelValue ||
            +thirdHouse.value > thirdHouseValue ||
            +thirdHotel.value > thirdHotelValue) {
            //хочет купить дома или отели
            var whatIwant = (newSum - currentSum) * price;
            whatIwant += 'm';
        } else {
            //продаётся
            var whatIwant = (currentSum - newSum) * (price / 2);
            whatIwant +='p';
        }
        request += '&houseBuild='+names[0]+'e1';
        var temp = (firstHotel.value ==1)?'1hotel' : firstHouse.value +'houses';
        request +=temp+'e5'+names[1]+'e1';
        temp = (secondHotel.value == 1)?'1hotel' : secondHouse.value+'houses';
        request += temp+'e5'+names[2]+'e1';
        temp = (thirdHotel.value == 1)?'1hotel' : thirdHouse.value + 'houses';
        request +=temp;
        request += '&buildPrice='+whatIwant;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/publish?'+request, true);
    xhr.send();
    xhr.onload = function () {
        console.log('---------Buildings have been bought');
        console.log(this.responseText);
    }
    newSum = currentSum = price = 0;
    building.style.visibility = 'hidden';
    //все домики и отели убрать, счётчики сбросить для каждого блока
    restoreBuildingForm();

}

//Восстанавливает исходное состояние формы строительства
function restoreBuildingForm() {
    var container = 1;
    while (container < 4) {
        var counter = 5;
        setCounterForAnimation(counter, container);
        for (var i = 0; i < 5; i++) {
            counter--;
            setCounterForAnimation(counter, container);
            showAnimationOfFallingHouses(container, 'u');
        }
        container++;
    }

}
