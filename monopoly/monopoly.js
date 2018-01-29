var http = require('http'),
    server = new http.Server(),
    fs = require('fs'),
    url = require('url');


var data = {};      //здесь находятся id пользователей и прочая инфа
var clients = [];   //для получения res
var innerId = 0;        //будет на 1 больше текущего последнего
var number = 0;     //номер пакета  с данными
var auctionObject = {}; //объект для работы с аукционом
var auctionTimer;   //таймер для завершения аукциона
//сформировать массив чисел для ШАНС и ОБЩЕСТВЕННАЯ КАЗНА
var chance = [], community = [];
for (var i = 0; i < 16; i++) {
    chance.push(i);
    community.push(i);
}

//зарандомить числа для обоих массивов
chance = shuffle(chance);
community = shuffle(community);
console.log('----------chance-'+chance);
console.log('----------community-'+community);

//получить локальный ip на который нужно подключаться
    var ifs = require('os').networkInterfaces();
    var result = Object.keys(ifs)
      .map(x => [x, ifs[x].filter(x => x.family === 'IPv4')[0]])
      .filter(x => x[1])
      .map(x => x[1].address)[2]; // [2] - номер в списке
     console.log('\nUse this ip: ' + result);
     console.log("Successfully started\n");



server.listen('80', result);
server.on('request', onRequest);

