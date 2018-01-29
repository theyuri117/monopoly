var id,                     //Id �������� � �������
    data = {},              // ������ � �������
    currentIcon = document.createElement('div'), //��������� ������
    opponents = {},
    escapeFromPrison = false,               //������� ���
    prisonEscapeCounter = 3,        //������� �� ��� ����
    lastId,                         //id ���������� ����������
    auctionForm = document.forms.auction,
    auctionValue = auctionForm.elements.mainvalue,
    auctionObject = {},
    plusOneButton = document.getElementById('plusone'),
    plusFiveButton = document.getElementById('plusfive'),
    plusTenButton = document.getElementById('plusten'),
    plusFiftyButton = document.getElementById('plusfifty'),
    savedTurn,                  //���������� ����� ��������� ��� ��� ���, id
    auctionTimer,                   //������ �� ����������� ��������
    info = document.querySelector('.info'),
    houseSrc,               //����� ��� �������
    hotelSrc,               //����� ��� ������
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

//����� �������� ������
var throwingSound = [{start: 0  , duration: 1200},
  {start: 2.2 , duration: 1200},
  {start: 3.6 , duration: 1200},
{start: 5.6, duration: 1200}];

var shakingSound = [ {start: 0 , duration:1100 },			//������� ���
{start: 1.6 , duration: 1100},
{start: 8.1 , duration: 1000},
{start:  11.1, duration: 1000},
{start: 13.7 , duration:1200 },
{start: 21.8, duration: 1000},
{start:  24.4, duration: 1200}];

//�������� "����"
var chance = ['����������� �� ��. �����.',
              '������� �� ��� ���� �����.',
             '��� �� ���� ���Ш�. (������ $200)',
            '�� ���������! ����������� ����� � ������! �� �� ��������� ���� ���Ш� � �� ��������� $200.',
            '���� ������� ������������� ������ ����������. ������� ������� ������ �� $50.',
            '����������� �� ��������� ������������ �����������. ���� ��� ������ �� �����������, ������ ��������� � ���� � ������ ���. ���� ��� �������� �������������� ������� ������, ������ ������ � ������� ��������� �����, ������ ����� �������� �����, ���������� �� 10.',
            '����� �� �������������. ������ $150',
            '����������� �� ��������� �������. ���� ��� ������ �� �����������, ������ ��������� � ���� � ������ �. ���� ��� �������� �������������� ������� ������, ������� ��������� ����� � ��� ���� ������ �������',
            '���� ����������� ���� ��������� � ������� $50.',
            '����������� ������ ���� ����� �������������. ������� $25 �� ������ ��� � $100 �� ������ �����.',
            '����������� �� ������� �����������. ���� �� ��������� ���� ���Ш�, ������ $200.',
            '����������� �� ��������� �������. ���� ��� ������ �� �����������, ������ ��������� � ���� � ������ �. ���� ��� �������� �������������� ������� ������, ������� ��������� ����� � ��� ���� ������ �������',
            '��������� �� ������� �������� ������. ������ $200 ���� ��������� ���� ���Ш�.',
            '����� �� ���������� �������� $15.',
            '����������� �� ��. �������. ������ $200, ���� ��������� ���� ���Ш�.',
            '����� �� ������ ���������. ��� �������� ����� ��������� �� ������� ��� ��������'];
//�������� "������������ �����"
var community = ['������ $25 �� ������������.',
                '���� ��������. ������ � ������� �� $10 �� ������� ������.',
                '����� �� ������ ���������. ��� �������� ����� ��������� �� ������� ��� ��������.',
                '������� ����������� ������. ������ $25.',
                '�� ������ ��������������� �����: ������� $40 �� ������ ��� � $115 �� ������ ����� � ����� �������������.',
                '������� �� ������� � ��������. ������� $100.',
                '�� ������� ����� �� ������������� $50.',
                '��� �� ���� ���Ш�. (������ $200)',
                '������� �� ������� � �����. ������� $50.',
                '�� ���������! ����������� ����� � ������. �� �� ��������� ���� ���Ш� � �� ��������� $200.',
                '�� ��������� � ���������� $100.',
                '�� �����(�) ������ ����� �� �������� �������! ������ $10.',
                '���������. ������ $100.',
                '���������� ������ � ���� ������. ������ $200.',
                '������� ���������. ������ $100.',
                '������� �� ��������. ������� $50'];


document.body.ondragstart = function () {
    return false;
}
document.body.onselectstart = function () {
    return false;
}

//������: ������������
var connectButton = document.createElement('button');
connectButton.innerHTML = '������������';
connectButton.className = 'connect';

centerField.appendChild(connectButton);

connectButton.onclick = function (e) {
    var nameOfPerson = prompt('������� ���� ���:', '');
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

//����� �������
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

    //��������� �������� ������
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

    //�������� �� ������?
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
                        showMsg('�������� ������ ������, ��� ��� ������', {color: 'red'});
                    }
                    var chosen = getChosen(iconName);
                    chosen.style.visibility = 'hidden';
                }
            }
    }

    //���������� ��������� ������
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
//���������� ���� ������ ����� ��� �������
function choosePlayingHomes() {
    var first = document.querySelector('.first-style');
    var second = document.querySelector('.second-style');

    chooseHomes.style.visibility = 'visible';
    showAnotherMsg('� �������� ����� �������', {color: 'blue'}, 4000);

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
//���������� ����������
var message = document.createElement('span'),
    message2 = document.createElement('span'),
    message3 = document.createElement('span'),
    message4 = document.createElement('span'),
    timer, timer2, timer3, timer4;

message.className = 'message';
message2.className = 'message2';
message3.className = 'message3';
message4.className = 'message4';

//�������� ���������
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
//���������� ������ ��������� ����
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
//���������� 3� ���������
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
//������� ��������� ������ ���������
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
//���������� �������� ������
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
//���������� ������ ����������� ������
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

//������� � ����������� �� ����
function getPositionFromCell(cell) {
    var place = cell.querySelector('.place-to-stand');
    var coords = place.getBoundingClientRect();
    var x = coords.left + window.pageXOffset;
    var y = coords.top + window.pageYOffset;
    return Math.round(x) + ':' + Math.round(y);
}

//��������� ����� ������, ���������� � c���
function numberToCell(number) {
    var tds = document.querySelectorAll('.cell');
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].dataset.number == number) return tds[i];
    }
}

//��������� �� ��������� �������
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
//����������� �������
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
//������� ����������
function createOpponents () {
    for (var key in data) {
        opponents[key] = document.createElement('div');
        opponents[key].className = data[key].icon == 'train' ? 'train-icon' : data[key].icon;
        opponents[key].style.position = 'absolute';
    }
}

//���������� ����������
var thrown = document.createElement('div'), //������� ����� ����.
    cubes = centerField.querySelector('.cubes'), //��������� �����
    chanceThrowing = false;         //�������� ��� �����

