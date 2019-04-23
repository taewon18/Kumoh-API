# Kumoh-API
Description
- 개인 프로젝트로 학과정보를 제공하는 안드로이드 어플리케이션 및 API서버 개발 예정
- 제공 기능 : 식단 정보, 330 예약 및 조회(생각중), 버스 정보, SE 게시판 조회
- Node.js Express

2019-04-22 최초개발
- 학생식단정보조회 API 개발 완료
- GET(/se/getStudentRestaurantMenu), HTTP Method : GET, Params : date=2019-04-21 (날짜 미입력 시 당일 날짜로 조회)
- Request, Cheerio 모듈을 사용하여 학교 홈페이지 크롤링, 학교 홈페이지 변경에 따라 기능이 제공되지 않을 수 있음 
- 교직원 및 기숙사 식당 개발 예정

2019-04-23
- 식당 식단 정보 조회 : 2019-04-23 15:08 완료 홍태원(htw1800@naver.com, 010-7415-8285)
- HTTP Methods : GET, QUERY : date(날짜), classification(식당 분류)
- date(날짜) 쿼리 형식 : YYYY-MM-DD (전송하지 않을 시 오늘 날짜)
- classification(식당 분류) 쿼리 형식 : 1(학생식당), 2(교직원식당), 3(푸름관식당), 4(오름관1동식당), 5(오름관3동식당) (전송하지 않을 시 학생식당)
- date(날짜) 출력 형식 : YYYY-MM-DD 
- count(메뉴 수, 운영안함 텍스트도 포함, 크롤링 기반이기 때문에 클라이언트에서 따로 처리할 것) : String
- meal_count(식사 구분) : 1(아침), 2(점심), 3(저녁), 4(특식)
