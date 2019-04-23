var moment = require('moment');
var cheerio = require('cheerio-httpcli');
var express = require('express');
var router = express.Router();

var momentObject = moment();
var param = {};

cheerio.set('headers', { // 크롤링 방지 우회를 위한 User-Agent setting 
    'user-agent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36', 
    'Accept-Charset': 'utf-8' 
});

//학생 식당 식단 정보 조회
router.get('/getStudentRestaurantMenu', function(request, response, next) {
    var getDate = request.param("date");
    var addressDate;
    var studentRestaurantAddress
    momentObject.format('YYYY-MM-DD');
    
    if(getDate == undefined) {
        addressDate = momentObject.format('YYYY-MM-DD');
        //클라이언트로 데이터 수신이 되지 않으면 오늘 날짜로 설정
    } else {
        //클라이언트로 부터 데이터 수신 시 날짜를 입력해준다.
        addressDate = getDate;
    }

    if(moment(addressDate).day() == 0) {
        studentRestaurantAddress = "http://www.kumoh.ac.kr/ko/restaurant01.do?mode=menuList&srDt=" + moment(addressDate).subtract(1,"days").format("YYYY-MM-DD");
        addressDate = moment(addressDate).subtract(1,"days").format("YYYY-MM-DD");
    } else {
        studentRestaurantAddress = "http://www.kumoh.ac.kr/ko/restaurant01.do?mode=menuList&srDt=" + addressDate;
    }

    var day = moment(addressDate).day();

    cheerio.fetch(studentRestaurantAddress, param, function(err, $, res){ 
        if(err){ 
            console.log(err); 
            return; 
        }

        var jsonArray = new Array();
        var day_count = 1;
        var meal_count = 1;
        
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
            //var menu_index = 0;
            $(this).find('li').each( function() {
                //console.log(menu_index + " : " + $(this).text())
                array.push($(this).text());
                //menu_index++;
            });
            jsonObject.count = $(this).find('li').length;
            jsonObject.menu = array;
            jsonArray.push(jsonObject);

            if(day_count == 7) {
                day_count = 1;
                meal_count++;
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