function onRequest (req, res) {
    var parsedUrl = url.parse(req.url, true);
    // console.log('-----'+req.url);
    var id = parsedUrl.query.id || '';
    var thrown = parsedUrl.query.thrown || '';
    var cell = parsedUrl.query.cell || '';
    var coords = parsedUrl.query.coords || '';
    var nameOfPerson = parsedUrl.query.name || '';
    var position = parsedUrl.query.position || '';
    var giveMoney = parsedUrl.query.giveMoney || '';
    var badCell = parsedUrl.query.badCell || '';
    var toPrison = parsedUrl.query.toPrison || '';
    var payForPrison = parsedUrl.query.payForPrison || '';
    var prisonFreeEscape = parsedUrl.query.prisonFreeEscape || '';
    var street = parsedUrl.query.street || '';
    //при продаже улиц
    var sale = parsedUrl.query.sale || '';
    var salePrice = parsedUrl.query.salePrice || '';

    //название улицы из объекта
    var bought = parsedUrl.query.bought || '';
    //за цену
    var forPrice =  parsedUrl.query.forPrice || '';

    //плата владельцу - сколько
    var payForStreet = +parsedUrl.query.payForStreet || '';
    //кому - id
    var to = +parsedUrl.query.to || '';

    //ауцион - true \false
    var auction = parsedUrl.query.auction || '';
    //за - имя улицы
    var forStreet = parsedUrl.query.forStreet || '';
    //аукционная цена
    var price = parsedUrl.query.price || '';

    //при покупке домов
    //на каких улицах и что было построено
    var houseBuild = parsedUrl.query.houseBuild || '';
    // за какую цену
    var buildPrice = parsedUrl.query.buildPrice || '';

    //шанс или общественная казна
    var chanceCell = parsedUrl.query.chance || '';
    var communityCell = parsedUrl.query.community || '';
    //получает или наоборот отнимает деньги
    var money = parsedUrl.query.money || '';
    //карточки освободиться бесплатно
    var freeChanceCard = parsedUrl.query.freeChanceCard || '';
    var freeCommunityCard = parsedUrl.query.freeCommunityCard || '';
    switch(parsedUrl.pathname) {
        case '/publish':
            console.log('host :'+id);
            res.end('published!');

            data[id]["cubes"] = thrown;
            data[id]["position"] = position;
            data[id]["cell"] = cell;
            data[id]["prisonFreeEscape"] = prisonFreeEscape;
            if (!sale || !houseBuild) {
                data[id]["last"] = true;
            }
            data[id]["toPrison"] = toPrison;
            data[id]["bought"] = bought;
            data[id]["forPrice"] = +forPrice;
            data[id]["street"] = street;
            data[id]["to"] = to;
            data[id]["payForStreet"] = payForStreet;
            data[id]["auction"] = auction;
            data[id]["forStreet"] = forStreet;
            if (auction) {
                auctionObject["street"] = forStreet;
                auctionObject["price"] = 10;
                auctionObject["finish"] = false;
                if (auctionObject["id"]) delete auctionObject["id"];
                closeAuction();
            }
            //если выпал шанс, то вытащить номер карточки
            if (chanceCell) {
                data[id]["chance"] = getChance();
            }
            //если выпала общ.казна, то вытащить номер карточки
            if (communityCell) {
                data[id]["community"] = getCommunity();
            }

            //если покупает новую собственность
            if (houseBuild) {
                data[id]["houseBuild"] = houseBuild;
                setHouseBuildMoney(id, buildPrice);
            }
            //если продаёт улицу
            if (sale) {
                //выдать деньги за неё
                data[id]["money"] += +salePrice;
                //присвоить эту улицу
                data[id]["sale"] = sale;
            }

            //если свойство есть, то тогда дать денег
            if (giveMoney) {
                data[id]["money"] += 200;
                data[id]["giveMoney"] = true;
            }
            //если -ячейка
            if (badCell) {
                data[id]["money"] -= badCell;
                data[id]["badCell"] = badCell;
            }
            //если платит за выход из тюрьмы
            if (payForPrison) {
                data[id]["money"] -= 50;
                delete data[id]["toPrison"];
            }

            //плата за покупку улицы
            if (bought) {
                data[id]["money"] -= forPrice;
            }

            if (payForStreet && to != id) {
                if (data[id]["money"] - payForStreet > 0) {
                    data[id]["money"] -=payForStreet;
                    data[to]["money"] +=payForStreet;
                } else {
                    data[to]["money"] +=data[id]["money"];
                    data[id]["money"] = -1;
                }
            }
            //если есть карточки выйти из тюрьмы бесплатн
            if (freeChanceCard && freeChanceCard != 'used') {
                data[id]["freeChanceCard"]= true;
            }
            if (freeCommunityCard && freeCommunityCard != 'used') {
                data[id]["freeCommunityCard"] = true;
            }
            if (freeChanceCard == 'used') {
                delete data[id]["toPrison"];
                delete data[id]["freeChanceCard"];
                chance.unshift(15);
            }
            if (freeCommunityCard == 'used') {
                delete data[id]["toPrison"];
                delete data[id]["freeCommunityCard"];
                community.unshift(2);
            }

            //Шансы и казна
            if (money) {
                dealWithMoney(id, money);
            }

            //если денег меньше нуля
            checkIfAlive(id);

            if (data[id]["prisonFreeEscape"]) {
              turnQueue(id);
            }
            //передаёт очередь следующему
            if (data[id]["chance"] ||
                data[id]["community"] ||
                street ||
                sale ||
                houseBuild) {
            } else {
                turnQueue(id);
            }
            sendIfPossible(id);
            break;

        case '/subscribe':
            console.log(id+' subscribed');
            subscribe(res);
            break;
        case '/auction_p':
            clearTimeout(auctionTimer);
            closeAuction();
            res.end('price has been applied');
            auctionObject["id"] = id;
            auctionObject["price"] = price;
            console.log('id: '+id+' new price: '+price);
            publishAuction();
            break;
        case '/auction_s':
            subscribe(res);
            break;
        case '/thrown':
            clients.push(res);
            var result = getThrownResult();
            checkId(res, id);
            data[id]["cubes"] = result;
            data[id]["turn"] = false;
            checkThrownResult(id, result);
            sendData(id);
            break;

        case '/position':
            clients.push(res);
            setCoords(coords, id, cell);
            sendData(id);
            break;

        case '/start':
            checkId(res, id);
            setIcon(res, parsedUrl.query.icon, id);
            break;

        case '/connect':
            console.log('new connection');
            onConnect(res, nameOfPerson);
            break;

        case '/':
        case '/index.html':
            fs.readFile('./monopoly.html', function (err, file) {
                if (err) {
                    console.log(err);
                    res.end('Mistake has occured. SOrry!');
                } else
                    res.end(file);
            });

             break;

        default:
            fs.readFile('./' + req.url, function (err, file) {
                if (err) {
                    console.log(req.url + ' not found');
                    res.end('NO such file or directory. -_-');
                } else {
                    res.end(file);
                }
            });
    }

}
function sendIfPossible(id){
  if (clients.length == Object.keys(data).length) {
    publish(id);
  } else {
    setTimeout(function() {
      sendIfPossible(id);
    }, 50);
  }
}
//Выплаты или получение денег при посещении ШАНСА И КАЗНЫ
function dealWithMoney (id, money) {
    money = money.split('');
    if (money[money.length-1] == 'd') {
        for (var key in data) {
            if (key != id) {
                data[id]["money"] -=50;
                data[key]["money"] +=50;
            }
        }
    } else if (money[money.length-1] == 'p') {
        money = parseInt(money.slice(0, money.length-1).join(''));
        data[id]["money"] += money;
    } else if (money[money.length-1] == 'm') {
        money = parseInt(money.slice(0, money.length-1).join(''));
        data[id]["money"] -= money;
    } else if (money[money.length-1] == 'b') {
        for (var key in data) {
            if (key != id) {
                data[key]["money"] -=10;
                data[id]["money"] +=10;
            }
        }
    }

}
//Выдать число для ШАНСА
function getChance() {
    var temp = chance.pop();
    if (temp != 15) {
        chance.unshift(temp);
    }

    return temp;
}
//Выдать число для общественной казны
function getCommunity() {
    var temp = community.pop();
    if (temp !=2) {
        community.unshift(temp);
    }

    return temp;
}
//рандомизатор чисел
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
//В зависимости от метки производит операцию с деньгами
function setHouseBuildMoney(id, buildPrice) {
    var temp = buildPrice.split('');
    buildPrice = parseInt(temp.slice(0, temp.length-1).join(''));
    if (temp[temp.length-1] == 'm') {
        data[id]["money"] -= buildPrice;
    } else if (temp[temp.length-1] == 'p') {
        data[id]["money"] += buildPrice;
    }
}
//Завершить аукцион
function closeAuction() {
    auctionTimer = setTimeout(function () {
        console.log("AuctionTimer");
        auctionObject["finish"] = true;
        if (auctionObject["id"]) {
            var id = auctionObject["id"];
            data[id]["money"] -= parseInt(auctionObject["price"]);
            data[id]["bought"] = auctionObject["street"];
        }

        publishAuction();
    }, 15000);
}
//Отправка данных для аукциона
function publishAuction() {
    clients.forEach(function (res) {
        res.statusCode = 200;
        res.end(JSON.stringify(auctionObject));
    });
    clients = [];
}
//отправка данных
function publish(id) {
    for(var key in data) console.log(key);
    console.log('length :'+clients.length);
    console.log('turn #'+number++);

    clients.forEach(function(res) {
        res.statusCode = 200;
        res.end(JSON.stringify(data));
    });

    clients = [];
    //был последним - удалить
    deleteProperty(id, "last");

    //если прошёл поле вперед
    deleteProperty(id, 'giveMoney');

    //если наступил на -ячейку
    deleteProperty(id, "badCell");

    //Если проиграл
    deleteProperty(id, "isDead");

    //бесплатный побег из тюрьмы
    deleteProperty(id, "prisonFreeEscape");

    //плата другому за посещение улицы
    deleteProperty(id, "payForStreet");
    deleteProperty(id, "to");

    //купил улицу
    deleteProperty(id, "bought");
    deleteProperty(id, "forPrice");
    //продал улицу
    deleteProperty(id, "sale");

    //если посетил ничейную улицу
    deleteProperty(id, "street");

    //при покупке собственности
    deleteProperty(id, "houseBuild");
    deleteProperty(id, "buildPrice");
    //шанс или общественная казна
    deleteProperty(id, "chance");
    deleteProperty(id, "community");
    data[id]["chance"] = data[id]["community"] = null;

    if (data[id]["isDead"]) delete data[id];

}
//Установить новую очередь, елси один помер
function setNewTurnIfDead(id) {
    if (data[id]["isDead"]) {
        console.log('-------DEL'+id);
        innerId = 0;
        for (var key in data) {
            if (key != id) {
                data[key]["innerId"] = innerId++;
            }
        }
    }

}
//подписка
function subscribe(res) {
    clients.push(res);
    res.on('close', function () {
        clients.splice(clients.indexOf(res), 1);
    });
}
//Проверить жив ли
function checkIfAlive(id) {
    if (data[id]["money"] < 0) {
        data[id]["isDead"] = true;
    }
}
//Поставить turn=true следующему в очереди
function turnQueue(id) {
    try {
        //получить в массив результат последнего броска
        var result = data[id]["cubes"].split(':');

        //если  //проиграл
                //он попал в тюрьму
                //он успешно бежал из т
                //результаты броска разные
        if (data[id]["isDead"] ||
            data[id]["toPrison"] ||
            data[id]["prisonFreeEscape"] ||
            result[0] != result[1]) {

            //установить кол-во дублей
            data[id]["doublesInRow"] = 0;  //0

            //запретить ему следующий бросок
            data[id]["turn"] = false;

            //елси бросающий помер
            setNewTurnIfDead(id);

            //получить внутренний ID
            var currentInnerId = data[id]["innerId"];

            //увеличить его на 1
            currentInnerId++;

            //если он равен максимуму, устновить его на начало
            if (currentInnerId == innerId) currentInnerId = 0;

            //получить данные от нового ID
            for (var key in data) {
                //если нашли его, то установить ему след ход в true
                if (data[key]["innerId"] == currentInnerId) {
                    data[key]["turn"] = true;
                    console.log('turning the Turn');
                    console.log('next turn of id:'+key);
                }
            }

        } else {
            if (result[0] == result[1]) {
                //иначе были дубли. Увеличить кол-во брошенных дублей
                data[id]["doublesInRow"]++;
            }

        }

    } catch (e) {
        console.log('on TURN QUEUE\n'+e);
    }
}


