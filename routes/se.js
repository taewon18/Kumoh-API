var moment = require('moment');
var cheerio = require('cheerio-httpcli');
var express = require('express');
var router = express.Router();

var momentObject = moment();
var param = {};

var studentRestaurantAddress = "http://www.kumoh.ac.kr/ko/restaurant01.do?mode=menuList&srDt=";
var employeeRestaurantAddress = "http://www.kumoh.ac.kr/ko/restaurant02.do?mode=menuList&srDt=";
var dormBlueRestaurantAddress = "http://dorm.kumoh.ac.kr/dorm/restaurant_menu01.do?mode=menuList&srDt=";
var dormUp1RestaurantAddress = "http://dorm.kumoh.ac.kr/dorm/restaurant_menu02.do?mode=menuList&srDt=";
var dormUp3RestaurantAddress = "http://dorm.kumoh.ac.kr/dorm/restaurant_menu03.do?mode=menuList&srDt=";

cheerio.set('headers', { // 크롤링 방지 우회를 위한 User-Agent setting 
    'user-agent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36', 
    'Accept-Charset': 'utf-8' 
});

/*
식당 식단 정보 조회 : 2019-04-23 15:08 완료 홍태원(htw1800@naver.com, 010-7415-8285)
HTTP Methods : GET, QUERY : date(날짜), classification(식당 분류)
date(날짜) 쿼리 형식 : YYYY-MM-DD (전송하지 않을 시 오늘 날짜)
classification(식당 분류) 쿼리 형식 : 1(학생식당), 2(교직원식당), 3(푸름관식당), 4(오름관1동식당), 5(오름관3동식당) (전송하지 않을 시 학생식당)
date(날짜) 출력 형식 : YYYY-MM-DD 
count(메뉴 수, 운영안함 텍스트도 포함, 크롤링 기반이기 때문에 클라이언트에서 따로 처리할 것) : String
meal_count(식사 구분) : 1(아침), 2(점심), 3(저녁), 4(특식)
*/
router.get('/getRestaurantMenu', function(request, response, next) {
    var getDate = request.query.date;
    var getRestaurantClassfication = request.query.classification;
    var addressDate, day, restaurantAddress, start_count, add_count;    //start_count : 식사 시작 초기값, add_count : 식사 증감 값
    
    if(getDate == undefined) {
        addressDate = momentObject.format('YYYY-MM-DD');
        getDate = addressDate;
        //클라이언트로 데이터 수신이 되지 않으면 오늘 날짜로 설정
    } else {
        addressDate = getDate;
        //클라이언트로 부터 데이터 수신 시 날짜를 입력해준다.
    }

    if(getRestaurantClassfication == undefined) {
        getRestaurantClassfication = "1";
    }

    if(moment(addressDate).day() == 0) {
        addressDate = moment(getDate).subtract(1,"days").format("YYYY-MM-DD");
    }

    switch(getRestaurantClassfication) { //쿼리로 받은 식당 분류, 식당 별로 식사 구분을 위해 count값을 달리함
        case "1" : restaurantAddress = studentRestaurantAddress + addressDate;
                    start_count = 1;
                    add_count = 1;
            break;
        case "2" : restaurantAddress = employeeRestaurantAddress + addressDate;
                    start_count = 2;
                    add_count = 1;
            break;
        case "3" : restaurantAddress = dormBlueRestaurantAddress + addressDate;
                    start_count = 2;
                    add_count = 1;
            break;
        case "4" : restaurantAddress = dormUp1RestaurantAddress + addressDate;
                    start_count = 1;
                    add_count = 2;
            break;
        case "5" : restaurantAddress = dormUp3RestaurantAddress + addressDate;
                    start_count = 2;
                    add_count = 1;
            break;
    }
    
    day = moment(addressDate).day();

    cheerio.fetch(restaurantAddress, param, function(err, $, res){ 
        if(err){ 
            console.log(err); 
            return; 
        }

        var jsonArray = new Array();
        var day_count = 1;
        var meal_count = start_count;
        
        $(".s-dot").each( function() {
            //console.log($(this).find('li').length);
            var select_date;

            if(day > day_count){
                select_date = moment(addressDate).subtract(day-day_count,"days").format("YYYY-MM-DD");
            } else if(day == day_count) {
                select_date = moment(addressDate).format("YYYY-MM-DD");
            } else if(day < day_count){
                select_date = moment(addressDate).add(day_count-day,"days").format("YYYY-MM-DD");
            }

            var array = [];
            var jsonObject = new Object();
            jsonObject.date = select_date;
            jsonObject.meal_count = meal_count;
            
            $(this).find('li').each( function() {
                array.push($(this).text());
            });
            jsonObject.count = $(this).find('li').length;
            jsonObject.menu = array;
            jsonArray.push(jsonObject);

            if(day_count == 7) {
                day_count = 1;
                meal_count = meal_count + add_count;
            } else {
                day_count++;
            }
        });

        var selectArray = new Array();

        for(var i = 0; i < jsonArray.length; i++) {
            if(jsonArray[i].date == getDate) {
                selectArray.push(jsonArray[i]);
            }
        }
        
        response.send(JSON.stringify(selectArray));
    });
});

module.exports = router;
