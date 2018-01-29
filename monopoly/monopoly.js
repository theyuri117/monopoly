var http = require('http'),
    server = new http.Server(),
    fs = require('fs'),
    url = require('url');


var data = {};      //����� ��������� id ������������� � ������ ����
var clients = [];   //��� ��������� res
var innerId = 0;        //����� �� 1 ������ �������� ����������
var number = 0;     //����� ������  � �������
var auctionObject = {}; //������ ��� ������ � ���������
var auctionTimer;   //������ ��� ���������� ��������
//������������ ������ ����� ��� ���� � ������������ �����
var chance = [], community = [];
for (var i = 0; i < 16; i++) {
    chance.push(i);
    community.push(i);
}

//����������� ����� ��� ����� ��������
chance = shuffle(chance);
community = shuffle(community);
console.log('----------chance-'+chance);
console.log('----------community-'+community);

//�������� ��������� ip �� ������� ����� ������������
    var ifs = require('os').networkInterfaces();
    var result = Object.keys(ifs)
      .map(x => [x, ifs[x].filter(x => x.family === 'IPv4')[0]])
      .filter(x => x[1])
      .map(x => x[1].address)[2]; // [2] - ����� � ������
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
    //��� ������� ����
    var sale = parsedUrl.query.sale || '';
    var salePrice = parsedUrl.query.salePrice || '';

    //�������� ����� �� �������
    var bought = parsedUrl.query.bought || '';
    //�� ����
    var forPrice =  parsedUrl.query.forPrice || '';

    //����� ��������� - �������
    var payForStreet = +parsedUrl.query.payForStreet || '';
    //���� - id
    var to = +parsedUrl.query.to || '';

    //������ - true \false
    var auction = parsedUrl.query.auction || '';
    //�� - ��� �����
    var forStreet = parsedUrl.query.forStreet || '';
    //���������� ����
    var price = parsedUrl.query.price || '';

    //��� ������� �����
    //�� ����� ������ � ��� ���� ���������
    var houseBuild = parsedUrl.query.houseBuild || '';
    // �� ����� ����
    var buildPrice = parsedUrl.query.buildPrice || '';

    //���� ��� ������������ �����
    var chanceCell = parsedUrl.query.chance || '';
    var communityCell = parsedUrl.query.community || '';
    //�������� ��� �������� �������� ������
    var money = parsedUrl.query.money || '';
    //�������� ������������ ���������
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
            //���� ����� ����, �� �������� ����� ��������
            if (chanceCell) {
                data[id]["chance"] = getChance();
            }
            //���� ������ ���.�����, �� �������� ����� ��������
            if (communityCell) {
                data[id]["community"] = getCommunity();
            }

            //���� �������� ����� �������������
            if (houseBuild) {
                data[id]["houseBuild"] = houseBuild;
                setHouseBuildMoney(id, buildPrice);
            }
            //���� ������ �����
            if (sale) {
                //������ ������ �� ��
                data[id]["money"] += +salePrice;
                //��������� ��� �����
                data[id]["sale"] = sale;
            }

            //���� �������� ����, �� ����� ���� �����
            if (giveMoney) {
                data[id]["money"] += 200;
                data[id]["giveMoney"] = true;
            }
            //���� -������
            if (badCell) {
                data[id]["money"] -= badCell;
                data[id]["badCell"] = badCell;
            }
            //���� ������ �� ����� �� ������
            if (payForPrison) {
                data[id]["money"] -= 50;
                delete data[id]["toPrison"];
            }

            //����� �� ������� �����
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
            //���� ���� �������� ����� �� ������ ��������
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

            //����� � �����
            if (money) {
                dealWithMoney(id, money);
            }

            //���� ����� ������ ����
            checkIfAlive(id);

            if (data[id]["prisonFreeEscape"]) {
              turnQueue(id);
            }
            //������� ������� ����������
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
//������� ��� ��������� ����� ��� ��������� ����� � �����
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
//������ ����� ��� �����
function getChance() {
    var temp = chance.pop();
    if (temp != 15) {
        chance.unshift(temp);
    }

    return temp;
}
//������ ����� ��� ������������ �����
function getCommunity() {
    var temp = community.pop();
    if (temp !=2) {
        community.unshift(temp);
    }

    return temp;
}
//������������ �����
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
//� ����������� �� ����� ���������� �������� � ��������
function setHouseBuildMoney(id, buildPrice) {
    var temp = buildPrice.split('');
    buildPrice = parseInt(temp.slice(0, temp.length-1).join(''));
    if (temp[temp.length-1] == 'm') {
        data[id]["money"] -= buildPrice;
    } else if (temp[temp.length-1] == 'p') {
        data[id]["money"] += buildPrice;
    }
}
//��������� �������
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
//�������� ������ ��� ��������
function publishAuction() {
    clients.forEach(function (res) {
        res.statusCode = 200;
        res.end(JSON.stringify(auctionObject));
    });
    clients = [];
}
//�������� ������
function publish(id) {
    for(var key in data) console.log(key);
    console.log('length :'+clients.length);
    console.log('turn #'+number++);

    clients.forEach(function(res) {
        res.statusCode = 200;
        res.end(JSON.stringify(data));
    });

    clients = [];
    //��� ��������� - �������
    deleteProperty(id, "last");

    //���� ������ ���� ������
    deleteProperty(id, 'giveMoney');

    //���� �������� �� -������
    deleteProperty(id, "badCell");

    //���� ��������
    deleteProperty(id, "isDead");

    //���������� ����� �� ������
    deleteProperty(id, "prisonFreeEscape");

    //����� ������� �� ��������� �����
    deleteProperty(id, "payForStreet");
    deleteProperty(id, "to");

    //����� �����
    deleteProperty(id, "bought");
    deleteProperty(id, "forPrice");
    //������ �����
    deleteProperty(id, "sale");

    //���� ������� �������� �����
    deleteProperty(id, "street");

    //��� ������� �������������
    deleteProperty(id, "houseBuild");
    deleteProperty(id, "buildPrice");
    //���� ��� ������������ �����
    deleteProperty(id, "chance");
    deleteProperty(id, "community");
    data[id]["chance"] = data[id]["community"] = null;

    if (data[id]["isDead"]) delete data[id];

}
//���������� ����� �������, ���� ���� �����
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
//��������
function subscribe(res) {
    clients.push(res);
    res.on('close', function () {
        clients.splice(clients.indexOf(res), 1);
    });
}
//��������� ��� ��
function checkIfAlive(id) {
    if (data[id]["money"] < 0) {
        data[id]["isDead"] = true;
    }
}
//��������� turn=true ���������� � �������
function turnQueue(id) {
    try {
        //�������� � ������ ��������� ���������� ������
        var result = data[id]["cubes"].split(':');

        //����  //��������
                //�� ����� � ������
                //�� ������� ����� �� �
                //���������� ������ ������
        if (data[id]["isDead"] ||
            data[id]["toPrison"] ||
            data[id]["prisonFreeEscape"] ||
            result[0] != result[1]) {

            //���������� ���-�� ������
            data[id]["doublesInRow"] = 0;  //0

            //��������� ��� ��������� ������
            data[id]["turn"] = false;

            //���� ��������� �����
            setNewTurnIfDead(id);

            //�������� ���������� ID
            var currentInnerId = data[id]["innerId"];

            //��������� ��� �� 1
            currentInnerId++;

            //���� �� ����� ���������, ��������� ��� �� ������
            if (currentInnerId == innerId) currentInnerId = 0;

            //�������� ������ �� ������ ID
            for (var key in data) {
                //���� ����� ���, �� ���������� ��� ���� ��� � true
                if (data[key]["innerId"] == currentInnerId) {
                    data[key]["turn"] = true;
                    console.log('turning the Turn');
                    console.log('next turn of id:'+key);
                }
            }

        } else {
            if (result[0] == result[1]) {
                //����� ���� �����. ��������� ���-�� ��������� ������
                data[id]["doublesInRow"]++;
            }

        }

    } catch (e) {
        console.log('on TURN QUEUE\n'+e);
    }
}


