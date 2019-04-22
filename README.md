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