thrown.className = 'thrown';

//�������� ������� ������ ����
function startGame() {
    showMsg('�������� ������, ������� �� ���', {color: 'red'}, 3500);

    var firstTime = true;               //������� ����� ������ ���


//������� �����
  cubes.onclick = function (e) {
    if (data[id]["isDead"] || !data[id]["turn"]) return;
    //������� ��������� � ��������
    var findContainer = document.querySelector('.build-or-sale');
    if (findContainer) {
        findContainer.parentNode.removeChild(findContainer);
    }


    var promise = new Promise(function(resolve, reject){
      //����
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

            showMsg('��������� ������ ������ '+ data[id].cubes, {color: 'black'}, 2000);

            if (data[id]["turn"]) {
            showAnotherMsg('�� ��������! �������� ��� ���.', {color: 'red'}, 4000);
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
                  //��� ����� ����� ��������� ������ ���� ������ ������ ��� ������

                  console.log("Trying to escape");

                  //����� �� ����� ��� ��� �� ������ ���������� �� ����� 2 �������
                  data[id]["turn"] = false;
                  var timer = setTimeout(function () {
                      data[id]["turn"] = true;
                  }, 2000);

                  //�������� ���������� ��� ���������
                  var result = thrownResult.split(':');

                  showMsg("�� ��������� "+thrownResult, {color: 'black'}, 3000);

                  //���� ��������� �����, ��...
                  if (result[0] == result[1]) {
                      console.log('Successfull escape!');

                      //�������� �������������� ����
                      clearTimeout(timer);

                      // //���������, ��� ������� �����
                      showAnotherMsg('������� ����� �� ������!', {color: 'black'}, 3000);

                      //�������� ������� ������� ������
                      prisonEscapeCounter = 3;

                      //�������� ����� ������� �� ����������� �������
                      var newPosition = getPositionFromThrownResult(thrownResult);

                      //������������ �� ������ ����� ������� ������
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
                      //��������� ���� ������. ����� ����������
                      xhr.open('GET', '/publish?'+request, true);
                      xhr.send();
                      xhr.onload = function () {
                          console.log(this.responseText);
                      }

                  } else {                            //���������� ������ ������
                      console.log('Not successfull escape!');
                      //������� ������� ������� �� 1 ������
                      prisonEscapeCounter--;

                      //�������� ���������, ��� �������� �������� �����
                      if (prisonEscapeCounter==1) {
                          showAnotherMsg('��������! �������� ��������� �������.', {color: 'black'}, 3000);
                      } else if (prisonEscapeCounter > 1) {
                          showAnotherMsg('��������! �������� '+prisonEscapeCounter+' �������', {color: 'black'}, 3000);
                      }

                      if (prisonEscapeCounter == 0) {
                          //�������� ������� ������� ������
                          prisonEscapeCounter = 3;

                          //��������� ���������� ���� ���� ��� ���� ������ ���� ��������
                          clearTimeout(timer);

                          //�������� ����� ������� �� ����������� �������
                          var newPosition = getPositionFromThrownResult(thrownResult);

                          //������������ �� ������ ����� ������� ������
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

              } else { //������� ������ �������
                  console.log('USUAL throwing of cubes');
                  //�������� ����� �������
                  var newPosition = getPositionFromThrownResult(thrownResult);

                  //������������ ������
                  var request = 'id='+id+'&thrown='+thrownResult;

                  //���� ����� �������� toPrison
                  if (data[id]["toPrison"]==true) {
                      //�������� ���������� ������ ������
                      var coords = numberToCell(11).querySelector('.place-to-stand').getBoundingClientRect();

                      //�������� � ������� �������� ������ ������ � ������ 11
                      request+='&position='+`${coords.left+window.pageXOffset}:${coords.top+window.pageYOffset}`+'&toPrison='+true+'&cell=11';

                      //������� �������� toPrison
                      delete data[id]["toPrison"];
                  } else {
                      //��������� ������� ������� � ������
                      request += '&position='+newPosition+'&cell='+data[id]["cell"];
                  }

                  //���� ���� ��������
                  if (data[id]["giveMoney"]) {
                      //� ������� �������� ��� ��������
                      request += '&giveMoney=true';
                  }
                  if (data[id]["badCell"]) {
                      request += '&badCell=' + data[id]["badCell"];
                  }
                  //���� ����� �������� "���� ��������� �� ������"
                  if (data[id]["payForPrison"]) {
                      //�������� ��� � �������
                      request += '&payForPrison=true&toPrison=false';
                  }
                  if (data[id]["street"]) {
                      request += '&street='+true;
                  }
                  //���� ����� ������ - ����
                  if (data[id]["chance"]) {
                      request +='&chance=true';
                  }
                  //���� ����� ������ - ������������ �����
                  if (data[id]["community"]) {
                      request += '&community=true';
                  }
                  //���� ������������ ���� �� �������� ������ �� ������
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
//��������� ��������� ���� �������� ������
function playSoundAndAnimation(resolve2) {
  //��������
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
//����������� �� ���������� ��������
function subscribe() {
    console.log('subscribed');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/subscribe?id='+id, true);
    xhr.send();

    //�������� ������, �� ������ ��� ������� ���������
    xhr.onload = function () {
        if (this.status == 200) {
            try {
                data = JSON.parse(this.responseText);
            } catch(e) {
                console.log(this.responseText + '\n'+e);
            }
        }

        //�������� id ���������� ����������
        getLastId();

        if (data[lastId]["auction"]) {
            //�������� ����������� ����
            showFourthMsg('������� �� '+getNameFromDataname(data[lastId]["forStreet"]), {color: 'black'}, 4000);
            //������� ����� �������
            auctionForm.style.visibility = 'visible';
            var cap = auctionForm.querySelector('.bigger');
            cap.style.display = 'none';
            //�������� �������� � ���������
            auctionValue.value = 11;

            //��������� ������ �� ������� ����
            runAuctionTimer();

            //��������� ��� ��� ��� �� ������ ��������
            for (var key in data) {
                if(data[key]["turn"]) savedTurn = key;
            }
            //��������� �������� ������ ����
            for (var key in data) {
                data[key]["turn"] = false;
            }
            //� ����������� �� ���������� � ��������
            subscribeAuction();
        } else {
            if (!data[id]["isDead"]) {
                subscribe();
                setChanges();
            } else {
                data[id]["turn"] = false;
                opponents[id].parentNode.removeChild(opponents[id]);
                showMsg('�� ���������...', {color: 'red'}, 15000);
            }

        }
    }
    xhr.onerror = function () {
        subscribe();
        showMsg('����������������...', {color: 'black'}, 4000);
    }
}
//���������� � ��������
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
                //�������� �����
                auctionForm.style.visibility = 'hidden';
                if (auctionObject["id"]) {
                    var buyer = auctionObject["id"];
                    showFourthMsg('������� '+data[buyer]["name"]+' �� '+auctionObject["price"], {color: 'black'}, 4000);
                    data[auctionObject["id"]]["bought"] = auctionObject["street"];
                    setNewStreetOwner();
                } else {
                    showFourthMsg('���������� �����', {color: 'black'}, 4000);
                }
                //������������ ���
                data[savedTurn]["turn"] = true;
                //�������� ��������� - ��� �����
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

//���������� ����������� �� ��������
function showAuctionChanges() {
    //���������� ���������� ������
    clearInterval(auctionTimer);

    //��������� ������ �� �����
    runAuctionTimer();

    //���������� ���-������� ���������
    if (auctionObject["price"]==10) {
        showFourthMsg('��������� ���� 10. ��� ���� ������?', {color: 'black'}, 4000);
    } else {
        var idOfPerson = auctionObject["id"];
        var message = getRandomAuctionMessage();
        var cap = auctionForm.querySelector('.bigger');
        if (idOfPerson == id) {
            cap.style.display = 'block';
            showFourthMsg('�� ���� '+auctionObject["price"]+'. ��� ������?', {color: 'black'},4000);
        } else {
            cap.style.display = 'none';
            showFourthMsg(data[idOfPerson]["name"]+message+auctionObject["price"]+'. ��� ������?', {color: 'black'},4000);
        }

        auctionValue.value = auctionObject["price"];
    }
    //������ ��������� ���� �� 1 ������
    auctionValue.value = +auctionValue.value + 1;
}
//��������� ������ ��� ��������� ������� ��������
function runAuctionTimer() {
    //������� ��������� �� ��������
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
//��������� ��� ��������
function getRandomAuctionMessage() {
    var arr = [' ������� �� ��� ', ' ����� ������ ��� �� '];
    return arr[getRandomInt(0, arr.length)];
}
// ������� ���������
function setChanges() {
    if (data[id]["turn"]) console.log('------turnOPENED');
        //���� ������ � ������
        if (data[lastId]["toPrison"]) {
            showPrisonMsg();

            //������� ��� ������� ��������
            showThrownNumber();

        } else {
            if (!data[lastId]["sale"]) {
                //������� ��� ������� ��������
                showThrownNumber();
                //���� ��������� �����
                showDiceThrown();
            } else {
                if (id != lastId) {
                    showFourthMsg(data[lastId]["name"] + ' ������ '+getNameFromDataname(data[lastId]["sale"]), {color: 'black'}, 4000);
                }

            }

        }
        if (data[lastId]["street"]
            && id != lastId) {
            showFourthMsg(data[lastId]["name"]+' ����������� ��� ������ � ������', {color: 'black'}, 4000);
        } else {
            //��� ������� ���������
            showWhoIsNext();
        }



        //���� � � ������ � ��� ���, �� �������� ���� ������
        showPrisonMenu();

        //�������� ������� ����� � ��������
        showMoney();

        //��������� �� ����� ������� last
        setNewPosition();

        //���� ������ ���� ������, �� �������� +200
        giveMoneyIfForwardPassed();

        //���� �������� �� ������ ������ -
        getMoneyFromIfBadCell();

        //���� ����� �������� �����
        showBuyMenu();

        //���� ���-�� ���-�� �����
        showWhatWasBought();
        //���������� ������ ��������� �����
        setNewStreetOwner();

        //��� ���� � ������� ��������
        showIfRentWasPaid();

        //�������� ������ ������� �������
        showCurrentStreets();

        //�������� ��������� �������������
        showBuildHouses();

        //���� ��������� �������� ��� ���� ������
        checkIfIsDead();

        //���� �������� �� ���� ��� ������������ �����- �������� ��� ��������
        showChanceMsg();
        showCommunityMsg();

        //�������� �������������, ���� �����
        clearOwnIfDead();
}
//����������� ��� ������������� �����, ���� ����� ������������
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
//���������� ����������
var showCardText = document.querySelector('.show-card .text'),
    showCardApplyButton = document.querySelector('.show-card .apply'),
    smallCommunityCard = document.querySelector('.maincommunitycard'),
    smallChanceCard = document.querySelector('.mainchancecard'),
    bigRequest,
    bigXhr,
    sendRequest = true,
    showCommunityCard = false,
    showChanceCard = false;

//���� �������� �� ����
function showChanceMsg() {
    showMsg();
    function showMsg() {
        if (lastId == id || !data[lastId]["chance"]) return;
        switch(+data[lastId]["chance"]) {
            case 0:
                showFourthMsg(data[lastId]["name"]+' ������������ �� ��. �����', {color: 'black'}, 4000);
                break;
            case 1:
                showFourthMsg(data[lastId]["name"]+' �������� �� 3 ���� �����', {color: 'black'}, 4000);
                break;
            case 2:
                showFourthMsg(data[lastId]["name"]+' ��� �� ���� ���Ш�', {color: 'black'}, 4000);
                break;
            case 3:
                showFourthMsg(data[lastId]["name"]+' ��������� � ������������ � ������', {color: 'black'}, 4000);
                break;
            case 4:
                showFourthMsg(data[lastId]["name"]+' ������� �������������. �� ������ ������� �� 50', {color: 'black'}, 4000);
                break;
            case 5:
                showFourthMsg(data[lastId]["name"]+' ���������� �� ��������� ������������ �����������', {color: 'black'}, 4000);
                break;
            case 6:
                showFourthMsg(data[lastId]["name"]+' ������� 150 � ����� �� �������������', {color: 'black'}, 4000);
                break;
            case 7:
                showFourthMsg(data[lastId]["name"]+' ���������� �� ��������� �������', {color: 'black'}, 4000);
                break;
            case 8:
                showFourthMsg(data[lastId]["name"]+' ������� ��������� �� ����� � ������� 50', {color: 'black'}, 4000);
                break;
            case 9:
                showFourthMsg(data[lastId]["name"]+' �������������� ��� ���� �������������', {color: 'black'}, 4000);
                break;
            case 10:
                showFourthMsg(data[lastId]["name"]+' ������������ �� ��. �����������', {color: 'black'}, 4000);
                break;
            case 11:
                showFourthMsg(data[lastId]["name"]+' ���������� �� ��������� �������. ������ ����� � ��� ���� ������', {color: 'black'}, 4000);
                break;
            case 12:
                showFourthMsg(data[lastId]["name"]+' ����� �������� �� ������� �������� ������', {color: 'black'}, 4000);
                break;
            case 13:
                showFourthMsg(data[lastId]["name"]+' ������� ����� 15 �� ���������� ��������', {color: 'black'}, 4000);
                break;
            case 14:
                showFourthMsg(data[lastId]["name"]+' ���������� �� ��. �������', {color: 'black'}, 4000);
                break;
            case 15:
                showFourthMsg(data[lastId]["name"]+' ������� �������� "����� �� ������ ���������"', {color: 'black'}, 4000);
                break;
        }
    }
    if (data[lastId]["chance"] || data[lastId]["chance"] ===0) data[id]["turn"] = false;
    if (+data[id]["chance"] || data[id]["chance"]===0) {} else return;

    playChanceBeforeAnimation();
    //���
    bigRequest = 'id='+id+'&thrown='+data[id]["cubes"];
    bigXhr = new XMLHttpRequest();
    var setPosition = true;
    switch(+data[id]["chance"]) {
        case 0:
            //����������� �� ��. �����
            bigRequest += goTo(40);
            bigRequest += payRentOrBuy(40);
            setPosition = false;
            break;
        case 1:
            //������� �� ��� ���� �����
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
            //��� �� ���� �����, ������ 200
            bigRequest += goTo(1);
            bigRequest += '&giveMoney=true';
            setPosition = false;
            break;
        case 3:
            //����������� ����� � ������
            bigRequest += goTo(11);
            bigRequest += '&toPrison=true';
            setPosition = false;
            break;
        case 4:
            //���� ������� �������������, ������� ������� �� 50
            bigRequest += '&money=d';
            break;
        case 5:
            //����������� �� ��������� ������������ �����������, ���� * 10
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
            //����� �� �������������. ������ 150
            bigRequest += '&money=150p';
            break;
        case 11:
        case 7:
            //����������� �� ��������� �������. ����� � ��� ���� ������
            //������ ����� 37 23 8
            //16 36 26 6 - ������
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
            //���� ����������� ���� ��������� � ������� 50
            bigRequest += '&money=50p';
            break;
        case 9:
            //����������� ������ ���� �������������
            //25 �� ��� � 100 �� �����
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
            //����������� �� ������� �����������. ���� ��������� ����
            //����� - ������ 200.
            if (data[id]["cell"] == 37) {
                bigRequest += '&giveMoney=true';
            }
            bigRequest += goTo(25);
            bigRequest += payRentOrBuy(25);
            setPosition = false;
            break;
        case 12:
            // ��������� �� ������� �.�. ������ 200 ���� ��������� ����
            // �����
            bigRequest += '&giveMoney=true';
            bigRequest += goTo(6);
            bigRequest += payRentOrBuy(6);
            setPosition = false;
            break;
        case 13:
            //����� �� ���������� �������� - 15
            bigRequest += '&money=15m';
            break;
        case 14:
            //����������� �� ��.�������. +200, ���� ������ �.�����
            if (data[id]["cell"] != 8) {
                bigRequest += '&giveMoney=true';
            }
            bigRequest += goTo(12);
            bigRequest += payRentOrBuy(12);
            setPosition = false;
            break;
        case 15:
            //����� �� ������ ���������
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
//����������� ��. ���������� ������ ��� �������
function goTo(cellNumber) {
    data[id]["cell"] = cellNumber;
    var cell = numberToCell(cellNumber);
    var position = getPositionFromCell(cell);
    var request = '&cell=' + cellNumber;
    request += '&position='+position;
    data[id]["position"] = position;
    return request;
}
//��������� ����� ��� ������� ������ � �������
function payRentOrBuy(number, str) {
    var street = numberToDataname(number);
    var request = '';
    if (streets[street].owner != '-' &&
        streets[street].owner != id &&
        streets[street].owner != false) {
            if (str) {
                //���� ����� � ��� ���� ������
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
//���� �������� �� ������������ �����
function showCommunityMsg() {
    showMsg();
    function showMsg() {
        if (id == lastId || !data[lastId]["community"]) return;
        switch (+data[lastId]["community"]) {
            case 0:
                showFourthMsg(data[lastId]["name"]+' ������� 25 �� ������������', {color: 'black'}, 4000);
                break;
            case 1:
                showFourthMsg(data[lastId]["name"]+' ������� �� 10 �� ������� ������ � �������', {color: 'black'}, 4000);
                break;
            case 2:
                showFourthMsg(data[lastId]["name"]+' ������� �������� "����� �� ������ ���������"', {color: 'black'}, 4000);
                break;
            case 3:
                showFourthMsg(data[lastId]["name"]+' ������� 25 - ������� ����������� ������', {color: 'black'}, 4000);
                break;
            case 4:
                showFourthMsg(data[lastId]["name"]+' �������������� ��� ���� �������������', {color: 'black'}, 4000);
                break;
            case 5:
                showFourthMsg(data[lastId]["name"]+' ������� � �������� �� 100', {color: 'black'}, 4000);
                break;
            case 6:
                showFourthMsg(data[lastId]["name"]+' ��������� �� ������� ����� 50', {color: 'black'}, 4000);
                break;
            case 7:
                showFourthMsg(data[lastId]["name"]+' ��� �� ���� ���Ш�', {color: 'black'}, 4000);
                break;
            case 8:
                showFourthMsg(data[lastId]["name"]+' ������� � ����� �� 50', {color: 'black'}, 4000);
                break;
            case 9:
                showFourthMsg(data[lastId]["name"]+' ��������� � ������������ � ������', {color: 'black'}, 4000);
                break;
            case 10:
                showFourthMsg(data[lastId]["name"]+' ������� � ���������� 100', {color: 'black'}, 4000);
                break;
            case 11:
                showFourthMsg(data[lastId]["name"]+' ����� ������ ����� �� �������� ������� � ������� 10', {color: 'black'}, 4000);
                break;
            case 12:
                showFourthMsg(data[lastId]["name"]+' ���� � ������ � �������� 100', {color: 'black'}, 4000);
                break;
            case 13:
                showFourthMsg('���������� ������ � ������ '+data[lastId]["name"]+'. �������� 200. ', {color: 'black'}, 4000);
                break;
            case 15:
                showFourthMsg(data[lastId]["name"]+' �������� 50 �� ��������.', {color: 'black'}, 4000);
                break;
            case 14:
                showFourthMsg(data[lastId]["name"]+' ������� 100. ������� ���������', {color: 'black'}, 4000);
                break;
        }
    }
    if (data[lastId]["community"] || data[lastId]["community"] === 0) data[id]["turn"] = false;
    if (+data[id]["community"] || data[id]["community"]=== 0) {} else return;

    playCommunityBeforeAnimation();
    //���
    bigRequest = 'id='+id+'&thrown='+data[id]["cubes"];
    bigXhr = new XMLHttpRequest();
    var setPosition = true;
    switch(+data[id]["community"]) {
        case 0:
            //������ 25 �� ������������
            bigRequest += '&money=25p';
            break;
        case 1:
            //���� ��������, ������ �� 10 �� ������� ������
            bigRequest += '&money=b';
            break;
        case 2:
            //����� �� ������ ���������
            bigRequest += '&freeCommunityCard=true';
            showCommunityCard = true;
            break;
        case 3:
            //������� ����������� ������. ������ 25
            bigRequest += '&money=25p';
            break;
        case 4:
            //������ ����. 40 �� ���, 115 �� �����
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
            //������� �� �������. ������� 100
            bigRequest += '&money=100m';
            break;
        case 6:
            //�� ������� ����� �� ������������� 50
            bigRequest += '&money=50p';
            break;
        case 7:
            //��� �� ���� �����, ������ 200
            bigRequest += goTo(1);
            bigRequest += '&giveMoney=true';
            setPosition = false;
            break;
        case 8:
            //������� �� ������� � �����, ������� 50
            bigRequest += '&money=50m';
            break;
        case 9:
            //�� ���������
            bigRequest += goTo(11);
            bigRequest += '&toPrison=true';
            setPosition = false;
            break;
        case 10:
            //��������� � ���������� 100
            bigRequest += '&money=100p';
            break;
        case 11:
            //������ ����� �� �������� �������, ������ 10
            bigRequest += '&money=10p';
            break;
        case 12:
            //���������, ������ 100
            bigRequest += '&money=100p';
            break;
        case 13:
            //���������� ������ � ���� ������, ������ 200
            bigRequest += '&money=200p';
            break;
        case 14:
            //������� ���������, ������ 100
            bigRequest += '&money=100p';
            break;
        case 15:
            //������� �� ��������, ������� 50
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
        showMsg('�������� ������!', {color: 'black'}, 4000);
    }

}
//��� ������� ��������
function setAnimation1(elem) {
    elem.style.animation = 'move 2s';
    elem.style.animationFillMode = 'forwards';
    elem.style.animationDelay = '2s';
}
//��� ������ ��������
function setAnimation2(elem) {
    elem.style.animation = 'move2 2s';
    elem.style.animationFillMode = 'forwards';
}
//����� ������ ���������� � dataname
function numberToDataname (number) {
    var sels = document.querySelectorAll('.sell');
    for (var i = 0; i <sels.length; i++) {
        if (sels[i].dataset.number == number) return sels[i].dataset.sname;
    }
}
//���������� ��������� ���� � �����
function showBuildHouses() {
  if (!data[lastId]["houseBuild"]) return;

  var streetsAndHouses = data[lastId]["houseBuild"].split('e5');
  streetsAndHouses.forEach(function (item) {
      item = item.split('e1');
      //�������� ����� ��� ����� �� ������
      var street = item[0];
      var placeForHouses = getCellFromDataname(street).querySelector('.houses');
      var children = placeForHouses.children;
        //���� ���� ����, �� ������� ������� ���
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
//������ cell �� sName
function getCellFromDataname(dataname) {
    var sells = document.querySelectorAll('.sell');
    for (var i = 0; i < sells.length; i++) {
        if (sells[i].dataset.sname == dataname) return sells[i];
    }
}
//�������� �����, �������� �������
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

//���� ���-�� ����-�� �������� �����
function showIfRentWasPaid() {
    if (!data[lastId]["payForStreet"]) return;

    var nameOfPerson = data[data[lastId]["to"]]["name"];
    if (lastId == id) {
        showFourthMsg('�� ��������� '+nameOfPerson+' '+data[id]["payForStreet"], {color: 'red'}, 4000);
    } else if (data[lastId]["to"] == id){
        showFourthMsg(data[lastId]["name"]+' �������� ��� '+data[lastId]["payForStreet"], {color: 'black'}, 4000);
    } else {
        showFourthMsg(data[lastId]["name"]+' �������� '+nameOfPerson+' '+data[lastId]["payForStreet"], {color: 'black'}, 4000);
    }
}
//� ������� � ������� ���������� ������ ��������� ����
function setNewStreetOwner() {
    //���� ���� �������
    for (var key in data) {
        //���� � key ���� �������� sale
        if (data[key]["sale"]) {
            streets[data[key]["sale"]].owner = '-';
        }
    }

    //���� ���� �������
    for (var key in data) {
        //���� � key ���� �������� bought
        if (data[key]["bought"]) {
            //��������� ����� ��������� �����
            var street = data[key]["bought"];
            streets[street].owner = +key;
            //��������� �������, �� ��������� �������� ��� ����� �������
            var counter;
            //����� �� ���� ������ ����� �� 3 ����� �� ������� ���������
            if (streets[street].color =='orange' ||
                streets[street].color =='red' ||
                streets[street].color =='green' ||
                streets[street].color =='yellow' ||
                streets[street].color =='darkred' ||
                streets[street].color =='light') {
                    counter = 3;
                //��� ������� ������ �������� - 4
            } else if(streets[street].color =='trainy') {
                counter = 4;
                //��� ���������: ���������, �����, ����������
            } else {
                counter = 2;
            }
            // console.log('~~~~������� ���� ���� ='+counter);
            //��������� ����� �� �����. ������ � ���������� ������� ����
            var color = streets[street].color;
            // console.log('~~~~������� ����: '+color);
            //��� ������ �����
            for (var street in streets) {
                //���� ���� �������� � �������� ��� ��
                // console.log('~~~~~~~~����:'+streets[street].color+' ��������:'+streets[street].owner);
                if (streets[street].color == color && streets[street].owner == key) {
                    //������� ������� �� 1
                    counter--;
                    // console.log('~~~~���� �������� � �������� ��� ��');
                }
            }
            // console.log('~~~~����� �������� ������� ='+counter);
            //���� ��� ������ ��� ���������
            if (color == 'trainy' || color == 'communak'){
                //������ ������� ���� �������
                if (color == 'trainy') {
                    //��� ������� ���� �������� �� 4 ������������
                    var counter2 = 4 - counter;
                } else {
                    //����� - ��� ����������, �������� ���� �� 2 ������������
                    var counter2 = 2 - counter;
                }
                //����� �������� �����
                for (var street in streets) {
                    //���� ���� � ������� � �������� ���������, ��
                    if (streets[street].color == color && key == streets[street].owner) {
                        //���������� ��� ������ ����� �������� ��������� ����
                        streets[street].currentStreets = counter2;
                        // console.log('~~~~��� ������� � ��������� ������ �������� ��������� ����');
                    }
                }
            }
            //������ ���� ������� �������� ����� 0, ������ ��� ����� �������
            if (counter == 0) {
                // console.log('~~~~C������ ����� 0');
                //���� ��� ��� ����, �� ������� ��������� ��� ����
                if (key == id) {
                    showMsg('�� ������ ��� ����� ������ �����!', {color: 'blue'}, 4000);
                    //����� ��������� ��� ����-�� �������
                } else {
                    showMsg(data[key]["name"]+' ����� ��� ����� ������ �����!', {color: 'blue'}, 4000);
                }
                //�������� ��� ��� �����
                for (var street in streets) {
                    //���� ���� �������� ����� ��������� � ������� ������,
                    //��������� �� ���������, �.�. ������� ����� 0 - ��� 1 ��������
                    if (streets[street].color == color) {
                        //������ ��� _����_
                        if (color =='orange' || color =='red' || color =='green' || color =='yellow' || color =='darkred' || color =='light' || color =='blue' || color =='purple') {
                            //���������� true - ��� ��� ��� ����� ����� ������
                            streets[street].currentStreets = true;
                        }
                    }
                }
            }
        }
    }

}

//���������� ����������
var table = document.getElementById('table');

//���������� ��� ������� �� � data ���������
function getNameFromDataname(dataname) {
    var elems = table.querySelectorAll('.sell');
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].dataset.sname == dataname) {
            return elems[i].querySelector('.text').innerHTML;
        }
    }
}

//���������� ��� ��� � �� ������� �����
function showWhatWasBought() {
    if (!data[lastId]["bought"]) return;

    var sname = getNameFromDataname(data[lastId]["bought"]);

    if (id == lastId) {
        showMsg('�� ������ '+ sname+' �� '+data[id]["forPrice"], {color: 'black'}, 3000);
    } else {
        showMsg(data[lastId]["name"]+' ����� '+sname+' �� '+data[lastId]["forPrice"], {color: 'black'}, 3000);
    }
}


//���� ������ ����� ������, �� ���������� ����
function showBuyMenu() {
    if (!data[lastId]["street"]) return;
    var savedTurn;
    for (var key in data) {
        if (data[key]["turn"] == true) savedTurn = key;
    }
    if (data[lastId]["street"]) data[id]["turn"] = false;
    console.log('---------turnCLOSED');
    if (!data[id]["street"]) return;


    //�������� ���� ������
    var cellName = numberToCell(data[id]["cell"]);

    //���������������� � � �������� �������������
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
        if(street.owner == '-') { //���� ��� �������� ������, �� ������ ��������
            container.appendChild(refuse);
            centerField.appendChild(container);

            //�� ������� �������� ����� ��������� �����
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
                    showMsg('������������ �����!', {color: 'black'}, 1000);
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
            return; // ��� �, ������ �� ����������
        } else { //��� �� �, ����� ���������
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
    } else { //����� ��������� ���: owner == false
        //����� �� ��� ������� �����
        data[id]["turn"] = false;

        //�������� ������ �������� � ���������
        var auction = document.createElement('div');

        auction.className = 'auction';

        //�������� ������ �� ��������
        container.appendChild(auction);
        centerField.appendChild(container);

        //�� ������� �� ������ �������� �����
        buy.onclick = function() {

            //��������� ������� ����� �����
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
                showMsg('������������ �����!', {color: 'black'}, 1000);
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
//�������� id ���������� ����������
function getLastId() {
    for (var key in data) {
        if (data[key]["last"]) lastId = key;
    }
}

//�������� ���� ������ �� ������
function showPrisonMenu() {
    // if(data[lastId]["street"]) return;
    if (data[id]["toPrison"]==true || data[id]["toPrison"] =='true'&& data[id]["turn"]) {

        var container = document.createElement('div'),
            pay = document.createElement('div'),
            throwCubes = document.createElement('div'),
            releaseCard = document.createElement('div');
        //��������� ������
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

        //�������� ���������� ������
        var coords = centerField.getBoundingClientRect();

        container.style.left = coords.left + window.pageXOffset + 250 + 'px';
        container.style.top = coords.top + window.pageYOffset + 200 + 'px';

        document.body.appendChild(container);

        //��������� �������� ������
        data[id]["turn"] = false;

        //���� ���� ���������, ��
        pay.onclick = function (e) {
            //����� ������� ��-��������
            data[id]["toPrison"] = false;

            //�������� "���� ���������"
            data[id]["payForPrison"] = true;

            //��������� �������� ������
            data[id]["turn"] = true;

            //�������� ������� ������� ������
            prisonEscapeCounter = 3;

            //������� ��� ����
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
            //������� ������ � ���� �� �����, �� �������

            //��������� ������� ������
            data[id]["turn"] = true;

            //������� ��� ����
            document.body.removeChild(container);
        }
    } else return;

}

//��������� � ������� ��������� ���� ������ � ������
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
//��������� ��������� � ������� ��������� � ������: �
function getRandomPrisonMessage() {
    var arr  = ['� �� �������, ��������� ����!', '������ ���� � ���������'];
    return arr[getRandomInt(0, arr.length)];
}
//��������� ��������� ��� ������
function getRandomPrisonMessage2() {
    var arr  = ['����� � ������ �� ���� ������� �������', '��������� � ����� � ������', '��� ������ � ������ � ������', '����� ���� ��, ������� ����� � ������', ' ������ ������ �������. � ������ ��� � �����', '������� ��������� ����� � ������������ �����. � ������ ���!'];
    return arr[getRandomInt(0, arr.length)];
}
//��������� ���� ��
function checkIfIsDead() {
    if (data[lastId]["isDead"]) {
        document.body.removeChild(opponents[lastId]);
        showMsg(`${data[lastId]["name"]} ��������! ������� �� ��� ������!`, {color: 'red'}, 3000);
        return true;
    } else return false;
}
//�������� �������� ����� �� ������ ������
function getMoneyFromIfBadCell() {
    if(!data[lastId]["badCell"]) return;

    if (id == lastId) {
        showAnotherMsg(`������� ������� ${data[lastId]["badCell"]}`, {color: 'red'}, 4000);
    } else {
        showAnotherMsg(`${data[lastId]["name"]} �������� ${data[lastId]["badCell"]}`, {color: 'red'}, 4000);
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
    //������� ��� ��������
    delete data[lastId]["badCell"];
}

//���� ������ ���� �����, �� ��������� �������� ��������� �����
function giveMoneyIfForwardPassed() {
    if (!data[lastId]["giveMoney"]) return;

    if (id == lastId) {
        showAnotherMsg(`������ ���� �����. ������� 200`, {color: 'red'}, 3000);
    } else {
        showAnotherMsg(`${data[lastId]["name"]} ������ ���� �����. ������� 200`, {color: 'red'}, 3000);
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

    //������� ��� ��������
    delete data[lastId]["giveMoney"];
}

//������� ��� ������� ��������
function showThrownNumber() {
    if (lastId == id) {
        showMsg(`�� ��������� ${data[lastId]["cubes"]}`, {color: 'black'}, 4000);
    } else {
        showMsg(`${data[lastId]["name"]} �������� ${data[lastId]["cubes"]}`, {color: 'black'}, 4000);
    }
}

//���� ��������� �����
function showDiceThrown() {
    var split = data[lastId]["cubes"].split(':');
    if (split[0] == split[1]) {
        if (lastId == id) {
            showAnotherMsg('�����! ������ ���.', {color: 'black'});
        } else {
            showAnotherMsg(`� ${data[lastId]["name"]} �����. ������� ���.`, {color: 'black'});
        }
    }
}

//��� ������� ���������
function showWhoIsNext() {
    if (data[id]["turn"]) {
        showThirdMsg('��� ������� ������� �����', {color: 'black'}, 4000);
    } else {
        var nameOfPerson = whoseTurn();
        showThirdMsg('������� '+nameOfPerson+' �������', {color: 'black'}, 4000);
    }
}


//����������� ���������� ��������� �� ����� ������        �������� ��!!
function setNewPosition () {
    var coords = data[lastId]["position"].split(':');
    opponents[lastId].style.left = +coords[0] + 'px';
    opponents[lastId].style.top = +coords[1] + 'px';
}

//���������� ����� ����������
function getPositionFromThrownResult(result) {
    //������� ��������� ������ � ������
    result = result.split(':');

    //���� ��� �����, �� ���-�� ������ ��������� �� 1
    if (+result[1] == result[0]) {
        data[id]["doublesInRow"]++;
    }

    //������� ����������, ����� �������� ���-�� ����� ��� ����
    result = parseInt(result[0]) + parseInt(result[1]);

    //������� ������ ������
    var newCell = +data[id]["cell"];

    //�������� ����� ������
    newCell += result;

    //������������ � ������, ���� ������� ������ == 3 ��� ��������� �� ��.��� � ������
    if (newCell == 31 || data[id]["doublesInRow"] == 3) {
        console.log('three doubles in a row or cell #31');
        newCell = 11;
        data[id]["toPrison"] = true;
    }

    console.log('old cell:'+data[id]["cell"]);
    console.log('new position :'+newCell);


    //��������� ������ ��  ������
    if (newCell > 40) {
        //�� ����� ������ = ������ - 40
        newCell -= 40;
        //� ��������� ����� ���� ������ ���� �����
        data[id]["giveMoney"] = true;
    }
    //���� ��� - ������
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
    //���������� ��������� ����� ������ � ������� ����������
    data[id]["cell"] = newCell;
    newCell = numberToCell(newCell);

    //���� ������ ����������, �� ������� ��������������� ������
    if (newCell.dataset.sname && +streets[newCell.dataset.sname].owner != id) {
        data[id]["street"] = true;
    }

    //������� ���������� ���� 'place-to-stand' ����� ������
    return getPositionFromCell(newCell);
}


//������� ����� ����������
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
//����� ��� ����, ��� ������� ������
function whoseTurn() {
    for (var key in data) {
        if (data[key]["turn"]) return data[key]["name"];
    }

}

//�������� ��������� ������ �������
function getThrownResult() {
    return getRandomInt() + ':' + getRandomInt();
}

//���������� ����� ��� ������ �������
// ���������� ��������� ����� ����� ����� min (������������) � max (�� ������� // max)
function getRandomInt(min, max) {
    min = min || 1;
    max = max || 7;
  return Math.floor(Math.random() * (max - min)) + min;
}

//����������� �����
function Street (withoutStreets, withAllStreets, with1House, with2Houses,
                 with3Houses, with4Houses, withHotel, priceOfHouse, toBuyAgain,
                 color ) {
                     //���������
    //��� ���� ���� � ��������� ��������� =
    this.withoutStreets = withoutStreets;
    //�� ����� ������� � ��������� ��������� =
    this.withAllStreets = withAllStreets;
    //� ����� ����� ��������� �����
    this.with1House = with1House;
    //� ����� ������ ��������� �����
    this.with2Houses = with2Houses;
    //� ����� ������ ��������� �����
    this.with3Houses = with3Houses;
    //� �������� ������ ��������� �����
    this.with4Houses = with4Houses;
    // � ������ ��������� �����
    this.withHotel = withHotel;
    //��������� ������ ���� ��� �����
    this.priceOfHouse = priceOfHouse;
    //�������� ����� �������
    this.toBuyAgain = toBuyAgain;
    //�������� ������ ��� ������
    this.color = color;

    this.owner = false;
    //�������� �� ����� ����
    this.currentStreets = false; /*allStreets or false*/
    this.currentHouses = 0; /*1,2,3,4*/
    this.currentHotel = false; /*true or false*/

    var self = this;
    //["currentRent"] �������� ��� �������� � ����������� �� ������ �������
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
//����������� �/�
function Railway() {
    this.owner = false;
    this.toBuyAgain = 110;
    //�������� �� ���� ����
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
//����������� ������������ �����������
function Communal() {
    this.owner = false;
    this.toBuyAgain = 83;
    //�������� �� ���� ����
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

//�������������
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
//�������: ������ ���������� � �������������
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
        showFourthMsg('������ ������!', {color: 'black'}, 1000);
    } else {
        xhr.open('GET', '/auction_p?'+request, true);
        xhr.send();
        xhr.onload = function () {
            console.log(this.responseText);
        }
    }
    return false;
}
//���������� � ������� ��� ����� ������ �����
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
//���������� ����������
var firstHouse = building.elements.firsthouse,
    firstHotel = building.elements.firsthotel,
    secondHouse = building.elements.secondhouse,
    secondHotel = building.elements.secondhotel,
    thirdHouse = building.elements.thirdhouse,
    thirdHotel = building.elements.thirdhotel,
    firstBlock = document.querySelector('.block1'),//����� ������ �����
    secondBlock = document.querySelector('.block2'),
    thirdBlock = document.querySelector('.block3'),
    firstSpan = document.querySelector('.block1 .streetname'),//�������� ����
    secondSpan = document.querySelector('.block2 .streetname'),
    thirdSpan = document.querySelector('.block3 .streetname'),
    animContainer1 = document.querySelector('.anim1'),  //����� � ���������
    animContainer2 = document.querySelector('.anim2'),
    animContainer3 = document.querySelector('.anim3'),
    animCounter1 = 0,                           //�������� ��� ��������
    animCounter2 = 0,
    animCounter3 = 0,
    names;                              //������, ���������� �������� ����

//����� �� ������� �������
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

    //������� ������ ����
    if (streets[street].currentStreets === true) {
        //������������� ����� � ������� ����� � �����
        var build = document.createElement('div');
        build.className = 'build';
        container.appendChild(build);

        centerField.appendChild(container);

        //������
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
                    showMsg('������� �������� ����!', {color: 'black'}, 3000);
                    return;
                }
            } else {
                if (streets[names[0]].currentHouses > 0 ||
                    streets[names[1]].currentHouses > 0) {
                    showMsg('������� �������� ����!', {color: 'black'}, 3000);
                    return;
                }
            }

            var price = +target.querySelector('.money').innerHTML / 2;
            //��������� ����� ���������� �����
            var newMoney = +money.innerHTML.split('$ ');
            newMoney += price;
            data[id]["money"] = newMoney;
            money.innerHTML = '$ '+newMoney;
            //��������� � ����� ������ ���
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
        //�������� ������ �������, ������: �������
        centerField.appendChild(container);
        sale.onclick = function (e) {
            var price = +target.querySelector('.money').innerHTML / 2;
            console.log("==price of the street: "+price);
            //��������� ����� ���������� �����
            var newMoney = +money.innerHTML.split('$ ');
            newMoney += price;
            data[id]["money"] = newMoney;
            money.innerHTML = '$ '+newMoney;
            //��������� � ����� ������ ���
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

//���������� ���� ������������� � ������
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
    } else { //����� 3
        thirdSpan.innerHTML = getNameFromDataname(names[2]);
        restoreClassList(thirdSpan);
        thirdSpan.classList.add(color);
        putRightHouses(names[2], 3);
    }
    building.style.visibility = 'visible';
}
//������������ ������ �������� �������
function restoreClassList(spanElement) {
    spanElement.className = '';
    spanElement.classList.add('streetname');
}

//���������� ���������� ���������� �������, ������� ��� �������
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
//����� �� ������������� �������
//���������� ����������
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


//�������� �������� �������
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
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+firstHouse.value+1 == +secondHouse.value +2 ||
            +firstHouse.value+1 == +thirdHouse.value +2) {
                showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
            showFourthMsg('������� ���� � ������ ����!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+firstHouse.value-1 == +secondHouse.value -2 ||
            +firstHouse.value-1 == +thirdHouse.value -2) {
                showFourthMsg('������� ���� � ������ ����!', {color: 'black'}, 1000);
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
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+secondHouse.value+1 == +firstHouse.value +2 ||
            +secondHouse.value+1 == +thirdHouse.value +2) {
                showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
            showFourthMsg('������� ���� � ������ ����!', {color: 'black'}, 1000);
            return;
        }
    } else {
        if (+secondHouse.value-1 == +firstHouse.value -2 ||
            +secondHouse.value-1 == +thirdHouse.value -2) {
                showFourthMsg('������� ���� � ������ ����!', {color: 'black'}, 1000);
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
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
            showFourthMsg('������� ���� � ������ ����!', {color: 'black'}, 1000);
            return;
        }
    animCounter3--;
    showAnimationOfFallingHouses(3, 'u');
    if (+thirdHouse.value>0) {
        +thirdHouse.value--;
    }
    showCurrentPrice();
}
//������ � ������
firstHotelPlusButton.onclick = function (e) {
    e.preventDefault();
    if (firstHotel.value == 1) return;
    if (thirdBlock.style.visibility == 'hidden') {
        if (+firstHouse.value<4 || +secondHouse.value < 4) {
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+firstHouse.value < 4 || +secondHouse.value < 4 || + thirdHouse.value < 4) {
                showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
            return;
    }
    } else {
        if (+firstHouse.value < 4 || +secondHouse.value < 4 || + thirdHouse.value < 4) {
                showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
            showFourthMsg('��������� ���� �� ������ ������!', {color: 'black'}, 1000);
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
//���������� ����������
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

     //����� �����, ������ � ���������
    var newSum = +firstHouse.value + (+firstHotel.value) + (+secondHouse.value) + (+secondHotel.value);

     if (names[2]) {
         var thirdHouseValue = +streets[names[2]].currentHouses || 0;
         var thirdHotelValue = +streets[names[2]].currentHotel || 0;
         currentSum += thirdHouseValue + thirdHotelValue;
         //����� �����, ������ � ���������
         newSum += (+thirdHouse.value + +thirdHotel.value);
     }
     price = +streets[names[0]].priceOfHouse;
     //����� ������� ��������

    if (newSum > currentSum) { //���� ��������
        var result = (parseInt(newSum) - parseInt(currentSum)) * price;
        total.innerHTML = '-'+ result;
        if (parseInt(money.innerHTML.split('$ ').join('')) < +result) {
            showFourthMsg('� ������ �� ���� �������?!', {color: 'red'}, 4000);
        }
    } else { //������
        var result = (parseInt(currentSum)-parseInt(newSum))*(price/2);
        total.innerHTML = '+'+ result;

    }
}
//��� ������������� �����
building.onsubmit = function (e) {
    e.preventDefault();

    var request = 'id='+id+'&cell='+data[id]["cell"];
    request += '&position='+data[id]["position"]+'&thrown='+data[id]["cubes"];
    //������� ��������
    var firstHouseValue = +streets[names[0]].currentHouses || 0;
    var firstHotelValue = +streets[names[0]].currentHotel || 0;
    var secondHouseValue = +streets[names[1]].currentHouses || 0;
    var secondHotelValue = +streets[names[1]].currentHotel || 0;
    price = +streets[names[0]].priceOfHouse;

    //����� ������� ��������
    currentSum = firstHouseValue + firstHotelValue + secondHouseValue + secondHotelValue;
    //����� �����, ������ � ���������
    newSum = +firstHouse.value + (+firstHotel.value) + (+secondHouse.value) + (+secondHotel.value);

    if (names.length == 2) { //������ ��� �����
        if (+firstHouse.value > firstHouseValue ||
            +secondHouse.value > secondHouseValue ||
            +firstHotel.value > firstHotelValue ||
            +secondHotel.value > secondHotelValue) {
            var whatIwant = (newSum - currentSum) * price;
            whatIwant += 'm';
        } else { //�������� �������
            var whatIwant = (currentSum - newSum) * (price / 2);
            whatIwant +='p'
        }
        request += '&houseBuild='+names[0]+'e1';
        var temp = (firstHotel.value ==1)?'1hotel' : firstHouse.value +'houses';
        request += temp+'e5'+names[1]+'e1';
        temp = (secondHotel.value == 1)?'1hotel' : secondHouse.value+'houses';
        request += temp;
        request += '&buildPrice='+whatIwant;
    } else if (names.length == 3) { // ��� �����
        //������� ��������
        var thirdHouseValue = +streets[names[2]].currentHouses || 0;
        var thirdHotelValue = +streets[names[2]].currentHotel || 0;
        //����� ������ ���������
        currentSum += thirdHouseValue + thirdHotelValue;

        //����� �����, ������ � ���������
        newSum += (+thirdHouse.value + +thirdHotel.value);
        if (+firstHouse.value > firstHouseValue ||
            +secondHouse.value > secondHouseValue ||
            +firstHotel.value > firstHotelValue ||
            +secondHotel.value > secondHotelValue ||
            +thirdHouse.value > thirdHouseValue ||
            +thirdHotel.value > thirdHotelValue) {
            //����� ������ ���� ��� �����
            var whatIwant = (newSum - currentSum) * price;
            whatIwant += 'm';
        } else {
            //��������
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
    //��� ������ � ����� ������, �������� �������� ��� ������� �����
    restoreBuildingForm();

}

//��������������� �������� ��������� ����� �������������
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