//����� id ����, ��� ������� ������� �����
function showWhoIsNext() {
    for (var key in data) {
        if (data[key]["turn"]) return key;
    }
}
//�������� ��������� ������ �������
function getThrownResult() {
    return getRandomInt() + ':' + getRandomInt();
}

//��������� ���������� ������� �������
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
//�������� ����� �� ���������� ������
function getSum (val) {
    val = val.split(':');
    return parseInt(val[0]) + parseInt(val[1]);
}

//��������� ������
function sendData(id) {
    try {
            if (clients.length == Object.keys(data).length) {
                console.log('sendData length:'+clients.length);

                clients.forEach(function(res) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                });

                clients = [];

                //��� ��������� - �������
                deleteProperty(id, "last");

                //���� ������ ���� ������
                deleteProperty(id, 'giveMoney');

                //���� �������� �� -������
                deleteProperty(id, "badCell");

                //���� ��������
                deleteProperty(id, "isDead");


                //���������� ����� �� ������
                deleteProperty(id, "prisonFreeEscape");
            }
    } catch (e) {
        console.log('onSendData\n'+e);
    }
}
//������� �������� ���� ����
function deleteProperty(id, property) {
    if (data[id][property]) delete data[id][property];
}

//���������� ��������� �������
function setCoords(coords, id, cell) {
    try {
        data[id]["position"] = coords;
        data[id]["cell"] = cell;
    } catch (e) {
        console.log('on Coords\n'+e);
        console.log(id);
    }
}
//��������� ���� �� ID
function checkId(res, id) {
    if (data[id] == 'undefined') {
        res.end('no such id');
    }
}
//������������� ������ � ������� ID
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
//������������
function onConnect(res, name) {
    // �������� id � ��� ��������� ���������
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

//�������� id
function getId() {
    return Math.round(Math.random() * 100);
}

//���������� ����� ��� ������ �������
// ���������� ��������� ����� ����� ����� min (������������) � max (�� ������� // max)
function getRandomInt(min, max) {
    min = min || 1;
    max = max || 7;
  return Math.floor(Math.random() * (max - min)) + min;
}