//вернёт id того, чья очередь бросать кости
function showWhoIsNext() {
    for (var key in data) {
        if (data[key]["turn"]) return key;
    }
}
//Получить результат броска кубиков
function getThrownResult() {
    return getRandomInt() + ':' + getRandomInt();
}

//Проверить результаты бросков кубиков
function checkThrownResult(id, result) {
    try {
        if (clients.length == Object.keys(data).length) {
            var tempId = Object.keys(data)[0];
            var big = getSum(data[tempId]["cubes"]);
            for (var key in data) {
                if (key != 'last') {
                    var tempSum = getSum(data[key]["cubes"]);
                    if ( tempSum > big) {
                        tempId = key;
                    }
                }
            }
            data[tempId]["turn"] = true;
            data[id]["winner"] = true;
            for (var key in data) {
                if (data[key]["winner"]) delete data[key]["winner"];
            }
        }
    } catch(e) {
        console.log('on CheckingThrownResult\n'+e);
    }
}
//Получить сумму из результата броска
function getSum (val) {
    val = val.split(':');
    return parseInt(val[0]) + parseInt(val[1]);
}

//Отправить данные
function sendData(id) {
    try {
            if (clients.length == Object.keys(data).length) {
                console.log('sendData length:'+clients.length);

                clients.forEach(function(res) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                });

                clients = [];

                //был последним - удалить
                deleteProperty(id, "last");

                //если прошёл поле вперед
                deleteProperty(id, 'giveMoney');

                //если наступил на -ячейку
                deleteProperty(id, "badCell");

                //Если проиграл
                deleteProperty(id, "isDead");


                //бесплатный побег из тюрьмы
                deleteProperty(id, "prisonFreeEscape");
            }
    } catch (e) {
        console.log('onSendData\n'+e);
    }
}
//Удаляет свойство если есть
function deleteProperty(id, property) {
    if (data[id][property]) delete data[id][property];
}

//Установить начальные позиции
function setCoords(coords, id, cell) {
    try {
        data[id]["position"] = coords;
        data[id]["cell"] = cell;
    } catch (e) {
        console.log('on Coords\n'+e);
        console.log(id);
    }
}
//Проверить есть ли ID
function checkId(res, id) {
    if (data[id] == 'undefined') {
        res.end('no such id');
    }
}
//Ассоциировать иконку с текущим ID
function setIcon (res, icon, id) {
    try {
        for (var key in data) {
            if (data[key]["icon"] == icon) {
                res.statusCode = 403;
                res.end();
            }
        }
        data[id]["icon"] = icon;
    } catch(e) {
        console.log('onIcon\n'+e);
    }
    res.statusCode = 200;
    res.end();

}
//Подключиться
function onConnect(res, name) {
    // получает id и все начальные аттрибуты
    var id = getId();
    try {
        console.log('id:'+id+' added');
        data[id] = {};
        data[id]["name"] = name;
        data[id]["money"] = 1500;
        data[id]["turn"] = true;
        data[id]["innerId"] = innerId++;
        data[id]["last"] = false;
        data[id]["doublesInRow"] = 0;
    } catch (e) {
        console.log('onCOnnection\n'+e);
    }
    res.end(JSON.stringify(id));
}

//Получить id
function getId() {
    return Math.round(Math.random() * 100);
}

//Возвращает число для броска кубиков
// Возвращает случайное целое число между min (включительно) и max (не включая // max)
function getRandomInt(min, max) {
    min = min || 1;
    max = max || 7;
  return Math.floor(Math.random() * (max - min)) + min;
}
